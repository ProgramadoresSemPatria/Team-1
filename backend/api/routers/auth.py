from fastapi import Depends, APIRouter, HTTPException, Body, Response, status
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

@router.post('/login/swagger', status_code=status.HTTP_200_OK)
def login_user_swagger(form_data: Annotated[OAuth2PasswordRequestForm, Depends()], session: session_dependency):
    statement = select(Users).where(Users.email == str(form_data.username).replace("\t",""))
    user_instance = session.exec(statement).one_or_none()
    if not user_instance:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User or Password Incorrect")
    if not verify_password(form_data.password, user_instance.password):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User or Password Incorrect")
    token = create_token({
                "username": user_instance.username, 
                "cpf" : user_instance.cpf,
                "name" : user_instance.name,
                "company_name" : user_instance.company_name,
                "id" : str(user_instance.id),
                "email" : user_instance.email,
                "cnpj" : user_instance.cnpj,
                "company_type" : user_instance.company_type,
                "is_admin": user_instance.is_admin
                })
    return {"access_token" : f"Bearer {token}", "token_type": "bearer"}
        

@router.get('/test-auth', dependencies=[Depends(o_auth_pass_bearer)])
def auth(token: Annotated[str, Depends(o_auth_pass_bearer)]):
    return  {"detail" : "You are now authenticated!"}

@router.post('/login', status_code=status.HTTP_200_OK)
async def login_user(user: Annotated[UserIn, Body()], session: session_dependency):
    statement = select(Users).where(Users.email == user.email)
    user_instance = session.exec(statement).one_or_none()
    if(user_instance) :
        if not verify_password(user.password, user_instance.password) :
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User or Password Incorrect")
        token = create_token({
                    "username": user_instance.username, 
                    "cpf" : user_instance.cpf,
                    "name" : user_instance.name,
                    "company_name" : user_instance.company_name,
                    "id" : str(user_instance.id),
                    "email" : user_instance.email,
                    "cnpj" : user_instance.cnpj,
                    "company_type" : user_instance.company_type,
                    "is_admin": user_instance.is_admin
                    })
        return {
            "access_token" : f"Bearer {token}", 
            "token_type": "bearer"}
    else :
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User or Password Incorrect")
    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User or Password Incorrect")
