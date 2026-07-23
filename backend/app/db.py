"""Database connection setup.

One `engine` (the actual connection pool to Postgres/SQLite) is shared by the whole
app. Route handlers get a short-lived `Session` per request via `get_session`.
"""

from collections.abc import Iterator

from sqlmodel import Session, SQLModel, create_engine

from .config import settings

# Providers hand out URLs starting "postgresql://", which SQLAlchemy opens with
# the older psycopg2 driver by default; this project ships psycopg 3, so point
# the URL at it explicitly. Lets a Neon/Supabase connection string be pasted
# into DATABASE_URL exactly as given.
_db_url = settings.database_url
if _db_url.startswith("postgresql://"):
    _db_url = _db_url.replace("postgresql://", "postgresql+psycopg://", 1)

# SQLite needs this flag because FastAPI may touch the connection from different
# threads; it's ignored for Postgres.
connect_args = {"check_same_thread": False} if _db_url.startswith("sqlite") else {}

engine = create_engine(_db_url, connect_args=connect_args)


def init_db() -> None:
    """Create any tables that don't exist yet (runs at startup)."""
    SQLModel.metadata.create_all(engine)


def get_session() -> Iterator[Session]:
    with Session(engine) as session:
        yield session
