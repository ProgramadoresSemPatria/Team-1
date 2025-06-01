# Standard library
from uuid import UUID
from typing import Annotated, List, Dict, Any

# Third-party
from fastapi import APIRouter, Depends, Body, Path, HTTPException, status, Response
from sqlmodel import Session, select
from pydantic import BaseModel

# Local application
from ..db.Users import CreateUser, Users, BaseUser, PublicUser, UpdateUserAdmin
from ..db import get_session
from ..enum.TagsEnum import TagsEnum
from .auth import o_auth_pass_bearer
from ..utils.token import create_hash_password, decode_token
from ..utils.exception_handler import handle_exception, create_error_response, ERROR_CODES
from ..utils.response_helper import create_success_response
from ..services.user_services import create_user, update_user, delete_user, retrieve_all_users, retrieve_user

# Response models
class UserResponse(BaseModel):
    message: str
    data: Dict[str, Any]

router = APIRouter(
    prefix="/users",
    tags=[TagsEnum.users]
)

session_dependency = Annotated[Session, Depends(get_session)]

@router.post(
    "/", 
    response_model=BaseUser, 
    status_code=status.HTTP_201_CREATED,
    summary="Create new user",
    description="Creates a new user with the provided information"
)
def create_user_route(user: CreateUser, session: session_dependency):
    try:
        created_user = create_user(user, session)
        return created_user
    except Exception as e:
        print("Erro no create_user_route [ROUTER]")
        handle_exception(e)

@router.patch(
    "/{user_id}", 
    response_model=BaseUser, 
    status_code=status.HTTP_200_OK,
    summary="Update user",
    description="Updates user information. Regular users can only update their own profile, admin users can update any profile"
)
def update_user_route(
    user_id: Annotated[str, Path(description="User ID to update")],
    user: Annotated[UpdateUserAdmin, Body(description="Updated user data")],
    session: session_dependency,
    token: Annotated[str, Depends(o_auth_pass_bearer)],
):
    try:
        updated_user = update_user(user_id, user, session, token)
        return updated_user
    except Exception as e:
        handle_exception(e)

@router.delete(
    "/admin/{user_id}", 
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete user",
    description="Deletes a user. Admin permissions required"
)
def delete_user_route(
    user_id: Annotated[str, Path(description="User ID to delete")],
    session: session_dependency,
    token: Annotated[str, Depends(o_auth_pass_bearer)],
):
    try:
        delete_user(user_id, session, token)
        return Response(status_code=status.HTTP_204_NO_CONTENT)
    except Exception as e:
        handle_exception(e)

@router.get(
    "/", 
    response_model=List[BaseUser], 
    status_code=status.HTTP_200_OK,
    summary="List all users",
    description="Retrieves a list of all users"
)
def retrieve_all_users_route(session: session_dependency):
    try:
        users = retrieve_all_users(session)
        return users
    except Exception as e:
        handle_exception(e)

@router.get(
    "/admin/", 
    response_model=List[BaseUser], 
    status_code=status.HTTP_200_OK,
    summary="List all users (admin)",
    description="Retrieves a list of all users with full details. Admin permissions required"
)
def retrieve_all_users_admin(
    session: session_dependency,
    token: Annotated[str, Depends(o_auth_pass_bearer)],
):
    """
    Retrieve all users. Admin permissions required.
    """
    try:
        # Verify admin permissions
        user_data = decode_token(token)
        if not user_data.get("is_admin"):
            error_response = create_error_response(
                status.HTTP_403_FORBIDDEN,
                ERROR_CODES["FORBIDDEN"],
                "Admin permission required"
            )
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=error_response)
            
        # Retrieve all users
        return session.exec(select(Users)).all()
    except HTTPException:
        raise
    except Exception as e:
        handle_exception(e)

@router.get(
    "/admin/{user_id}", 
    response_model=BaseUser, 
    status_code=status.HTTP_200_OK,
    summary="Get user details",
    description="Retrieves detailed information about a specific user. Admin permissions required"
)
def retrieve_user_route(
    user_id: Annotated[str, Path(description="User ID to retrieve")],
    session: session_dependency,
    token: Annotated[str, Depends(o_auth_pass_bearer)],
):
    try:
        user = retrieve_user(user_id, session, token)
        return user
    except Exception as e:
        handle_exception(e)

@router.get(
    "/me", 
    response_model=UserResponse,
    status_code=status.HTTP_200_OK,
    summary="Get current user",
    description="Retrieves information about the currently authenticated user"
)
def get_me(token: Annotated[str, Depends(o_auth_pass_bearer)]):
    """
    Get the current authenticated user's data.
    """
    try:
        user_data = decode_token(token)
        return create_success_response(
            data=user_data,
            message="User profile retrieved successfully"
        )
    except Exception as e:
        handle_exception(e)

