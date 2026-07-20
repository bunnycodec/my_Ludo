"""Creates the first admin account at startup, if no admin exists yet.

Without this there'd be a chicken-and-egg problem: only admins can create accounts,
but a fresh database has no accounts at all. Credentials come from the
ADMIN_USERNAME / ADMIN_TEMP_PASSWORD env vars; the account is forced to change its
password on first login like any other new account.
"""

from sqlmodel import Session, select

from .auth import hash_password
from .config import settings
from .db import engine
from .models import Role, User


def seed_admin() -> None:
    with Session(engine) as session:
        admin_exists = session.exec(select(User).where(User.role == Role.admin)).first()
        if admin_exists:
            return
        session.add(
            User(
                username=settings.admin_username,
                password_hash=hash_password(settings.admin_temp_password),
                role=Role.admin,
                must_change_password=True,
            )
        )
        session.commit()
        print(f"Seeded admin account '{settings.admin_username}' (must change password on first login)")
