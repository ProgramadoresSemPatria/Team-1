from fastapi import APIRouter, Depends, Body, Path, HTTPException
from typing import Annotated

from sqlmodel import Session

from ..db.Users import CreateUser, Users, BaseUser, UpdateUser
from ..db import get_session
from ..enum.TagsEnum import TagsEnum

from ..utils.token import create_hash_password

router = APIRouter(
    prefix="/users",
    tags=[TagsEnum.users]
)

session_dependency = Annotated[Session, Depends(get_session)] # Help on database management

@router.post('/', response_model=BaseUser)
def create_user(user: CreateUser, session: session_dependency):
    user_to_db = Users.model_validate(user)
    input_password = user_to_db.password
    user_to_db.password = create_hash_password(input_password)
    session.add(user_to_db)
    session.commit()
    session.refresh(user_to_db)
    return user_to_db

@router.patch('/{user_id}')
def update_user(user_id:Annotated[int, Path()], user:Annotated[UpdateUser, Body()], session: session_dependency) -> BaseUser:
    user_db = session.get(Users, user_id)
    if not (user_db) :
        raise HTTPException(status_code=404, detail="User not founded")
    
    user_body = user.model_dump(exclude_unset=True)
    user_db.sqlmodel_update(user_body)

    session.add(user_db)
    session.commit()
    session.refresh(user_db)

    return user_db

@router.delete('/{user_id}')
def delete_user(user_id:Annotated[int, Path()], session: session_dependency) :
    user_db = session.get(Users, user_id)
    if not user_db :
        raise HTTPException(status_code=404, detail="User not founded")
    session.delete(user_db)
    session.commit()
    return {"message":"User deleted"}