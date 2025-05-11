from fastapi import HTTPException
from sqlmodel import Session, select
from ..db.Users import Users
from ..utils.token import verify_password, create_token
from ..enum.TagsEnum import TagsEnum

def login_user_swagger(form_data, session: Session):
    statement = select(Users).where(Users.email == str(form_data.username).replace("\t", ""))
    user_instance = session.exec(statement).one_or_none()
    if not user_instance:
        raise HTTPException(status_code=400, detail="User or Password Incorrect")
    if not verify_password(form_data.password, user_instance.password):
        raise HTTPException(status_code=400, detail="User or Password Incorrect")
    
    token = create_token({
        "username": user_instance.username, 
        "cpf": user_instance.cpf,
        "name": user_instance.name,
        "company_name": user_instance.company_name,
        "id": str(user_instance.id),
        "email": user_instance.email,
        "cnpj": user_instance.cnpj,
        "company_type": user_instance.company_type,
        "is_admin": user_instance.is_admin
    })
    return {"access_token": f"Bearer {token}", "token_type": "bearer"}

def login_user(user, session: Session):
    statement = select(Users).where(Users.email == user.email)
    user_instance = session.exec(statement).one_or_none()
    if user_instance:
        if not verify_password(user.password, user_instance.password):
            raise HTTPException(status_code=401, detail="User or Password Incorrect")
        
        token = create_token({
            "username": user_instance.username, 
            "cpf": user_instance.cpf,
            "name": user_instance.name,
            "company_name": user_instance.company_name,
            "id": str(user_instance.id),
            "email": user_instance.email,
            "cnpj": user_instance.cnpj,
            "company_type": user_instance.company_type,
            "is_admin": user_instance.is_admin
        })
        return {"access_token": f"Bearer {token}", "token_type": "bearer"}
    else:
        raise HTTPException(status_code=401, detail="User or Password Incorrect")
