"""Read-only family roster, for picking players when creating a game.

Distinct from /admin/users: any logged-in player can see who else is in the
family (they need this to invite people), but only an admin can create/reset/
delete accounts.
"""

from fastapi import APIRouter
from sqlmodel import select

from ..deps import CurrentUser, DbSession
from ..models import User
from ..schemas import UserOut

router = APIRouter(prefix="/users", tags=["users"])


@router.get("", response_model=list[UserOut])
def list_family(user: CurrentUser, session: DbSession):
    users = session.exec(select(User).order_by(User.username)).all()
    return [UserOut.model_validate(u, from_attributes=True) for u in users]
