from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.security import verify_access_token
from app.db.session import get_db
from app.crud.user import (
    get_user_by_id,
    update_user,
    get_preferences,
    update_preferences,
)
from app.schemas.user import UserResponse, UserUpdate, PreferencesUpdate

router = APIRouter(tags=["users"])

@router.get("/me", response_model=UserResponse)
async def read_users_me(
    token: dict = Depends(verify_access_token),
    db: AsyncSession = Depends(get_db),
):
    user_id = int(token["sub"])
    user = await get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return user

@router.put("/me", response_model=UserResponse)
async def edit_users_me(
    payload: UserUpdate,
    token: dict = Depends(verify_access_token),
    db: AsyncSession = Depends(get_db),
):
    user_id = int(token["sub"])
    try:
        user = await update_user(db, user_id, payload)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    return user

@router.get("/preferences")
async def read_preferences(
    token: dict = Depends(verify_access_token),
    db: AsyncSession = Depends(get_db),
):
    user_id = int(token["sub"])
    prefs = await get_preferences(db, user_id)
    if not prefs:
        raise HTTPException(status_code=404, detail="Preferencias no encontradas")
    return {
        "notifications": prefs.notifications,
        "darkTheme": prefs.dark_theme,
        "language": prefs.language,
    }

@router.put("/preferences")
async def edit_preferences(
    payload: PreferencesUpdate,
    token: dict = Depends(verify_access_token),
    db: AsyncSession = Depends(get_db),
):
    user_id = int(token["sub"])
    prefs = await update_preferences(db, user_id, payload)
    return {
        "notifications": prefs.notifications,
        "darkTheme": prefs.dark_theme,
        "language": prefs.language,
    }