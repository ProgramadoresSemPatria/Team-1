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

def create_hash_password(password: str) -> str:
    """Cria um hash da senha usando bcrypt."""
    return pwd_context.hash(password)

def verify_password(plain_password: str, hash_password: str) -> bool:
    """Verifica se a senha em texto simples corresponde ao hash."""
    return pwd_context.verify(plain_password, hash_password)

def create_token(data: object) -> str:
    """Cria um token JWT com dados e uma data de expiração."""
    payload = data.copy()
    expiration = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    payload.update({"exp": str(int(expiration.timestamp()))})
    return jwt.encode(payload, key=SECRET_KEY, algorithm=ALGORITHM)

def decode_token(token: str) -> dict:
    """Decodifica um token JWT e retorna os dados contidos nele."""
    try:
        return jwt.decode(token.removeprefix("Bearer ").removeprefix("bearer "), key=SECRET_KEY, algorithms=[ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expirado")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Token inválido")

def protected_endpoint(Authorization: Annotated[str, Header()]) -> str:
    """Verifica a validade do token de autorização."""
    token = Authorization.removeprefix("bearer ").removeprefix("Bearer ")
    try:
        decode_token(token=token)
    except HTTPException as e:
        raise e  # Re-raise the HTTPException for FastAPI to handle
    return token