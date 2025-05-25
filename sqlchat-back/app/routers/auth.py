from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.crud.user import get_user_by_email, authenticate_user, create_user
from app.schemas.auth import LoginRequest, Token, UserRegister
from app.core.security import create_access_token
from app.db.session import get_db

router = APIRouter(tags=["auth"])

@router.post("/login", response_model=Token)
async def login(data: LoginRequest, db: AsyncSession = Depends(get_db)):
    user = await get_user_by_email(db, data.email)
    if not user or not authenticate_user(user, data.password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Credenciales inválidas")
    token = create_access_token({"sub": str(user.id), "email": user.email})
    return Token(token=token, user=user)

@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
async def register(data: UserRegister, db: AsyncSession = Depends(get_db)):
    existing = await get_user_by_email(db, data.email)
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="El correo ya está registrado")
    token, user = await create_user(db, data)
    return Token(token=token, user=user)

@router.post("/logout")
async def logout():
    return {"ok": True}