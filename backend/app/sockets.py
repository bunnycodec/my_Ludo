"""Realtime push for the game board (Socket.io, mounted into FastAPI via ASGI —
see main.py). This is the only place in the app that uses live push instead of
refresh-on-demand: dice rolls and moves need to appear instantly for everyone at
the table, which is the entire reason this project chose Socket.io in the first
place (see CLAUDE.md's tech-stack table).

Everything that *changes* board state still happens over plain REST routes
(routes/gameplay.py) — much easier to reason about and test than accepting game
actions as socket events. Socket.io's only job is: after a REST call changes the
board, broadcast the new board to everyone sitting at that game.
"""

from http.cookies import SimpleCookie

import socketio
from sqlmodel import Session, select

from .auth import COOKIE_NAME, decode_jwt
from .db import engine
from .models import Game, GameInvite, User

sio = socketio.AsyncServer(async_mode="asgi")


def _room(game_id: int) -> str:
    return f"game:{game_id}"


def _user_from_environ(environ: dict) -> User | None:
    """Same check as deps.get_current_user, but for a socket handshake instead
    of a FastAPI request — there's no Cookie() dependency injection here, so the
    cookie has to be parsed out of the raw ASGI environ by hand."""
    raw_cookie = environ.get("HTTP_COOKIE")
    if not raw_cookie:
        return None
    jar = SimpleCookie()
    jar.load(raw_cookie)
    morsel = jar.get(COOKIE_NAME)
    if morsel is None:
        return None
    payload = decode_jwt(morsel.value)
    if payload is None:
        return None
    with Session(engine) as session:
        user = session.get(User, int(payload["sub"]))
        if user is None or user.current_session_token != payload["session"]:
            return None
        # Detach from the session cleanly — we only needed the id/fields, not a
        # live ORM object tied to a session we're about to close.
        session.expunge(user)
        return user


@sio.event
async def connect(sid, environ):
    user = _user_from_environ(environ)
    if user is None:
        return False  # rejects the handshake
    await sio.save_session(sid, {"user_id": user.id})


@sio.event
async def join_game(sid, data):
    """A client asks to receive live updates for one game. Only the game's
    creator or an invited player may join its room."""
    session_data = await sio.get_session(sid)
    user_id = session_data["user_id"]
    game_id = data.get("game_id")

    with Session(engine) as session:
        game = session.get(Game, game_id)
        if game is None:
            return
        is_participant = game.creator_id == user_id or session.exec(
            select(GameInvite).where(GameInvite.game_id == game_id, GameInvite.user_id == user_id)
        ).first()
        if not is_participant:
            return

    await sio.enter_room(sid, _room(game_id))


async def notify_board_changed(game_id: int) -> None:
    """Tells everyone at the table to refetch the board. Deliberately doesn't
    push the board state itself: `my_movable_token_ids` in GET /board is
    personalized per requester (only the current player has any), so a single
    broadcast payload can't be correct for everyone in the room at once — each
    client re-fetching its own view keeps that logic in one place (the REST
    route) instead of duplicated on both ends of the socket."""
    await sio.emit("board_updated", {"game_id": game_id}, room=_room(game_id))
