from fastapi import APIRouter, Depends, Body, Path, HTTPException, Header
from typing import Annotated

from sqlmodel import Session, select

from ..db.Users import CreateUser, Users, BaseUser, UpdateUser, RetrieveUser
from ..db import get_session
from ..enum.TagsEnum import TagsEnum
from api.utils.token import decode_token

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
    try:
        session.commit()
    except Exception as e :
        raise HTTPException(status_code=400, detail=str(e._message()))
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

@router.get("/", response_model=list[RetrieveUser])
def retrieve_all_users(session: session_dependency):
    users = session.exec(select(Users)).all()
    return users

@router.get('/me')
def get_me(authorization:Annotated[str, Header()]):
    try :
        return {"message":"Success!", "data": decode_token(authorization)}
    except Exception as e:
        return {"message":"Failed!", "erro": str(e)}

@router.get("/{user_id}", response_model=RetrieveUser)
def retrieve_user(user_id:Annotated[int, Path()], session: session_dependency):
    user_db = session.get(Users, user_id)
    if not user_db :
        raise HTTPException(status_code=404, detail="User not founded")
    return user_db
