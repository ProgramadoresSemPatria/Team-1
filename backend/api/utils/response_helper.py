from typing import Any, Dict, Optional, TypeVar, Generic, List
from pydantic import BaseModel

T = TypeVar('T')

class PaginatedResponse(BaseModel, Generic[T]):
    """Standard paginated response model."""
    items: List[T]
    total: int
    page: int
    items_per_page: int
    total_pages: int

def unique_constraint_message(error: Exception) -> str:
    """Generates an error message for unique constraint violations.

    Args:
        error (Exception): The exception that contains the error message.

    Returns:
        str: Message indicating that the value is already registered.
    """
    string_error = str(error)
    
    # Find delimiter positions
    dots_position = string_error.find(":")
    break_line_position = string_error.find("\n")
    dot_between_position = string_error.find(".", dots_position)

    # Check if positions are valid
    if dot_between_position == -1 or break_line_position == -1:
        return "An error occurred. Please try again."

    column_name = string_error[dot_between_position + 1:break_line_position].strip().capitalize()
    return f"{column_name} already registered. Choose another one."

def create_success_response(
    data: Any, 
    message: Optional[str] = None,
    status_code: int = 200
) -> Dict[str, Any]:
    """Creates a standardized success response.
    
    Args:
        data: The data to include in the response
        message: Optional success message
        status_code: HTTP status code
        
    Returns:
        Dict with standardized success response format
    """
    response = {
        "status": "success",
        "status_code": status_code,
        "data": data
    }
    
    if message:
        response["message"] = message
        
    return response

def create_paginated_response(
    items: List[Any],
    total: int,
    page: int,
    items_per_page: int,
    message: Optional[str] = None
) -> Dict[str, Any]:
    """Creates a standardized paginated response.
    
    Args:
        items: List of items for the current page
        total: Total number of items (across all pages)
        page: Current page number
        items_per_page: Number of items per page
        message: Optional success message
        
    Returns:
        Dict with standardized paginated response format
    """
    total_pages = (total + items_per_page - 1) // items_per_page if items_per_page > 0 else 0
    
    pagination = {
        "total": total,
        "page": page,
        "items_per_page": items_per_page,
        "total_pages": total_pages
    }
    
    response = {
        "status": "success",
        "status_code": 200,
        "data": items,
        "pagination": pagination
    }
    
    if message:
        response["message"] = message
        
    return response