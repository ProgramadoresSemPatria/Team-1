from fastapi import APIRouter, Depends, Body, Path, HTTPException, Header, status
from typing import Annotated
from sqlmodel import Session, select

from uuid import UUID

from ..db.Users import CreateUser, Users, BaseUser, UpdateUser, RetrieveUser, PublicUser, UpdateUserAdmin
from ..db import get_session
from ..enum.TagsEnum import TagsEnum
from api.utils.token import decode_token
from .auth import o_auth_pass_bearer
from ..utils.token import create_hash_password
from api.utils.response_helper import unique_constraint_message

router = APIRouter(
    prefix="/users",
    tags=[TagsEnum.users]
)

session_dependency = Annotated[Session, Depends(get_session)] # Help on database management

@router.post('/', response_model=BaseUser, status_code=status.HTTP_201_CREATED)
def create_user(user: CreateUser, session: session_dependency):
    try:
        user_to_db = Users.model_validate(user)
        input_password = user_to_db.password
        user_to_db.password = create_hash_password(input_password)
        session.add(user_to_db)
        session.commit()
        session.refresh(user_to_db)
        return user_to_db
    except Exception as e :
        string_error = str(e)
        unique_string_pos = string_error.lower().find("unique constraint failed")
        if (unique_string_pos != -1) :
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=unique_constraint_message(e))
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.patch('/{user_id}', status_code=status.HTTP_200_OK, response_model=BaseUser)
def update_user(user_id:Annotated[str, Path()], user:Annotated[UpdateUserAdmin, Body()], session: session_dependency, token: Annotated[str, Depends(o_auth_pass_bearer)]):
    try:
        UUID(user_id.replace("-", ""))
    except:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="ID must be on UUID string: 91ff7c01-cc8c-4a77-85db-384859d7aa39 or 91ff7c01cc8c4a7785db384859d7aa39")


    user_accessing = decode_token(token)
    is_user_admin = user_accessing.get('is_admin')

    user_accessing_id = str(user_accessing.get("id")).replace("-", "")
    if (user_accessing_id != user_id.replace("-", "")) :
        if not (is_user_admin) :
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin permission required!")

    
    user_db = session.get(Users, UUID(user_id.replace("-", "")))
    if not (user_db) :
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not founded")
    if user_db.email == "admin@admin.com":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin user is immutable")
    
    if user.password :
        user.password = create_hash_password(user.password)
    user_body = user.model_dump(exclude_unset=True)
    user_db.sqlmodel_update(user_body)
    
    try :
        session.add(user_db)
        session.commit()
        session.refresh(user_db)

        return user_db
    except Exception as e :
        string_error = str(e)
        unique_string_pos = string_error.lower().find("unique constraint failed")
        if (unique_string_pos != -1) :
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=unique_constraint_message(e))
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@router.delete('/admin/{user_id}', status_code=status.HTTP_204_NO_CONTENT)
def delete_user(user_id:Annotated[str, Path()], session: session_dependency, token: Annotated[str, Depends(o_auth_pass_bearer)]) :
    user_accessing = decode_token(token)
    is_user_admin = user_accessing.get('is_admin')
    if not (is_user_admin) :
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin permission required!")
    
    user_db = session.get(Users, UUID(user_id))
    if not (user_db) :
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not founded")

    if user_db.email == "admin@admin.com":
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin user is immutable")

    session.delete(user_db)
    session.commit()

@router.get("/", response_model=list[PublicUser], status_code=status.HTTP_200_OK)
def retrieve_all_users(session: session_dependency):
    users = session.exec(select(Users)).all()
    return users

@router.get("/admin/", status_code=status.HTTP_200_OK)
def retrieve_all_users_admin(session: session_dependency, token: Annotated[str, Depends(o_auth_pass_bearer)]):
    user_accessing = decode_token(token)
    is_user_admin = user_accessing.get('is_admin')
    if not (is_user_admin) :
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin permission required!")
    users = session.exec(select(Users)).all()
    return users

@router.get("/admin/{user_id}", status_code=status.HTTP_200_OK)
def retrieve_user(user_id:Annotated[str, Path()], session: session_dependency, token: Annotated[str, Depends(o_auth_pass_bearer)]):
    user_accessing = decode_token(token)
    is_user_admin = user_accessing.get('is_admin')
    if not (is_user_admin) :
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin permission required!")

    user_db = session.get(Users, UUID(user_id))
    if not user_db :
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not founded")
    return user_db

@router.get('/me', status_code=status.HTTP_200_OK)
def get_me(token: Annotated[str, Depends(o_auth_pass_bearer)]):
    try :
        return {"message":"Success!", "data": decode_token(token)}
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

