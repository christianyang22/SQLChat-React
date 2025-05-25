from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.pool import NullPool

from app.db.session import get_db
from app.core.security import verify_access_token
from app.schemas.query import QueryRequest, QueryResult
from app.crud.connection import get_connection
from app.services.openai_client import ask_openai
from app.services.sql_introspect import describe_schema
from app.services.schema_cache import get as cache_get, set as cache_set
from app.services.sql_executor import execute_sql, _build_dsn

router = APIRouter(tags=["query"])

@router.post("/", response_model=QueryResult)
async def run_query(
    req: QueryRequest,
    token: dict = Depends(verify_access_token),
    db: AsyncSession = Depends(get_db),
) -> QueryResult:
    owner_id = int(token["sub"])

    info = await get_connection(db, req.connection_id, owner_id)
    if not info:
        raise HTTPException(status_code=404, detail="Connection not found")

    schema = cache_get(info.id)
    if schema is None:
        dsn = _build_dsn(info.engine, info.host, info.port,
                         info.user, info.password, info.database)
        engine = create_async_engine(dsn, poolclass=NullPool)
        async with engine.connect() as conn:
            schema = await describe_schema(conn, info.engine)
        cache_set(info.id, schema)

    try:
        sql = await ask_openai(req.question, schema)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY,
                            detail=f"OpenAI error: {e}") from e

    try:
        rows = await execute_sql(
            db=db,
            owner_id=owner_id,
            connection_id=req.connection_id,
            sql=sql,
        )
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail=f"SQL execution error: {e}") from e

    return QueryResult(sql=sql, rows=rows)