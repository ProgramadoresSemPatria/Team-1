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

router = APIRouter(
    prefix="/users",
    tags=[TagsEnum.users]
)

session_dependency = Annotated[Session, Depends(get_session)]

def handle_exception(e: Exception):
    """
    Centralize exception handling for database operations.
    Maps unique constraint violations to HTTP 400, others to HTTP 500.
    """
    error_str = str(e)
    for error in ["unique constraint failed", "restrição de unicidade"]:
        if error in error_str.lower():
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=unique_constraint_message(e))
    raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=error_str)

@router.post("/", response_model=BaseUser, status_code=status.HTTP_201_CREATED)
def create_user(user: CreateUser, session: session_dependency):
    """
    Create a new user with hashed password.
    """
    try:
        user_model = Users.model_validate(user)
        user_model.password = create_hash_password(user_model.password)
        session.add(user_model)
        session.commit()
        session.refresh(user_model)
        return user_model
    except Exception as e:
        handle_exception(e)

@router.patch("/{user_id}", response_model=BaseUser, status_code=status.HTTP_200_OK)
def update_user(
    user_id: Annotated[str, Path()],
    user: Annotated[UpdateUserAdmin, Body()],
    session: session_dependency,
    token: Annotated[str, Depends(o_auth_pass_bearer)],
):
    """
    Update an existing user. Admins can update any user; users can update themselves.
    """
    # Validate UUID format
    try:
        UUID(user_id.replace("-", ""))
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="ID must be a valid UUID string.",
        )

    user_data = decode_token(token)
    if str(user_data.get("id")).replace("-", "") != user_id.replace("-", "") and not user_data.get("is_admin"):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin permission required!")

    existing_user = session.get(Users, UUID(user_id.replace("-", "")))
    if not existing_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")

    if existing_user.email == "admin@admin.com":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin user is immutable")

    if user.password:
        user.password = create_hash_password(user.password)

    update_data = user.model_dump(exclude_unset=True)
    existing_user.sqlmodel_update(update_data)

    try:
        session.add(existing_user)
        session.commit()
        session.refresh(existing_user)
        return existing_user
    except Exception as e:
        handle_exception(e)

@router.delete("/admin/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(
    user_id: Annotated[str, Path()],
    session: session_dependency,
    token: Annotated[str, Depends(o_auth_pass_bearer)],
):
    """
    Delete a user by ID. Admin permissions required.
    """
    user_data = decode_token(token)
    if not user_data.get("is_admin"):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin permission required!")

    existing_user = session.get(Users, UUID(user_id.replace("-", "")))
    if not existing_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")

    if existing_user.email == "admin@admin.com":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin user is immutable")

    session.delete(existing_user)
    session.commit()

@router.get("/", response_model=list[PublicUser], status_code=status.HTTP_200_OK)
def retrieve_all_users(session: session_dependency):
    """
    Retrieve all public user data.
    """
    return session.exec(select(Users)).all()

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
def retrieve_user(
    user_id: Annotated[str, Path()],
    session: session_dependency,
    token: Annotated[str, Depends(o_auth_pass_bearer)],
):
    """
    Retrieve a single user by ID. Admin permissions required.
    """
    user_data = decode_token(token)
    if not user_data.get("is_admin"):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin permission required!")

    existing_user = session.get(Users, UUID(user_id.replace("-", "")))
    if not existing_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")
    return existing_user

@router.get("/me", status_code=status.HTTP_200_OK)
def get_me(token: Annotated[str, Depends(o_auth_pass_bearer)]):
    """
    Get the current authenticated user's data.
    """
    try:
        return {"message": "Success!", "data": decode_token(token)}
    except Exception as e:
        handle_exception(e)

