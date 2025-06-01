from uuid import UUID
from fastapi import HTTPException, status
from sqlmodel import Session, select
from typing import List, Dict, Any, Optional

from ..db.Users import CreateUser, Users, UpdateUserAdmin
from api.utils.exception_handler import handle_exception, create_error_response, ERROR_CODES
from api.utils.token import create_hash_password, decode_token

def create_user(user: CreateUser, session: Session):
    """Creates a new user.
    
    Args:
        user: User data to create
        session: Database session
        
    Returns:
        Users: Created user model
        
    Raises:
        HTTPException: If there's an error creating the user
    """
    try:
        # Create user model from input data
        user_model = Users.model_validate(user)
        # Hash the password
        user_model.password = create_hash_password(user_model.password)
        
        # Save to database
        session.add(user_model)
        session.commit()
        session.refresh(user_model)
        
        return user_model
    except Exception as e:
        print("Erro no create_user [SERVICE]")
        handle_exception(e)

def update_user(user_id: str, user: UpdateUserAdmin, session: Session, token: str):
    """Updates an existing user.
    
    Args:
        user_id: ID of the user to update
        user: User data to update
        session: Database session
        token: Authentication token
        
    Returns:
        Users: Updated user model
        
    Raises:
        HTTPException: If there's an error updating the user
    """
    try:
        # Validate UUID format
        try:
            user_uuid = UUID(user_id.replace("-", ""))
        except ValueError:
            error_response = create_error_response(
                status.HTTP_400_BAD_REQUEST,
                ERROR_CODES["VALIDATION_ERROR"],
                "ID must be a valid UUID string"
            )
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=error_response)

        # Check permissions
        user_data = decode_token(token)
        is_current_user = str(user_data.get("id")).replace("-", "") == user_id.replace("-", "")
        is_admin = user_data.get("is_admin", False)
        
        if not is_current_user and not is_admin:
            error_response = create_error_response(
                status.HTTP_403_FORBIDDEN,
                ERROR_CODES["FORBIDDEN"],
                "Admin permission required to modify other users"
            )
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=error_response)

        # Find existing user
        existing_user = session.get(Users, user_uuid)
        if not existing_user:
            error_response = create_error_response(
                status.HTTP_404_NOT_FOUND,
                ERROR_CODES["NOT_FOUND"],
                "User not found"
            )
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=error_response)

        # Protect admin user
        if existing_user.email == "admin@admin.com":
            error_response = create_error_response(
                status.HTTP_403_FORBIDDEN,
                ERROR_CODES["FORBIDDEN"],
                "Admin user is immutable"
            )
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=error_response)

        # Hash password if provided
        if user.password:
            user.password = create_hash_password(user.password)

        # Update user data
        update_data = user.model_dump(exclude_unset=True)
        existing_user.sqlmodel_update(update_data)

        # Save changes
        session.add(existing_user)
        session.commit()
        session.refresh(existing_user)
        
        return existing_user
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        handle_exception(e)

def delete_user(user_id: str, session: Session, token: str):
    """Deletes a user.
    
    Args:
        user_id: ID of the user to delete
        session: Database session
        token: Authentication token
        
    Raises:
        HTTPException: If there's an error deleting the user
    """
    try:
        # Check admin permissions
        user_data = decode_token(token)
        if not user_data.get("is_admin"):
            error_response = create_error_response(
                status.HTTP_403_FORBIDDEN,
                ERROR_CODES["FORBIDDEN"],
                "Admin permission required"
            )
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=error_response)

        # Validate UUID and find user
        try:
            user_uuid = UUID(user_id.replace("-", ""))
        except ValueError:
            error_response = create_error_response(
                status.HTTP_400_BAD_REQUEST,
                ERROR_CODES["VALIDATION_ERROR"],
                "ID must be a valid UUID string"
            )
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=error_response)
            
        existing_user = session.get(Users, user_uuid)
        if not existing_user:
            error_response = create_error_response(
                status.HTTP_404_NOT_FOUND,
                ERROR_CODES["NOT_FOUND"],
                "User not found"
            )
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=error_response)

        # Protect admin user
        if existing_user.email == "admin@admin.com":
            error_response = create_error_response(
                status.HTTP_403_FORBIDDEN,
                ERROR_CODES["FORBIDDEN"],
                "Admin user is immutable"
            )
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=error_response)

        # Delete user
        session.delete(existing_user)
        session.commit()
        
        return {"message": "User deleted successfully"}
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        handle_exception(e)

def retrieve_all_users(session: Session) -> List[Users]:
    """Retrieves all users.
    
    Args:
        session: Database session
        
    Returns:
        List[Users]: List of all users
        
    Raises:
        HTTPException: If there's an error retrieving users
    """
    try:
        return session.exec(select(Users)).all()
    except Exception as e:
        handle_exception(e)

def retrieve_user(user_id: str, session: Session, token: str) -> Users:
    """Retrieves a specific user.
    
    Args:
        user_id: ID of the user to retrieve
        session: Database session
        token: Authentication token
        
    Returns:
        Users: Retrieved user model
        
    Raises:
        HTTPException: If there's an error retrieving the user
    """
    try:
        # Check admin permissions
        user_data = decode_token(token)
        if not user_data.get("is_admin"):
            error_response = create_error_response(
                status.HTTP_403_FORBIDDEN,
                ERROR_CODES["FORBIDDEN"],
                "Admin permission required"
            )
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=error_response)

        # Validate UUID and find user
        try:
            user_uuid = UUID(user_id.replace("-", ""))
        except ValueError:
            error_response = create_error_response(
                status.HTTP_400_BAD_REQUEST,
                ERROR_CODES["VALIDATION_ERROR"],
                "ID must be a valid UUID string"
            )
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=error_response)
            
        existing_user = session.get(Users, user_uuid)
        if not existing_user:
            error_response = create_error_response(
                status.HTTP_404_NOT_FOUND,
                ERROR_CODES["NOT_FOUND"],
                "User not found"
            )
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=error_response)
            
        return existing_user
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        handle_exception(e)
