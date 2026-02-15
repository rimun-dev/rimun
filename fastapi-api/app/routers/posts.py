from fastapi import APIRouter, Depends, Query
from sqlalchemy import and_, select, Table
from sqlalchemy.ext.asyncio import AsyncSession

from ..db import get_meta, get_session

def _get_table(meta: any, name: str) -> Table:
    if name in meta.tables:
        return meta.tables[name]
    full = f"public.{name}"
    return meta.tables[full]

router = APIRouter(prefix="", tags=["posts"])


@router.get("/posts")
async def list_posts(
    session: AsyncSession = Depends(get_session),
    session_id: int | None = Query(default=None),
    for_schools: bool | None = Query(default=None),
    for_persons: bool | None = Query(default=None),
    updated_since: str | None = Query(default=None, description="ISO timestamp to filter updated_at >= value"),
):
    meta = get_meta()
    post: Table = _get_table(meta, "post")
    filters = []
    if session_id is not None:
        filters.append(post.c.session_id == session_id)
    if for_schools is not None:
        filters.append(post.c.is_for_schools == for_schools)
    if for_persons is not None:
        filters.append(post.c.is_for_persons == for_persons)
    if updated_since is not None:
        filters.append(post.c.updated_at >= updated_since)

    stmt = select(
        post.c.id,
        post.c.session_id,
        post.c.author_id,
        post.c.title,
        post.c.body,
        post.c.is_for_schools,
        post.c.is_for_persons,
        post.c.created_at,
        post.c.updated_at,
    )
    if filters:
        stmt = stmt.where(and_(*filters))
    stmt = stmt.order_by(post.c.created_at.desc())

    res = await session.execute(stmt)
    return [dict(row._mapping) for row in res]
