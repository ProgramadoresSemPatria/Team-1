from fastapi import Depends, APIRouter, HTTPException, Body, Response, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

from typing import Annotated

from sqlmodel import Session, select

from ..db import get_session
from ..db.Users import Users, CreateUser, UserIn
from ..utils.token import verify_password, create_token, decode_token
from ..enum.TagsEnum import TagsEnum
from ..services.auth_services import login_user_swagger, login_user

router = APIRouter(
    prefix="/auth",
    tags=[TagsEnum.auth]
)

o_auth_pass_bearer = OAuth2PasswordBearer(tokenUrl="/api/auth/login/swagger")

session_dependency = Annotated[Session, Depends(get_session)] # Help on database management

@router.post('/login/swagger', status_code=status.HTTP_200_OK)
def login_user_swagger_route(form_data: Annotated[OAuth2PasswordRequestForm, Depends()], session: session_dependency):
    return login_user_swagger(form_data, session)

@router.get('/test-auth', dependencies=[Depends(o_auth_pass_bearer)])
def auth(token: Annotated[str, Depends(o_auth_pass_bearer)]):
    return  {"detail" : "You are now authenticated!"}

@router.post('/login', status_code=status.HTTP_200_OK)
async def login_user_route(user: Annotated[UserIn, Body()], session: session_dependency):
    return login_user(user, session)
