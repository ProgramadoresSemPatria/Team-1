from fastapi import Depends, APIRouter, HTTPException
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

from typing import Annotated

from sqlmodel import Session, select

from ..db import get_session
from ..db.Users import Users, CreateUser
from ..utils.token import verify_password, create_token
from ..enum.TagsEnum import TagsEnum

router = APIRouter(
    prefix="/auth",
    tags=[TagsEnum.auth]
)

o_auth_pass_bearer = OAuth2PasswordBearer(tokenUrl="/api/auth/login/swagger")

session_dependency = Annotated[Session, Depends(get_session)] # Help on database management

@router.post('/login/swagger')
def login_user(form_data: Annotated[OAuth2PasswordRequestForm, Depends()], session: session_dependency):
    user_instance = session.get(Users, form_data.username)
    if not user_instance:
        raise HTTPException(status_code=404, detail="User or Password Incorrect")
    if not verify_password(form_data.password, user_instance.password):
        raise HTTPException(status_code=404, detail="User or Password Incorrect")
    return {"access_token" : create_token({"sub": str(user_instance.username)}), "token_type": "bearer"}

@router.get('/test-auth', dependencies=[Depends(o_auth_pass_bearer)])
def auth(token: Annotated[str, Depends(o_auth_pass_bearer)]):
    return  {"detail" : "You are now authenticated!"}