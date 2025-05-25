from datetime import date
from typing import Optional, List
from pydantic import BaseModel, EmailStr, Field

class UserResponse(BaseModel):
    id: int
    first_name: str
    last_name: str
    birth_date: date
    email: EmailStr

    model_config = {
        "from_attributes": True
    }

class UserUpdate(BaseModel):
    first_name: Optional[str] = Field(None, alias="first_name")
    last_name: Optional[str] = Field(None, alias="last_name")
    email: Optional[EmailStr] = None
    passAct: Optional[str] = Field(None, alias="passAct")
    passNew: Optional[str] = Field(None, alias="passNew")

    model_config = {
        "populate_by_name": True
    }

class PreferencesResponse(BaseModel):
    id: int
    user_id: int
    notifications: bool
    darkTheme: bool = Field(..., alias="dark_theme")
    language: str

    model_config = {
        "from_attributes": True
    }

class PreferencesUpdate(BaseModel):
    notifications: Optional[bool] = None
    darkTheme: Optional[bool] = Field(None, alias="darkTheme")
    language: Optional[str] = None

    model_config = {
        "populate_by_name": True
    }

class User(UserResponse):
    pass