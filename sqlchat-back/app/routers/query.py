import re
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, status, Query
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.pool import NullPool
from sqlalchemy import text

from app.db.session import get_db
from app.core.security import verify_access_token
from app.crud.connection import get_connection
from app.services.openai_client import ask_openai
from app.services.sql_introspect import describe_schema
from app.services.schema_cache import get as cache_get, set as cache_set
from app.services.sql_executor import _build_dsn

router = APIRouter(tags=["query"])


class QueryRequest(BaseModel):
    message: str
    table: Optional[str] = None


class QueryResult(BaseModel):
    sql: str
    rows: List[dict]
    connection: dict


def _clean_sql(raw: str) -> str:
    return re.sub(r"```(?:sql)?|```", "", raw).strip()


def _extract_table(sql: str) -> Optional[str]:
    m = re.match(
        r"\s*(?:UPDATE|DELETE\s+FROM|INSERT\s+INTO|TRUNCATE\s+TABLE|TRUNCATE)\s+([^\s;]+)",
        sql,
        re.IGNORECASE,
    )
    return m.group(1) if m else None


@router.post("/", response_model=QueryResult)
async def run_query(
    req: QueryRequest,
    connection_id: int = Query(..., description="ID de la conexión"),
    confirm: bool = Query(False, description="Confirmar mutaciones"),
    token: dict = Depends(verify_access_token),
    db: AsyncSession = Depends(get_db),
) -> QueryResult:
    print("[QUERY] mensaje:", req.message[:200], "conn:", connection_id, "confirm:", confirm)

    owner_id = int(token["sub"])
    info = await get_connection(db, connection_id, owner_id)
    if not info:
        raise HTTPException(status_code=404, detail="Connection not found")

    schema = cache_get(info.id)
    if schema is None:
        dsn = _build_dsn(
            info.engine, info.host, info.port, info.user, info.password, info.database
        )
        engine_introspect = create_async_engine(dsn, poolclass=NullPool)
        async with engine_introspect.connect() as conn:
            schema = await describe_schema(conn, info.engine)
        cache_set(info.id, schema)

    try:
        raw_sql = await ask_openai(req.message, schema)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"OpenAI error: {e}",
        ) from e

    sql = _clean_sql(raw_sql)
    is_mutation = bool(
        re.match(r"^\s*(INSERT|UPDATE|DELETE|CREATE|ALTER|DROP|TRUNCATE)\b", sql, re.IGNORECASE)
    )
    table = req.table or (_extract_table(sql) if is_mutation else None)

    conn_meta = {
        "id": info.id,
        "name": info.name,
        "engine": info.engine,
        "host": info.host,
        "port": info.port,
        "database": info.database,
    }

    if is_mutation and not confirm:
        if not table:
            raise HTTPException(
                status_code=400,
                detail="No se pudo determinar la tabla para la previsualización",
            )
        dsn = _build_dsn(
            info.engine, info.host, info.port, info.user, info.password, info.database
        )
        engine_target = create_async_engine(dsn, poolclass=NullPool)
        async with engine_target.connect() as conn:
            tx = await conn.begin()
            nested = await conn.begin_nested()
            await conn.execute(text(sql))
            result = await conn.execute(text(f"SELECT * FROM {table} LIMIT 100"))
            preview = [dict(r) for r in result.mappings().all()]
            await nested.rollback()
            await tx.rollback()
        return QueryResult(sql=sql, rows=preview, connection=conn_meta)

    try:
        dsn = _build_dsn(
            info.engine, info.host, info.port, info.user, info.password, info.database
        )
        engine_target = create_async_engine(dsn, poolclass=NullPool)
        async with engine_target.begin() as conn:
            result = await conn.execute(text(sql))
            if is_mutation:
                refreshed: List[dict] = []
                tbl = table or _extract_table(sql)
                if tbl:
                    res2 = await conn.execute(text(f"SELECT * FROM {tbl} LIMIT 100"))
                    refreshed = [dict(r) for r in res2.mappings().all()]
                final_rows = refreshed
            else:
                final_rows = [dict(r) for r in result.mappings().all()]
        return QueryResult(sql=sql, rows=final_rows, connection=conn_meta)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"SQL execution error: {e}",
        ) from e