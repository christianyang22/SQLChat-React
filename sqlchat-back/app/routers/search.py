from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import httpx
import os

router = APIRouter(tags=["search"])

class SearchRequest(BaseModel):
    query: str

class SearchResponse(BaseModel):
    result: str

SERPAPI_KEY = os.getenv("SERPAPI_KEY")

@router.post("/", response_model=SearchResponse)
async def web_search(req: SearchRequest):
    if not SERPAPI_KEY:
        raise HTTPException(
            status_code=500,
            detail="SerpAPI no configurado. Falta SERPAPI_KEY en .env"
        )

    url = "https://serpapi.com/search"
    params = {
        "q": req.query,
        "engine": "google",
        "hl": "es",
        "gl": "es",
        "api_key": SERPAPI_KEY
    }

    async with httpx.AsyncClient() as client:
        resp = await client.get(url, params=params, timeout=10)

    if resp.status_code != 200:
        raise HTTPException(
            status_code=502,
            detail=f"SerpAPI error: {resp.text}"
        )

    data = resp.json()
    organic_results = data.get("organic_results", [])
    snippets = [
        f"- {item.get('title', 'Sin título')}:\n  {item.get('snippet', item.get('link', ''))}"
        for item in organic_results[:3]
    ]
    text = "\n\n".join(snippets) or "No se encontraron resultados."
    return SearchResponse(result=text)