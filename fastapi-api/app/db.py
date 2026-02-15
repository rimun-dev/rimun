import re
from typing import AsyncIterator

from sqlalchemy import MetaData
from sqlalchemy.ext.asyncio import AsyncEngine, AsyncSession, async_sessionmaker, create_async_engine

from .config import settings

_metadata = MetaData()
_engine: AsyncEngine | None = None
_Session: async_sessionmaker[AsyncSession] | None = None


def _to_asyncpg_url(url: str) -> str:
    # Convert postgresql://... to postgresql+asyncpg://... if needed
    if url.startswith("postgresql+asyncpg://"):
        return url
    return re.sub(r"^postgresql://", "postgresql+asyncpg://", url)


async def init_engine() -> None:
    global _engine, _Session
    if _engine is not None:
        return
    async_url = _to_asyncpg_url(settings.DATABASE_URL)
    _engine = create_async_engine(async_url, pool_pre_ping=True)
    _Session = async_sessionmaker(_engine, expire_on_commit=False)
    # Reflect metadata once at startup in a transactional connection
    async with _engine.begin() as conn:
        def _reflect(sync_conn):
            _metadata.reflect(bind=sync_conn, schema="public")
        await conn.run_sync(_reflect)


async def get_session() -> AsyncIterator[AsyncSession]:
    if _Session is None:
        raise RuntimeError("DB not initialized. Call init_engine() on startup.")
    async with _Session() as session:
        yield session


def get_meta() -> MetaData:
    return _metadata


def get_engine() -> AsyncEngine:
    if _engine is None:
        raise RuntimeError("DB not initialized. Call init_engine() on startup.")
    return _engine
