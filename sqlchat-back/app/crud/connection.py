from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.connection import Connection as ConnectionModel
from app.schemas.connection import ConnectionCreate

async def get_connections(
    db: AsyncSession, owner_id: int
) -> list[ConnectionModel]:
    res = await db.execute(
        select(ConnectionModel).where(ConnectionModel.owner_id == owner_id)
    )
    return res.scalars().all()

async def get_connection(
    db: AsyncSession, conn_id: int, owner_id: int
) -> ConnectionModel | None:
    res = await db.execute(
        select(ConnectionModel).where(
            ConnectionModel.id == conn_id,
            ConnectionModel.owner_id == owner_id,
        )
    )
    return res.scalars().first()

async def create_connection(
    db: AsyncSession, owner_id: int, data: ConnectionCreate
) -> ConnectionModel:
    obj = ConnectionModel(**data.dict(), owner_id=owner_id)
    db.add(obj)
    await db.commit()
    await db.refresh(obj)
    return obj

async def update_connection(
    db: AsyncSession, conn_id: int, owner_id: int, data: ConnectionCreate
) -> ConnectionModel | None:
    conn = await get_connection(db, conn_id, owner_id)
    if not conn:
        return None

    for field, value in data.dict().items():
        setattr(conn, field, value)

    await db.commit()
    await db.refresh(conn)
    return conn

async def delete_connection(
    db: AsyncSession, conn_id: int, owner_id: int
) -> bool:
    conn = await get_connection(db, conn_id, owner_id)
    if not conn:
        return False
    await db.delete(conn)
    await db.commit()
    return True