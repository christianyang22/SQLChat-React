import re

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.pool import NullPool
from sqlalchemy import text

from app.db.session import get_db
from app.core.security import verify_access_token
from app.schemas.query import QueryRequest, QueryResult
from app.crud.connection import get_connection
from app.services.openai_client import ask_openai
from app.services.sql_introspect import describe_schema
from app.services.schema_cache import get as cache_get, set as cache_set
from app.services.sql_executor import execute_sql, _build_dsn

router = APIRouter(tags=["query"])


def _clean_sql(raw: str) -> str:
    return re.sub(r"```(?:sql)?|```", "", raw).strip()


def _extract_table(sql: str) -> str | None:
    m = re.match(
        r"\s*(?:UPDATE|DELETE\s+FROM|INSERT\s+INTO)\s+([^\s;]+)",
        sql,
        re.IGNORECASE,
    )
    return m.group(1) if m else None


@router.post("/", response_model=QueryResult)
async def run_query(
    req: QueryRequest,
    confirm: bool = Query(False),
    token: dict = Depends(verify_access_token),
    db: AsyncSession = Depends(get_db),
) -> QueryResult:
    owner_id = int(token["sub"])
    info = await get_connection(db, req.connection_id, owner_id)
    if not info:
        raise HTTPException(status_code=404, detail="Connection not found")

    schema = cache_get(info.id)
    if schema is None:
        dsn = _build_dsn(
            info.engine,
            info.host,
            info.port,
            info.user,
            info.password,
            info.database,
        )
        engine_introspect = create_async_engine(dsn, poolclass=NullPool)
        async with engine_introspect.connect() as conn:
            schema = await describe_schema(conn, info.engine)
        cache_set(info.id, schema)

    try:
        raw_sql = await ask_openai(req.question, schema)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"OpenAI error: {e}"
        ) from e

    sql = _clean_sql(raw_sql)
    is_mutation = bool(re.match(r"^(INSERT|UPDATE|DELETE)", sql.strip(), re.IGNORECASE))
    table = _extract_table(sql) if is_mutation else None

    if is_mutation and not confirm:
        if not table:
            raise HTTPException(
                status_code=400,
                detail="No se pudo determinar la tabla para la previsualización"
            )

        dsn = _build_dsn(
            info.engine,
            info.host,
            info.port,
            info.user,
            info.password,
            info.database,
        )
        engine_target = create_async_engine(dsn, poolclass=NullPool)
        async with engine_target.connect() as conn:
            trans = await conn.begin()
            sp = await conn.begin_nested()
            await conn.execute(text(sql))
            result = await conn.execute(text(f"SELECT * FROM {table}"))
            rows_preview = result.mappings().all()
            await sp.rollback()
            await trans.rollback()

        return QueryResult(sql=sql, rows=[dict(r) for r in rows_preview])

    try:
        dsn = _build_dsn(
            info.engine,
            info.host,
            info.port,
            info.user,
            info.password,
            info.database,
        )
        engine_target = create_async_engine(dsn, poolclass=NullPool)
        async with engine_target.begin() as conn:
            result = await conn.execute(text(sql))
            if is_mutation:
                rows_final: list[dict] = []
            else:
                rows_final = [dict(r) for r in result.mappings().all()]

        return QueryResult(sql=sql, rows=rows_final)

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"SQL execution error: {e}"
        ) from e