from fastapi import Header, HTTPException
from typing import Annotated

import os 
from dotenv import load_dotenv
from datetime import datetime, timezone, timedelta

from passlib.context import CryptContext
import jwt

load_dotenv()

ALGORITHM = os.getenv('ALGORITHM')
SECRET_KEY = os.getenv('SECRET_KEY')
ACCESS_TOKEN_EXPIRE_MINUTES = 3600 * 24

pwd_context = CryptContext(schemes=['bcrypt'], deprecated="auto")

def create_hash_password(password:str):
    return pwd_context.hash(password)

def verify_password(plain_password:str, hash_password:str):
    return pwd_context.verify(plain_password, hash_password)

def create_token(data:object):
    payload = data.copy()
    expiration = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    expiration = str(int(expiration.timestamp()))
    payload.update({"exp" : expiration})
    return jwt.encode(payload, key=SECRET_KEY, algorithm=ALGORITHM)

def decode_token(token:str):
    return jwt.decode(token.removeprefix("Bearer ").removeprefix("bearer "), key=SECRET_KEY, algorithms=[ALGORITHM])

def protected_endpoint(Authorization: Annotated[str, Header()]):
    token = Authorization.removeprefix("bearer ").removeprefix("Bearer ")
    try :
        decode_token(token=token)
    except :
        raise HTTPException(status_code=400, detail="Invalid token")
    return token