from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy.pool import NullPool

from app.crud.connection import get_connection
from app.services.schema_cache import get as cache_get, set as cache_set
from app.services.sql_introspect import describe_schema
from app.db.session import get_db
from app.core.security import verify_access_token

router = APIRouter()

@router.get("", response_model=List[str])
async def list_tables(
    connection_id: int = Query(..., description="ID de la conexión"),
    token: dict = Depends(verify_access_token),
    db = Depends(get_db),
):
    owner_id = int(token["sub"])
    info = await get_connection(db, connection_id, owner_id)
    if not info:
        raise HTTPException(404, "Connection not found")

    schema = cache_get(info.id)
    if schema is None:
        from app.services.sql_executor import _build_dsn
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

    tables: List[str] = []
    for line in schema.splitlines():
        if not line.strip():
            continue
        tabla = line.split(".", 1)[0]
        if tabla not in tables:
            tables.append(tabla)
    return tables