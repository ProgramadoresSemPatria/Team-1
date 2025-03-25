from fastapi import APIRouter, Depends
from typing import Annotated

from sqlmodel import Session

from ..db.Users import CreateUser, User, BaseUser
from ..db import get_session

from ..utils.token import create_hash_password

router = APIRouter()

session_dependency = Annotated[Session, Depends(get_session)] # Help on database management

@router.post('/users', response_model=BaseUser)
def create_user(user: CreateUser, session: session_dependency):
    user_to_db = User.model_validate(user)
    input_password = user_to_db.password
    user_to_db.password = create_hash_password(input_password)
    session.add(user_to_db)
    session.commit()
    session.refresh(user_to_db)
    return user_to_db