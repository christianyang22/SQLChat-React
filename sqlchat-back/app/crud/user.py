# app/crud/user.py

from typing import Optional, Tuple
from datetime import date

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.models.user import User as DBUser
from app.models.preferences import Preferences as DBPreferences
from app.schemas.auth import UserRegister
from app.schemas.user import UserUpdate
from app.schemas.preferences import PreferencesUpdate
from app.core.security import (
    get_password_hash,
    create_access_token,
    verify_password,
)

async def get_user_by_email(db: AsyncSession, email: str) -> Optional[DBUser]:
    q = await db.execute(select(DBUser).where(DBUser.email == email))
    return q.scalars().first()


async def get_user_by_id(db: AsyncSession, user_id: int) -> Optional[DBUser]:
    q = await db.execute(select(DBUser).where(DBUser.id == user_id))
    return q.scalars().first()


def authenticate_user(user: DBUser, password: str) -> bool:
    return verify_password(password, user.hashed_password)

async def create_user(db: AsyncSession, data: UserRegister) -> Tuple[str, DBUser]:
    hashed = get_password_hash(data.password)
    user = DBUser(
        first_name=data.nombre,
        last_name=data.apellido,
        birth_date=data.birth_date,
        email=data.email,
        hashed_password=hashed,
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)

    prefs = DBPreferences(user_id=user.id)
    db.add(prefs)
    await db.commit()

    token = create_access_token({"sub": str(user.id), "email": user.email})
    return token, user

async def get_preferences(db: AsyncSession, user_id: int) -> Optional[DBPreferences]:
    q = await db.execute(select(DBPreferences).where(DBPreferences.user_id == user_id))
    return q.scalars().first()

async def update_user(
    db: AsyncSession, user_id: int, data: UserUpdate
) -> DBUser:
    user = await get_user_by_id(db, user_id)
    if not user:
        raise ValueError("Usuario no encontrado")

    if data.first_name is not None:
        user.first_name = data.first_name
    if data.last_name is not None:
        user.last_name = data.last_name
    if data.email is not None:
        user.email = data.email

    if data.passAct and data.passNew:
        if not verify_password(data.passAct, user.hashed_password):
            raise ValueError("Contraseña actual incorrecta")
        user.hashed_password = get_password_hash(data.passNew)

    await db.commit()
    await db.refresh(user)
    return user

async def update_preferences(
    db: AsyncSession, user_id: int, data: PreferencesUpdate
) -> DBPreferences:
    prefs = await get_preferences(db, user_id)
    if prefs is None:
        # Crear preferencias si no existen
        prefs = DBPreferences(user_id=user_id)
        db.add(prefs)
        await db.commit()
        await db.refresh(prefs)

    upd = data.dict(exclude_unset=True, by_alias=True)
    if "notifications" in upd:
        prefs.notifications = upd["notifications"]
    if "dark_theme" in upd:
        prefs.dark_theme = upd["dark_theme"]
    if "language" in upd:
        prefs.language = upd["language"]

    await db.commit()
    await db.refresh(prefs)
    return prefs