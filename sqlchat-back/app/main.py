from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, users, connections, query
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
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"],
)

@app.on_event("startup")
async def on_startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

@app.get("/", include_in_schema=False)
async def root():
    return {"message": "SQLChat API en funcionamiento"}

app.include_router(auth.router,        prefix="/auth",        tags=["auth"])
app.include_router(users.router,       prefix="/users",       tags=["users"])
app.include_router(connections.router, prefix="/connections", tags=["connections"])
app.include_router(query.router,       prefix="/query",       tags=["query"])