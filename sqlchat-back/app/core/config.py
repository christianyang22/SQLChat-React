from pydantic import AnyHttpUrl
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    secret_key: str
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 24 * 60
    database_url: str
    openai_api_key: str
    frontend_url: AnyHttpUrl

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()