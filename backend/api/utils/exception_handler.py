from fastapi import HTTPException, status
from fastapi.exceptions import HTTPException as FastAPIHTTPException
from api.utils.response_helper import unique_constraint_message
import logging
from jwt.exceptions import PyJWTError, ExpiredSignatureError, InvalidTokenError
from sqlalchemy.exc import SQLAlchemyError, IntegrityError, NoResultFound
from typing import Optional, Dict, Any, Type, Union

# Logger configuration
logging.basicConfig(level=logging.ERROR)
logger = logging.getLogger(__name__)

# Error codes
ERROR_CODES = {
    "UNIQUE_CONSTRAINT": "UNIQUE_CONSTRAINT_VIOLATION",
    "INVALID_TOKEN": "INVALID_TOKEN",
    "EXPIRED_TOKEN": "EXPIRED_TOKEN", 
    "NOT_FOUND": "RESOURCE_NOT_FOUND",
    "UNAUTHORIZED": "UNAUTHORIZED",
    "FORBIDDEN": "FORBIDDEN",
    "VALIDATION_ERROR": "VALIDATION_ERROR",
    "INTERNAL_ERROR": "INTERNAL_SERVER_ERROR",
    "FASTAPI_HTTP_EXCEPTION": "FASTAPI_HTTP_EXCEPTION"
}


def create_error_response(status_code: int, error_code: str, message: str, details: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    """Creates a standardized error response.

    Args:
        status_code (int): HTTP status code
        error_code (str): Application error code
        message (str): Human-readable error message
        details (Optional[Dict[str, Any]]): Additional error details

    Returns:
        Dict[str, Any]: Standardized error response
    """
    response = {
        "error": {
            "status_code": status_code,
            "code": error_code,
            "message": message
        }
    }
    
    if details:
        response["error"]["details"] = details
        
    return response


def handle_exception(e: Exception) -> None:
    """Centralizes exception handling for database operations.

    Maps uniqueness constraint violations to HTTP 400, others to HTTP 500.
    
    Args:
        e (Exception): The exception to handle.
    
    Raises:
        HTTPException: HTTP exception with appropriate status and details.
    """
    error_str = str(e)
    logger.error(f"Type of Error: {type(e)}")
    logger.error(f"Error occurred: {error_str}")
    
    # Handle database integrity errors
    if isinstance(e, IntegrityError):
        for error in ["unique constraint failed", "restrição de unicidade", "duplicate key", "violates unique constraint", "viola a restrição de unicidade"]:
            if error in error_str.lower():
                error_response = create_error_response(
                    status.HTTP_400_BAD_REQUEST,
                    ERROR_CODES["UNIQUE_CONSTRAINT"],
                    unique_constraint_message(e)
                )
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=error_response)
    
    # Handle not found errors
    if isinstance(e, NoResultFound):
        error_response = create_error_response(
            status.HTTP_404_NOT_FOUND,
            ERROR_CODES["NOT_FOUND"],
            "Requested resource not found"
        )
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=error_response)
    
    # Handle general database errors
    if isinstance(e, SQLAlchemyError):
        error_response = create_error_response(
            status.HTTP_500_INTERNAL_SERVER_ERROR,
            ERROR_CODES["INTERNAL_ERROR"],
            "Database operation failed"
        )
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=error_response)

    if isinstance(e, FastAPIHTTPException):
        raise e # re-raise the exception to be handled by the FastAPI framework
    
    # Default case - unexpected errors
    error_response = create_error_response(
        status.HTTP_500_INTERNAL_SERVER_ERROR,
        ERROR_CODES["INTERNAL_ERROR"],
        "An unexpected error occurred"
    )
    raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=error_response)


def handle_auth_exception(e: PyJWTError) -> None:
    """Handles authentication-related exceptions.
    
    Args:
        e (PyJWTError): The JWT exception to handle.
        
    Raises:
        HTTPException: HTTP exception with appropriate status and details.
    """
    logger.error(f"Authentication error: {str(e)}")
    
    if isinstance(e, ExpiredSignatureError):
        error_response = create_error_response(
            status.HTTP_401_UNAUTHORIZED,
            ERROR_CODES["EXPIRED_TOKEN"],
            "Token has expired"
        )
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=error_response)
    
    if isinstance(e, InvalidTokenError):
        error_response = create_error_response(
            status.HTTP_401_UNAUTHORIZED, 
            ERROR_CODES["INVALID_TOKEN"],
            "Invalid token"
        )
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=error_response)
    
    error_response = create_error_response(
        status.HTTP_401_UNAUTHORIZED,
        ERROR_CODES["UNAUTHORIZED"],
        "Authentication failed"
    )
    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=error_response)


def handle_validation_error(errors: Dict[str, Any]) -> None:
    """Handles validation errors.
    
    Args:
        errors (Dict[str, Any]): Validation errors.
        
    Raises:
        HTTPException: HTTP exception with validation error details.
    """
    error_response = create_error_response(
        status.HTTP_422_UNPROCESSABLE_ENTITY,
        ERROR_CODES["VALIDATION_ERROR"],
        "Validation error",
        errors
    )
    raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=error_response)
