from uuid import UUID
from fastapi import HTTPException, status
from sqlmodel import Session, select
from ..db.Users import CreateUser, Users, UpdateUserAdmin
from ..utils.token import create_hash_password, decode_token
from ..utils.response_helper import unique_constraint_message

def handle_exception(e: Exception):
    error_str = str(e)
    for error in ["unique constraint failed", "restrição de unicidade"]:
        if error in error_str.lower():
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=unique_constraint_message(e))
    raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=error_str)

def create_user(user: CreateUser, session: Session):
    try:
        user_model = Users.model_validate(user)
        user_model.password = create_hash_password(user_model.password)
        session.add(user_model)
        session.commit()
        session.refresh(user_model)
        return user_model
    except Exception as e:
        handle_exception(e)

def update_user(user_id: str, user: UpdateUserAdmin, session: Session, token: str):
    # Validate UUID format
    try:
        UUID(user_id.replace("-", ""))
    except ValueError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="ID must be a valid UUID string.")

    user_data = decode_token(token)
    if str(user_data.get("id")).replace("-", "") != user_id.replace("-", "") and not user_data.get("is_admin"):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin permission required!")

    existing_user = session.get(Users, UUID(user_id.replace("-", "")))
    if not existing_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")

    if existing_user.email == "admin@admin.com":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin user is immutable")

    if user.password:
        user.password = create_hash_password(user.password)

    update_data = user.model_dump(exclude_unset=True)
    existing_user.sqlmodel_update(update_data)

    try:
        session.add(existing_user)
        session.commit()
        session.refresh(existing_user)
        return existing_user
    except Exception as e:
        handle_exception(e)

def delete_user(user_id: str, session: Session, token: str):
    user_data = decode_token(token)
    if not user_data.get("is_admin"):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin permission required!")

    existing_user = session.get(Users, UUID(user_id.replace("-", "")))
    if not existing_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")

    if existing_user.email == "admin@admin.com":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin user is immutable")

    session.delete(existing_user)
    session.commit()

def retrieve_all_users(session: Session):
    return session.exec(select(Users)).all()

def retrieve_user(user_id: str, session: Session, token: str):
    user_data = decode_token(token)
    if not user_data.get("is_admin"):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin permission required!")

    existing_user = session.get(Users, UUID(user_id.replace("-", "")))
    if not existing_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")
    return existing_user
