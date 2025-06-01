from fastapi import HTTPException, status
from sqlmodel import Session, select
from typing import Dict, Any
from pydantic import EmailStr

from ..db.Users import Users, UserIn
from ..utils.token import verify_password, create_token
from ..utils.exception_handler import create_error_response, ERROR_CODES

# Common error message for failed login attempts (security best practice)
INVALID_CREDENTIALS_ERROR = "Invalid email or password"

def _create_token_payload(user: Users) -> Dict[str, Any]:
    """Creates a standardized token payload from user data.
    
    Args:
        user: User model instance
        
    Returns:
        Dict containing user information for token
    """
    return {
        "username": user.username,
        "cpf": user.cpf,
        "name": user.name,
        "company_name": user.company_name,
        "id": str(user.id),
        "email": user.email,
        "cnpj": user.cnpj,
        "company_type": user.company_type,
        "is_admin": user.is_admin
    }

def login_user_swagger(form_data, session: Session):
    """Login handler for Swagger UI.
    
    Args:
        form_data: OAuth2 form data with username and password
        session: Database session
        
    Returns:
        Dict with access token
        
    Raises:
        HTTPException: If login fails
    """
    # Clean input data
    email = str(form_data.username).replace("\t", "").strip()
    
    # Find user by email
    statement = select(Users).where(Users.email == email)
    user_instance = session.exec(statement).one_or_none()
    
    # Verify user exists and password is correct
    if not user_instance or not verify_password(form_data.password, user_instance.password):
        error_response = create_error_response(
            status.HTTP_401_UNAUTHORIZED,
            ERROR_CODES["UNAUTHORIZED"],
            INVALID_CREDENTIALS_ERROR
        )
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=error_response)
    
    # Generate token
    token = create_token(_create_token_payload(user_instance))
    return {"access_token": token, "token_type": "bearer"}

def login_user(user: UserIn, session: Session):
    """Regular login handler.
    
    Args:
        user: User login data with email and password
        session: Database session
        
    Returns:
        Dict with access token
        
    Raises:
        HTTPException: If login fails
    """
    # Find user by email
    statement = select(Users).where(Users.email == user.email)
    user_instance = session.exec(statement).one_or_none()
    
    # Verify user exists and password is correct
    if not user_instance or not verify_password(user.password, user_instance.password):
        error_response = create_error_response(
            status.HTTP_401_UNAUTHORIZED,
            ERROR_CODES["UNAUTHORIZED"],
            INVALID_CREDENTIALS_ERROR
        )
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=error_response)
    
    # Generate token
    token = create_token(_create_token_payload(user_instance))
    return {"access_token": token, "token_type": "bearer"}
