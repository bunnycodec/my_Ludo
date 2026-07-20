"""Password hashing and JWT session tokens.

Passwords are stored as bcrypt hashes — a one-way transformation, so even someone
with full database access cannot recover the original passwords.

Logins are proven by a JWT (a signed token the server hands out) stored in an
httpOnly cookie. The JWT also carries the user's session token; see models.User for
how that enforces one active session per account.
"""

import secrets
from datetime import datetime, timedelta, timezone

import bcrypt
import jwt

from .config import settings

JWT_ALGORITHM = "HS256"
COOKIE_NAME = "ludo_session"


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()


def verify_password(password: str, password_hash: str) -> bool:
    return bcrypt.checkpw(password.encode(), password_hash.encode())


def new_session_token() -> str:
    return secrets.token_hex(16)


def create_jwt(user_id: int, session_token: str) -> str:
    payload = {
        "sub": str(user_id),
        "session": session_token,
        "exp": datetime.now(timezone.utc) + timedelta(days=settings.jwt_expiry_days),
    }
    return jwt.encode(payload, settings.jwt_secret, algorithm=JWT_ALGORITHM)


def decode_jwt(token: str) -> dict | None:
    """Return the JWT payload, or None if the token is invalid/expired/tampered."""
    try:
        return jwt.decode(token, settings.jwt_secret, algorithms=[JWT_ALGORITHM])
    except jwt.InvalidTokenError:
        return None
