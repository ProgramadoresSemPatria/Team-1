from fastapi import APIRouter, Body, Depends, HTTPException, Response, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from typing import Annotated, Dict, Any
from sqlmodel import Session, select
from pydantic import BaseModel

from api.db import get_session
from api.db.Users import Users, CreateUser, UserIn
from api.enum.TagsEnum import TagsEnum
from api.utils.token import verify_password, create_token, decode_token
from api.services.auth_services import login_user_swagger, login_user
from api.utils.exception_handler import handle_exception

# Define response models for better API documentation and type safety
class TokenResponse(BaseModel):
    access_token: str
    token_type: str

class AuthStatusResponse(BaseModel):
    detail: str

router = APIRouter(
    prefix="/auth",
    tags=[TagsEnum.auth]
)

o_auth_pass_bearer = OAuth2PasswordBearer(tokenUrl="/api/auth/login/swagger")

# Database session dependency
session_dependency = Annotated[Session, Depends(get_session)]

@router.post(
    '/login/swagger', 
    response_model=TokenResponse, 
    status_code=status.HTTP_200_OK,
    summary="Login with OAuth2 password flow",
    description="Authenticates a user using OAuth2 password flow for Swagger/OpenAPI UI"
)
def login_user_swagger_route(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()], 
    session: session_dependency
):
    try:
        return login_user_swagger(form_data, session)
    except Exception as e:
        handle_exception(e)

@router.get(
    '/test-auth', 
    response_model=AuthStatusResponse,
    dependencies=[Depends(o_auth_pass_bearer)],
    summary="Test authentication",
    description="Verifies if the provided token is valid"
)
def auth(token: Annotated[str, Depends(o_auth_pass_bearer)]):
    return {"detail": "You are now authenticated!"}

@router.post(
    '/login', 
    response_model=TokenResponse, 
    status_code=status.HTTP_200_OK,
    summary="User login",
    description="Authenticates a user and returns a JWT token"
)
async def login_user_route(
    user: Annotated[UserIn, Body()], 
    session: session_dependency
):
    try:
        return login_user(user, session)
    except Exception as e:
        handle_exception(e)
