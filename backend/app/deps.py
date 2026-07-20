"""Reusable route guards ("dependencies" in FastAPI terms).

A route that declares `user: CurrentUser` only runs for a valid, current login.
`AdminUser` additionally requires the admin role. FastAPI calls these functions
automatically before the route handler and passes the result in.
"""

from typing import Annotated

from fastapi import Cookie, Depends, HTTPException, status
from sqlmodel import Session

from .auth import COOKIE_NAME, decode_jwt
from .db import get_session
from .models import Role, User

DbSession = Annotated[Session, Depends(get_session)]


def get_current_user(
    session: DbSession,
    ludo_session: Annotated[str | None, Cookie(alias=COOKIE_NAME)] = None,
) -> User:
    credentials_error = HTTPException(
        status.HTTP_401_UNAUTHORIZED, "Not logged in, or logged in on another device."
    )
    if ludo_session is None:
        raise credentials_error

    payload = decode_jwt(ludo_session)
    if payload is None:
        raise credentials_error

    user = session.get(User, int(payload["sub"]))
    # The session-token comparison is what kicks out older logins: a newer login
    # overwrote current_session_token, so this older JWT's copy no longer matches.
    if user is None or user.current_session_token != payload["session"]:
        raise credentials_error
    return user


CurrentUser = Annotated[User, Depends(get_current_user)]


def require_admin(user: CurrentUser) -> User:
    if user.role != Role.admin:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Admin access required.")
    return user


AdminUser = Annotated[User, Depends(require_admin)]
