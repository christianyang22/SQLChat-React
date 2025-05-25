from pydantic import BaseModel, EmailStr, Field
from datetime import date
from app.schemas.user import User

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class UserRegister(BaseModel):
    nombre: str
    apellido: str
    birth_date: date = Field(..., alias="birthDate")
    email: EmailStr
    password: str

    model_config = {
        "populate_by_name": True
    }

class Token(BaseModel):
    token: str
    user: User

    model_config = {
        "from_attributes": True
    }