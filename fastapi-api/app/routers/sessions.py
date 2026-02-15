from fastapi import APIRouter, Depends, Query
from sqlalchemy import and_, select, Table
from sqlalchemy.ext.asyncio import AsyncSession

from ..db import get_meta, get_session

def _get_table(meta: any, name: str) -> Table:
    if name in meta.tables:
        return meta.tables[name]
    full = f"public.{name}"
    return meta.tables[full]

router = APIRouter(prefix="", tags=["sessions"])


@router.get("/sessions")
async def list_sessions(
    session: AsyncSession = Depends(get_session),
    active: bool | None = Query(default=None),
    edition: int | None = Query(default=None),
    updated_since: str | None = Query(default=None, description="ISO timestamp to filter updated_at >= value"),
):
    meta = get_meta()
    table: Table = _get_table(meta, "session")
    filters = []
    if active is not None:
        filters.append(table.c.is_active == active)
    if edition is not None:
        filters.append(table.c.edition == edition)
    if updated_since is not None:
        filters.append(table.c.updated_at >= updated_since)

    stmt = select(
        table.c.id,
        table.c.edition,
        table.c.edition_display,
        table.c.date_start,
        table.c.date_end,
        table.c.title,
        table.c.subtitle,
        table.c.description,
        table.c.is_active,
        table.c.image_path,
        table.c.created_at,
        table.c.updated_at,
    )
    if filters:
        stmt = stmt.where(and_(*filters))
    stmt = stmt.order_by(table.c.edition.desc())

    res = await session.execute(stmt)
    return [dict(row._mapping) for row in res]
