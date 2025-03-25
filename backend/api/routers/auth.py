from fastapi import Depends, APIRouter
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

from typing import Annotated

from sqlmodel import Session, select

from ..db import get_session
from ..db.Users import User, CreateUser
from ..utils.token import verify_password, create_token

router = APIRouter()

o_auth_pass_bearer = OAuth2PasswordBearer(tokenUrl="token")

session_dependency = Annotated[Session, Depends(get_session)] # Help on database management

@router.post('/token')
def login_user(form_data: Annotated[OAuth2PasswordRequestForm, Depends()], session: session_dependency):
    user_instance = session.get(User, form_data.username)
    if not verify_password(form_data.password, user_instance.password):
        raise Exception
    print("user: ", str(user_instance.username))
    return {"access_token" : create_token({"sub": str(user_instance.username)}), "token_type": "bearer"}

@router.get('/auth', dependencies=[Depends(o_auth_pass_bearer)])
def auth(token: Annotated[str, Depends(o_auth_pass_bearer)]):
    return  {"token" : token}