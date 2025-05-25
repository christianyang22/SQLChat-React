from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.schemas.connection import ConnectionCreate, ConnectionOut
from app.crud.connection      import (
    get_connections,
    create_connection,
    update_connection,
    delete_connection,
)
from app.core.security import verify_access_token
from app.db.session    import get_db

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