from fastapi import Depends, APIRouter, HTTPException, Body, Response
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

from typing import Annotated

from sqlmodel import Session, select

from ..db import get_session
from ..db.Users import Users, CreateUser, UserIn
from ..utils.token import verify_password, create_token, decode_token
from ..enum.TagsEnum import TagsEnum

router = APIRouter(
    prefix="/auth",
    tags=[TagsEnum.auth]
)

o_auth_pass_bearer = OAuth2PasswordBearer(tokenUrl="/api/auth/login/swagger")

session_dependency = Annotated[Session, Depends(get_session)] # Help on database management

@router.post('/login/swagger')
def login_user_swagger(form_data: Annotated[OAuth2PasswordRequestForm, Depends()], session: session_dependency):
    user_instance = session.get(Users, form_data.username)
    if not user_instance:
        raise HTTPException(status_code=404, detail="User or Password Incorrect")
    if not verify_password(form_data.password, user_instance.password):
        raise HTTPException(status_code=404, detail="User or Password Incorrect")
    return {"access_token" : create_token({"sub": str(user_instance.username)}), "token_type": "bearer"}

@router.get('/test-auth', dependencies=[Depends(o_auth_pass_bearer)])
def auth(token: Annotated[str, Depends(o_auth_pass_bearer)]):
    return  {"detail" : "You are now authenticated!"}

@router.post('/login')
async def login_user(user: Annotated[UserIn, Body()], session: session_dependency):
    statement = select(Users).where(Users.email == user.email)
    results = session.exec(statement)
    for user_instance in results:
        if(user_instance) :
            if not verify_password(user.password, user_instance.password) :
                raise HTTPException(status_code=404, detail="User or Password Incorrect")
            token = {
                "access_token" : create_token({
                    "username": user_instance.username, 
                    "cpf" : user_instance.cpf,
                    "name" : user_instance.name,
                    "company_name" : user_instance.company_name,
                    "id" : user_instance.id,
                    "email" : user_instance.email,
                    "cnpj" : user_instance.cnpj,
                    "company_type" : user_instance.company_type,
                    }), 
                "token_type": "bearer"}
            return token
        else :
            raise HTTPException(status_code=404, detail="User or Password Incorrect")
    raise HTTPException(status_code=404, detail="User or Password Incorrect")
