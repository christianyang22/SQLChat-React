from pydantic import BaseModel, Field
from typing import Literal, Optional

Lang = Literal["en", "es"]

class PreferencesResponse(BaseModel):
    notifications: bool
    dark_theme: bool = Field(..., alias="dark_theme")
    language: Lang

    model_config = {
        "from_attributes": True,
        "populate_by_name": True,
    }

class PreferencesUpdate(BaseModel):
    notifications: Optional[bool] = None
    dark_theme: Optional[bool] = None
    language: Optional[Lang] = None

    model_config = {
        "populate_by_name": True,
    }