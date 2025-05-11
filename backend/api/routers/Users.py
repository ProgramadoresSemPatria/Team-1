# Standard library
from uuid import UUID

# Third-party
from fastapi import APIRouter, Depends, Body, Path, HTTPException, status
from typing import Annotated
from sqlmodel import Session, select

# Local application
from ..db.Users import CreateUser, Users, BaseUser, PublicUser, UpdateUserAdmin
from ..db import get_session
from ..enum.TagsEnum import TagsEnum
from .auth import o_auth_pass_bearer
from ..utils.token import create_hash_password
from api.utils.token import decode_token
from api.utils.response_helper import unique_constraint_message
from ..utils.exception_handler import handle_exception
from ..services.user_services import create_user, update_user, delete_user, retrieve_all_users, retrieve_user

router = APIRouter(
    prefix="/users",
    tags=[TagsEnum.users]
)

session_dependency = Annotated[Session, Depends(get_session)]

@router.post("/", response_model=BaseUser, status_code=status.HTTP_201_CREATED)
def create_user_route(user: CreateUser, session: session_dependency):
    return create_user(user, session)

@router.patch("/{user_id}", response_model=BaseUser, status_code=status.HTTP_200_OK)
def update_user_route(
    user_id: Annotated[str, Path()],
    user: Annotated[UpdateUserAdmin, Body()],
    session: session_dependency,
    token: Annotated[str, Depends(o_auth_pass_bearer)],
):
    return update_user(user_id, user, session, token)

@router.delete("/admin/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user_route(
    user_id: Annotated[str, Path()],
    session: session_dependency,
    token: Annotated[str, Depends(o_auth_pass_bearer)],
):
    delete_user(user_id, session, token)

@router.get("/", response_model=list[BaseUser], status_code=status.HTTP_200_OK)
def retrieve_all_users_route(session: session_dependency):
    return retrieve_all_users(session)

@router.get("/admin/", response_model=list[BaseUser], status_code=status.HTTP_200_OK)
def retrieve_all_users_admin(
    session: session_dependency,
    token: Annotated[str, Depends(o_auth_pass_bearer)],
):
    """
    Retrieve all users. Admin permissions required.
    """
    user_data = decode_token(token)
    if not user_data.get("is_admin"):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin permission required!")
    return session.exec(select(Users)).all()

@router.get("/admin/{user_id}", response_model=BaseUser, status_code=status.HTTP_200_OK)
def retrieve_user_route(
    user_id: Annotated[str, Path()],
    session: session_dependency,
    token: Annotated[str, Depends(o_auth_pass_bearer)],
):
    return retrieve_user(user_id, session, token)

@router.get("/me", status_code=status.HTTP_200_OK)
def get_me(token: Annotated[str, Depends(o_auth_pass_bearer)]):
    """
    Get the current authenticated user's data.
    """
    try:
        return {"message": "Success!", "data": decode_token(token)}
    except Exception as e:
        handle_exception(e)

