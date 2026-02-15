from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import and_, select, Table
from sqlalchemy.ext.asyncio import AsyncSession

from ..db import get_meta, get_session

def _get_table(meta: any, name: str) -> Table:
    if name in meta.tables:
        return meta.tables[name]
    full = f"public.{name}"
    return meta.tables[full]

router = APIRouter(prefix="", tags=["committees"])


@router.get("/committees")
async def list_committees(
    session: AsyncSession = Depends(get_session),
    session_id: int | None = Query(default=None),
    forum_id: int | None = Query(default=None),
):
    meta = get_meta()
    committee: Table = _get_table(meta, "committee")
    filters = []
    if session_id is not None:
        filters.append(committee.c.session_id == session_id)
    if forum_id is not None:
        filters.append(committee.c.forum_id == forum_id)

    stmt = select(
        committee.c.id,
        committee.c.name,
        committee.c.session_id,
        committee.c.forum_id,
        committee.c.size,
        committee.c.created_at,
        committee.c.updated_at,
    )
    if filters:
        stmt = stmt.where(and_(*filters))
    stmt = stmt.order_by(committee.c.name)

    res = await session.execute(stmt)
    return [dict(row._mapping) for row in res]
