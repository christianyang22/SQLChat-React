from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.sql import text
from sqlalchemy.pool import NullPool

from app.schemas.connection import ConnectionCreate, ConnectionOut
from app.crud.connection import (
    get_connections,
    create_connection,
    update_connection,
    delete_connection,
)
from app.core.security import verify_access_token
from app.db.session import get_db

import os

router = APIRouter(tags=["connections"])

@router.get("", response_model=list[ConnectionOut])
async def list_connections(
    token: dict = Depends(verify_access_token),
    db: AsyncSession = Depends(get_db),
):
    owner_id = int(token["sub"])
    return await get_connections(db, owner_id)

@router.post("", response_model=ConnectionOut, status_code=status.HTTP_201_CREATED)
async def add_connection(
    conn: ConnectionCreate,
    token: dict = Depends(verify_access_token),
    db: AsyncSession = Depends(get_db),
):
    owner_id = int(token["sub"])
    return await create_connection(db, owner_id, conn)

@router.put("/{conn_id}", response_model=ConnectionOut)
async def modify_connection(
    conn_id: int,
    conn: ConnectionCreate,
    token: dict = Depends(verify_access_token),
    db: AsyncSession = Depends(get_db),
):
    owner_id = int(token["sub"])
    updated = await update_connection(db, conn_id, owner_id, conn)
    if not updated:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
    return updated

@router.delete("/{conn_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_connection(
    conn_id: int,
    token: dict = Depends(verify_access_token),
    db: AsyncSession = Depends(get_db),
):
    owner_id = int(token["sub"])
    deleted = await delete_connection(db, conn_id, owner_id)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)

@router.post("/upload-sql", status_code=status.HTTP_201_CREATED)
async def upload_sql(
    file: UploadFile = File(...),
    engine: str = Form(""),
    host: str = Form(""),
    port: int = Form(0),
    admin_user: str = Form(""),
    admin_password: str = Form(""),
    new_db: str = Form(""),
    name: str = Form(""),
    token: dict = Depends(verify_access_token),
    db: AsyncSession = Depends(get_db),
):
    print("Campos recibidos en /upload-sql:")
    print(f"engine={engine!r}")
    print(f"host={host!r}")
    print(f"port={port!r} (type={type(port)})")
    print(f"admin_user={admin_user!r}")
    print(f"admin_password={admin_password!r}")
    print(f"new_db={new_db!r}")
    print(f"name={name!r}")
    print(f"file={file.filename if file else None}")

    missing_fields = []
    if not engine: missing_fields.append("engine")
    if not host: missing_fields.append("host")
    if not port: missing_fields.append("port")
    if not admin_user: missing_fields.append("admin_user")
    if not admin_password: missing_fields.append("admin_password")
    if not new_db: missing_fields.append("new_db")
    if not name: missing_fields.append("name")
    if not file: missing_fields.append("file")
    if missing_fields:
        raise HTTPException(
            status_code=400,
            detail=f"Faltan los siguientes campos obligatorios: {', '.join(missing_fields)}"
        )

    supported = ["postgres", "mysql", "mariadb"]
    if engine not in supported:
        raise HTTPException(status_code=400, detail="Motor de base de datos no soportado (solo Postgres/MySQL/MariaDB)")

    content = await file.read()
    sql_text = content.decode("utf-8", errors="ignore")
    bad_engines = ["oracle", "sqlserver", "mssql", "db2", "firebird"]
    if any(bad in sql_text.lower() for bad in bad_engines):
        raise HTTPException(status_code=400, detail="El script SQL parece ser de un motor no soportado")

    from sqlalchemy.ext.asyncio import create_async_engine
    from sqlalchemy.pool import NullPool
    from sqlalchemy.sql import text
    from app.services.sql_executor import _build_dsn

    default_db = {
        "postgres": "postgres",
        "mysql": "mysql",
        "mariadb": "mysql"
    }[engine]

    if engine == "postgres":
        import asyncpg
        try:
            conn = await asyncpg.connect(
                user=admin_user,
                password=admin_password,
                database=default_db,
                host=host,
                port=port
            )
            await conn.execute(f'CREATE DATABASE "{new_db}"')
            await conn.close()
        except Exception as e:
            if "already exists" not in str(e):
                raise HTTPException(400, f"Error creando la base de datos: {e}")
    else:
        dsn_admin = _build_dsn(engine, host, port, admin_user, admin_password, default_db)
        admin_engine = create_async_engine(dsn_admin, poolclass=NullPool)
        async with admin_engine.begin() as trans_conn:
            await trans_conn.execute(text(f'CREATE DATABASE `{new_db}`'))

    dsn_admin = _build_dsn(engine, host, port, admin_user, admin_password, default_db)
    admin_engine = create_async_engine(dsn_admin, poolclass=NullPool)

    async with admin_engine.begin() as conn:
        if engine == "postgres":
            try:
                await conn.execute(text(f"CREATE USER \"{admin_user}\" WITH PASSWORD '{admin_password}'"))
            except Exception as e:
                if "already exists" not in str(e) and "duplicate" not in str(e):
                    raise HTTPException(400, f"Error creando usuario: {e}")
        else:
            await conn.execute(
                text(f"CREATE USER IF NOT EXISTS '{admin_user}'@'%' IDENTIFIED BY '{admin_password}'")
            )
        try:
            if engine == "postgres":
                await conn.execute(text(f'GRANT ALL PRIVILEGES ON DATABASE "{new_db}" TO "{admin_user}"'))
            else:
                await conn.execute(text(f"GRANT ALL PRIVILEGES ON `{new_db}`.* TO '{admin_user}'@'%'"))
        except Exception:
            pass

    dsn_target = _build_dsn(engine, host, port, admin_user, admin_password, new_db)
    target_engine = create_async_engine(dsn_target, poolclass=NullPool)
    statements = [s.strip() for s in sql_text.split(";") if s.strip()]
    errores = []

    async with target_engine.begin() as conn_exec:
        for i, stmt in enumerate(statements, 1):
            try:
                await conn_exec.execute(text(stmt))
            except Exception as e:
                errores.append({
                    "num": i,
                    "sql": stmt[:1000],
                    "error": str(e)
                })

    if errores:
        raise HTTPException(
            status_code=400,
            detail={
                "message": "Fallo en la ejecución del SQL",
                "errores": errores
            }
        )

    owner_id = int(token["sub"])
    from app.schemas.connection import ConnectionCreate
    from app.crud.connection import create_connection

    conn_obj = ConnectionCreate(
        engine=engine,
        host=host,
        port=port,
        user=admin_user,
        password=admin_password,
        database=new_db,
        name=name
    )
    connection = await create_connection(db, owner_id, conn_obj)

    return {"status": "ok"}

@router.post("/upload-sqlite", status_code=status.HTTP_201_CREATED)
async def upload_sqlite(
    file: UploadFile = File(...),
    name: str = Form(...),
    database: str = Form(...),
    token: dict = Depends(verify_access_token),
    db: AsyncSession = Depends(get_db),
):
    temp_dir = "/docker_sqlite"
    os.makedirs(temp_dir, exist_ok=True)
    db_path = os.path.join(temp_dir, file.filename)
    content = await file.read()
    with open(db_path, "wb") as f:
        f.write(content)

    if not content.startswith(b"SQLite format 3"):
        raise HTTPException(status_code=400, detail="El archivo no parece ser una base de datos SQLite válida")

    owner_id = int(token["sub"])
    from app.schemas.connection import ConnectionCreate
    from app.crud.connection import create_connection

    relative_db_path = f"/docker_sqlite/{file.filename}"

    conn_obj = ConnectionCreate(
        engine="sqlite",
        host="",
        port=0,
        user="",
        password="",
        database=relative_db_path,
        name=name
    )
    connection = await create_connection(db, owner_id, conn_obj)
    return {"status": "ok", "db_path": relative_db_path}