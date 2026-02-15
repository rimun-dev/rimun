from fastapi import APIRouter, Depends
from sqlalchemy import select, Table
from sqlalchemy.ext.asyncio import AsyncSession

from ..db import get_meta, get_session

def _get_table(meta: any, name: str) -> Table:
    if name in meta.tables:
        return meta.tables[name]
    full = f"public.{name}"
    return meta.tables[full]

router = APIRouter(prefix="", tags=["forums"])


@router.get("/forums")
async def list_forums(
    session: AsyncSession = Depends(get_session),
):
    meta = get_meta()
    forum: Table = _get_table(meta, "forum")
    stmt = (
        select(
            forum.c.id,
            forum.c.acronym,
            forum.c.name,
            forum.c.description,
            forum.c.image_path,
            forum.c.created_at,
            forum.c.updated_at,
        ).order_by(forum.c.acronym)
    )
    res = await session.execute(stmt)
    return [dict(row._mapping) for row in res]
