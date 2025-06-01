from datetime import datetime, timezone, timedelta
from dotenv import load_dotenv
from fastapi import Header, HTTPException
import jwt
from jwt.exceptions import PyJWTError
import os 
from passlib.context import CryptContext
from typing import Annotated

from api.utils.exception_handler import handle_auth_exception

load_dotenv()

ALGORITHM = os.getenv('ALGORITHM')
SECRET_KEY = os.getenv('SECRET_KEY')
ACCESS_TOKEN_EXPIRE_MINUTES = 3600 * 24

pwd_context = CryptContext(schemes=['bcrypt'], deprecated="auto")

def create_hash_password(password: str) -> str:
    """Creates a password hash using bcrypt."""
    return pwd_context.hash(password)

def verify_password(plain_password: str, hash_password: str) -> bool:
    """Verifies if the plain password matches the hash."""
    return pwd_context.verify(plain_password, hash_password)

def create_token(data: dict) -> str:
    """Creates a JWT token with data and an expiration date."""
    payload = data.copy()
    expiration = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    payload.update({"exp": int(expiration.timestamp())})
    return jwt.encode(payload, key=SECRET_KEY, algorithm=ALGORITHM)

def decode_token(token: str) -> dict:
    """Decodes a JWT token and returns the data contained in it."""
    try:
        token = token.removeprefix("Bearer ").removeprefix("bearer ").strip()
        return jwt.decode(token, key=SECRET_KEY, algorithms=[ALGORITHM])
    except PyJWTError as e:
        handle_auth_exception(e)

def protected_endpoint(Authorization: Annotated[str, Header()]) -> str:
    """Verifies the validity of the authorization token."""
    try:
        token = Authorization.removeprefix("bearer ").removeprefix("Bearer ").strip()
        decode_token(token=token)
        return token
    except HTTPException as e:
        raise e  # Re-raise the HTTPException for FastAPI to handle