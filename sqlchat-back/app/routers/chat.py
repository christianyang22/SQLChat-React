from fastapi import APIRouter, Depends, HTTPException
from pydantic  import BaseModel
from app.services.openai_client import ask_openai
from app.core.security import verify_access_token

router = APIRouter(tags=["chat"])

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    text: str

@router.post("/", response_model=ChatResponse)
async def chat(
    req: ChatRequest,
    token: dict = Depends(verify_access_token)
):
    try:
        texto = await ask_openai(req.message, "")
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"OpenAI error: {e}")
    return ChatResponse(text=texto)