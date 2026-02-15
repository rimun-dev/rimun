from fastapi import APIRouter, Depends, Query
from datetime import datetime, timezone
from sqlalchemy import and_, or_, select, Table, func
from sqlalchemy.ext.asyncio import AsyncSession

from ..db import get_meta, get_session

router = APIRouter(prefix="", tags=["delegates"])


def _get_table(meta: any, name: str) -> Table:
    if name in meta.tables:
        return meta.tables[name]
    full = f"public.{name}"
    return meta.tables[full]


@router.get("/delegates")
async def list_delegates(
    session: AsyncSession = Depends(get_session),
    session_id: int | None = Query(default=None),
    delegation_id: int | None = Query(default=None),
    committee_id: int | None = Query(default=None),
    country_code: str | None = Query(default=None),
    school_id: int | None = Query(default=None),
    status_application: str | None = Query(default=None),
    status_housing: str | None = Query(default=None),
    is_ambassador: bool | None = Query(default=None),
    updated_since: datetime | None = Query(default=None),
    limit: int = Query(default=200, ge=1, le=1000),
    offset: int = Query(default=0, ge=0),
):
    meta = get_meta()

    pa = _get_table(meta, "person_application")
    p = _get_table(meta, "person")
    d = _get_table(meta, "delegation")
    s = _get_table(meta, "school")
    c = _get_table(meta, "country")
    cm = _get_table(meta, "committee")
    f = _get_table(meta, "forum")
    role_tbl = _get_table(meta, "role")
    group_tbl = _get_table(meta, "group")
    cr = role_tbl.alias("confirmed_role")
    rr = role_tbl.alias("requested_role")
    gcr = group_tbl.alias("confirmed_group")
    grr = group_tbl.alias("requested_group")
    se = _get_table(meta, "session")

    stmt = (
        select(
            p.c.id.label("person_id"),
            p.c.name,
            p.c.surname,
            p.c.full_name,
            p.c.birthday,
            p.c.gender,
            p.c.picture_path,
            p.c.phone_number,
            p.c.allergies,
            c.c.code.label("country_code"),
            c.c.name.label("country_name"),
            pa.c.session_id,
            se.c.edition.label("session_edition"),
            cm.c.id.label("committee_id"),
            cm.c.name.label("committee_name"),
            f.c.acronym.label("forum_acronym"),
            d.c.id.label("delegation_id"),
            d.c.name.label("delegation_name"),
            s.c.id.label("school_id"),
            s.c.name.label("school_name"),
            cr.c.name.label("role_confirmed"),
            rr.c.name.label("role_requested"),
            gcr.c.name.label("group_confirmed"),
            grr.c.name.label("group_requested"),
            pa.c.status_application,
            pa.c.status_housing,
            pa.c.is_ambassador,
            pa.c.housing_is_available,
            pa.c.housing_n_guests,
            pa.c.updated_at,
            pa.c.created_at,
        )
        .select_from(pa)
        .join(p, pa.c.person_id == p.c.id)
        .join(c, p.c.country_id == c.c.id)
        .join(se, pa.c.session_id == se.c.id)
        .join(cm, pa.c.committee_id == cm.c.id, isouter=True)
        .join(f, cm.c.forum_id == f.c.id, isouter=True)
        .join(d, pa.c.delegation_id == d.c.id, isouter=True)
        .join(s, pa.c.school_id == s.c.id, isouter=True)
        .join(cr, pa.c.confirmed_role_id == cr.c.id, isouter=True)
        .join(rr, pa.c.requested_role_id == rr.c.id, isouter=True)
        .join(gcr, cr.c.group_id == gcr.c.id, isouter=True)
        .join(grr, rr.c.group_id == grr.c.id, isouter=True)
    )

    filters = []
    # Default: only delegates (group id 5 or group name 'delegate')
    delegate_filter = or_(
        gcr.c.id == 5,
        grr.c.id == 5,
        func.lower(gcr.c.name) == "delegate",
        func.lower(grr.c.name) == "delegate",
        func.lower(cr.c.name) == "delegate",
        func.lower(rr.c.name) == "delegate",
    )
    filters.append(delegate_filter)

    if session_id is not None:
        filters.append(pa.c.session_id == session_id)
    if delegation_id is not None:
        filters.append(pa.c.delegation_id == delegation_id)
    if committee_id is not None:
        filters.append(pa.c.committee_id == committee_id)
    if school_id is not None:
        filters.append(pa.c.school_id == school_id)
    if country_code is not None:
        filters.append(func.upper(c.c.code) == func.upper(country_code))
    if status_application is not None:
        filters.append(func.lower(pa.c.status_application) == func.lower(status_application))
    if status_housing is not None:
        filters.append(func.lower(pa.c.status_housing) == func.lower(status_housing))
    if is_ambassador is not None:
        filters.append(pa.c.is_ambassador == is_ambassador)
    if updated_since is not None:
        ts = updated_since
        if ts.tzinfo is not None and ts.utcoffset() is not None:
            ts = ts.astimezone(timezone.utc).replace(tzinfo=None)
        filters.append(pa.c.updated_at >= ts)

    if filters:
        stmt = stmt.where(and_(*filters))

    stmt = stmt.order_by(pa.c.updated_at.desc()).limit(limit).offset(offset)

    res = await session.execute(stmt)
    return [dict(row._mapping) for row in res]


@router.get("/delegates/{person_id}")
async def get_delegate(
    person_id: int,
    session: AsyncSession = Depends(get_session),
):
    meta = get_meta()

    pa = _get_table(meta, "person_application")
    p = _get_table(meta, "person")
    d = _get_table(meta, "delegation")
    s = _get_table(meta, "school")
    c = _get_table(meta, "country")
    cm = _get_table(meta, "committee")
    f = _get_table(meta, "forum")
    role_tbl = _get_table(meta, "role")
    group_tbl = _get_table(meta, "group")
    cr = role_tbl.alias("confirmed_role")
    rr = role_tbl.alias("requested_role")
    gcr = group_tbl.alias("confirmed_group")
    grr = group_tbl.alias("requested_group")
    se = _get_table(meta, "session")

    stmt = (
        select(
            p.c.id.label("person_id"),
            p.c.name,
            p.c.surname,
            p.c.full_name,
            p.c.birthday,
            p.c.gender,
            p.c.picture_path,
            p.c.phone_number,
            p.c.allergies,
            c.c.code.label("country_code"),
            c.c.name.label("country_name"),
            pa.c.session_id,
            se.c.edition.label("session_edition"),
            cm.c.id.label("committee_id"),
            cm.c.name.label("committee_name"),
            f.c.acronym.label("forum_acronym"),
            d.c.id.label("delegation_id"),
            d.c.name.label("delegation_name"),
            s.c.id.label("school_id"),
            s.c.name.label("school_name"),
            cr.c.name.label("role_confirmed"),
            rr.c.name.label("role_requested"),
            gcr.c.name.label("group_confirmed"),
            grr.c.name.label("group_requested"),
            pa.c.status_application,
            pa.c.status_housing,
            pa.c.is_ambassador,
            pa.c.housing_is_available,
            pa.c.housing_n_guests,
            pa.c.updated_at,
            pa.c.created_at,
        )
        .select_from(pa)
        .join(p, pa.c.person_id == p.c.id)
        .join(c, p.c.country_id == c.c.id)
        .join(se, pa.c.session_id == se.c.id)
        .join(cm, pa.c.committee_id == cm.c.id, isouter=True)
        .join(f, cm.c.forum_id == f.c.id, isouter=True)
        .join(d, pa.c.delegation_id == d.c.id, isouter=True)
        .join(s, pa.c.school_id == s.c.id, isouter=True)
        .join(cr, pa.c.confirmed_role_id == cr.c.id, isouter=True)
        .join(rr, pa.c.requested_role_id == rr.c.id, isouter=True)
        .join(gcr, cr.c.group_id == gcr.c.id, isouter=True)
        .join(grr, rr.c.group_id == grr.c.id, isouter=True)
        .where(p.c.id == person_id)
        .order_by(pa.c.updated_at.desc())
        .limit(1)
    )

    res = await session.execute(stmt)
    row = res.first()
    return dict(row._mapping) if row else {}
