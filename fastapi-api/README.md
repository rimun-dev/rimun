# FastAPI service (read-only) for RIMUN DB

This service exposes a minimal FastAPI API against the existing Postgres database used by the Node/Prisma app. It reflects tables dynamically (no Python ORM models to maintain) and is safe to run read-only by default.

## Quick start (uv)

```bash
cd fastapi-api
uv venv
uv pip install -r requirements.txt
cp .env.example .env
# Edit .env: set DATABASE_URL to the same URL your Node app uses.
# Example if docker-compose is running on the same host:
# DATABASE_URL=postgresql://rimun:rimunpass@127.0.0.1:5432/rimun?schema=public

uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8081
```

- Base URL: http://localhost:8081
- Health: GET `/health`
- Forums: GET `/forums`
- Committees by session: GET `/committees?session_id=<id>`

Notes:
- The app accepts a standard `postgresql://` URL and auto-switches to the async driver (`postgresql+asyncpg://`) at runtime.
- Avoid exposing Postgres publicly; prefer running this API on the same host as the DB and only exposing the API to your mobile app.

## Realtime options
- Simple: clients poll endpoints with an `updated_since` parameter (add where clauses on `updated_at`).
- Advanced: use Postgres `LISTEN/NOTIFY` and FastAPI WebSockets/SSE. This scaffold focuses on HTTP polling; we can add WebSockets when you define which tables/events to watch.
