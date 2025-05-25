from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy import text
from sqlalchemy.pool import NullPool
from cachetools import TTLCache
from typing import Any

from app.crud.connection import get_connection

_engine_cache: TTLCache[int, Any] = TTLCache(maxsize=100, ttl=600)


def _build_dsn(
    engine: str,
    host: str,
    port: int,
    user: str,
    password: str,
    database: str,
) -> str:
    host = host.strip()
    user = user.strip()
    password = password.strip()
    database = database.strip()

    if engine == "postgres":
        return f"postgresql+asyncpg://{user}:{password}@{host}:{port}/{database}"
    if engine in ("mysql", "mariadb"):
        return f"mysql+aiomysql://{user}:{password}@{host}:{port}/{database}"
    if engine == "sqlite":
        return f"sqlite+aiosqlite:///{database}"
    raise ValueError("Unsupported engine")


async def execute_sql(
    db: AsyncSession,
    owner_id: int,
    connection_id: int,
    sql: str,
    params: dict | None = None,
) -> list[dict]:
    info = await get_connection(db, connection_id, owner_id)
    if not info:
        raise ValueError("Connection not found")

    if connection_id not in _engine_cache:
        dsn = _build_dsn(
            info.engine,
            info.host,
            info.port,
            info.user,
            info.password,
            info.database,
        )
        _engine_cache[connection_id] = create_async_engine(
            dsn, echo=False, poolclass=NullPool
        )

    engine = _engine_cache[connection_id]
    async with engine.connect() as conn:
        result = await conn.execute(text(sql), params or {})
        if result.returns_rows:
            return [dict(row) for row in result.mappings().all()]
        return [{"rowcount": result.rowcount}]

__all__ = ["_build_dsn", "get_schema_summary", "execute_sql"]