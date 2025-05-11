from fastapi import HTTPException, status
from api.utils.response_helper import unique_constraint_message

def handle_exception(e: Exception):
    """
    Centralize exception handling for database operations.
    Maps unique constraint violations to HTTP 400, others to HTTP 500.
    """
    error_str = str(e)
    for error in ["unique constraint failed", "restrição de unicidade"]:
        if error in error_str.lower():
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=unique_constraint_message(e))
    raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=error_str)
