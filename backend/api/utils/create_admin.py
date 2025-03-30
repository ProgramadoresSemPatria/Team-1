from sqlmodel import Session, select

import os 
from dotenv import load_dotenv

load_dotenv()

from api.db import engine
from api.db.Users import Users
from api.utils.token import create_hash_password

ADMIN_PASSWORD = os.getenv('ADMIN_PASSWORD')

def create_admin():
    admin_user = {
        "name": "admin",
        "username": "admin",
        "email": "admin@admin.com",
        "cpf": "11111111111",
        "cnpj": "74599023000109",
        "company_name": "admin",
        "company_type": "admin",
        "password": ADMIN_PASSWORD,
        "is_admin": True
    }
    with Session(engine) as session:
        try:
            user_to_db = Users.model_validate(admin_user)
            user_to_db.password = create_hash_password(admin_user.get('password'))

            statement = select(Users.email).where(Users.email == "admin@admin.com")
            admin_email = session.execute(statement).one_or_none()
            if admin_email:
                return

            session.add(user_to_db)
            session.commit()
            session.refresh(user_to_db)
        except Exception as e :
            print(e)