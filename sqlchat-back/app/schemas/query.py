from pydantic import BaseModel
from typing import Any

class QueryRequest(BaseModel):
    connection_id: int
    question: str

class QueryResult(BaseModel):
    sql: str
    rows: list[dict[str, Any]]