from sqlalchemy.ext.asyncio import AsyncConnection

async def describe_schema(conn: AsyncConnection, engine: str) -> str:
    """
    Devuelve una descripción textual (< 15 000 car.) del esquema de la BD
    en el formato:  tabla.columna  tipo
    """
    if engine == "postgres":
        sql = """
        SELECT table_name      AS t,
               column_name     AS c,
               data_type       AS dt
        FROM information_schema.columns
        WHERE table_schema = 'public'
        ORDER BY table_name, ordinal_position;
        """
        rows = await conn.exec_driver_sql(sql)

    elif engine == "mysql":
        sql = """
        SELECT table_name  AS t,
               column_name AS c,
               data_type   AS dt
        FROM information_schema.columns
        WHERE table_schema = DATABASE()
        ORDER BY table_name, ordinal_position;
        """
        rows = await conn.exec_driver_sql(sql)

    elif engine == "sqlite":
        rows = []
        tbls = await conn.exec_driver_sql(
            "SELECT name FROM sqlite_master WHERE type='table';"
        )
        for (tbl,) in tbls:
            cols = await conn.exec_driver_sql(f"PRAGMA table_info('{tbl}');")
            rows += [(tbl, c[1], c[2]) for c in cols]

    else:
        raise ValueError("Engine not supported")

    lines = [f"{t}.{c} {dt}" for t, c, dt in rows]
    return "\n".join(lines)[:15_000]