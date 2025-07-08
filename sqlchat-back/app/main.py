from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import auth, users, connections, query, tables, chat, search
from app.routers.search import router as search_router
from app.db.session import engine
from app.db.base import Base

app = FastAPI(
    title="SQLChat API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def on_startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

app.include_router(auth.router,        prefix="/auth",        tags=["auth"])
app.include_router(users.router,       prefix="/users",       tags=["users"])
app.include_router(connections.router, prefix="/connections", tags=["connections"])
app.include_router(query.router,       prefix="/query",       tags=["query"])
app.include_router(tables.router,      prefix="/tables",      tags=["tables"])
app.include_router(chat.router,        prefix="/chat",        tags=["chat"])
app.include_router(search.router,      prefix="/search",      tags=["search"])