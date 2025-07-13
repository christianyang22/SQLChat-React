from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import httpx
import os

router = APIRouter(tags=["search"])

class SearchRequest(BaseModel):
    query: str

class SearchResult(BaseModel):
    title: str
    snippet: str
    link: str = None

class SearchResponse(BaseModel):
    result: SearchResult

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
        "num": 5,
        "safe": "active",
        "device": "desktop",
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
    if "answer_box" in data:
        abox = data["answer_box"]
        if "answer" in abox:
            return SearchResponse(result=SearchResult(
                title="Respuesta directa",
                snippet=abox.get("answer"),
                link=abox.get("link", "")
            ))
        elif "snippet" in abox:
            return SearchResponse(result=SearchResult(
                title="Respuesta directa",
                snippet=abox.get("snippet"),
                link=abox.get("link", "")
            ))
    organic_results = data.get("organic_results", [])
    if organic_results:
        keywords = set(word.lower() for word in req.query.split() if len(word) > 2)
        def relevance(item):
            snippet = item.get("snippet", "").lower()
            title = item.get("title", "").lower()
            return (sum(kw in snippet or kw in title for kw in keywords), len(snippet))
        best = max(organic_results, key=relevance)
        return SearchResponse(result=SearchResult(
            title=best.get('title', 'Sin título'),
            snippet=best.get('snippet', '') or '',
            link=best.get('link', '')
        ))
    else:
        return SearchResponse(result=SearchResult(
            title="Sin resultados",
            snippet="No se encontraron resultados.",
            link=""
        ))