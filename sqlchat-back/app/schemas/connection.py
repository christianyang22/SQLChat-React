from pydantic import BaseModel, Field


class ConnectionBase(BaseModel):
    name: str
    host: str
    port: int
    user: str
    password: str
    database: str
    engine: str = Field("postgres")


class ConnectionCreate(ConnectionBase):
    """Payload que llega desde el front cuando el usuario guarda una conexión."""
    pass


class ConnectionOut(ConnectionBase):
    id: int
    owner_id: int

    model_config = {"from_attributes": True}