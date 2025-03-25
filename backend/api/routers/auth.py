from fastapi.security import OAuth2PasswordBearer
from fastapi import Depends

from typing import Annotated

from fastapi import APIRouter

router = APIRouter()

o_auth_pass_bearer = OAuth2PasswordBearer(tokenUrl="token")

@router.get('/auth', dependencies=[Depends(o_auth_pass_bearer)])
def auth(token: Annotated[str, Depends(o_auth_pass_bearer)]):
    return  {"token" : token}