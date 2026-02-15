from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .db import init_engine
from .routers import forums, committees, sessions, posts, delegates

app = FastAPI(title="RIMUN FastAPI Gateway", version="0.1.0")

# CORS: allow GETs from any origin by default; tighten in prod
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["GET", "HEAD", "OPTIONS"],
    allow_headers=["*"]
)


@app.on_event("startup")
async def _startup() -> None:
    await init_engine()


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}


app.include_router(forums.router)
app.include_router(committees.router)
app.include_router(sessions.router)
app.include_router(posts.router)
app.include_router(delegates.router)
