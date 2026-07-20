"""Database connection setup.

One `engine` (the actual connection pool to Postgres/SQLite) is shared by the whole
app. Route handlers get a short-lived `Session` per request via `get_session`.
"""

from collections.abc import Iterator

from sqlmodel import Session, SQLModel, create_engine

from .config import settings

# SQLite needs this flag because FastAPI may touch the connection from different
# threads; it's ignored for Postgres.
connect_args = {"check_same_thread": False} if settings.database_url.startswith("sqlite") else {}

engine = create_engine(settings.database_url, connect_args=connect_args)


def init_db() -> None:
    """Create any tables that don't exist yet (runs at startup)."""
    SQLModel.metadata.create_all(engine)


def get_session() -> Iterator[Session]:
    with Session(engine) as session:
        yield session
