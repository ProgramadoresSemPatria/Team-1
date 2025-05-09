from sqlmodel import Session, select

import os 
from dotenv import load_dotenv

load_dotenv()

from api.db import engine
from api.db.Users import Users
from api.utils.token import create_hash_password
from api.utils.exception_handler import handle_exception

ADMIN_PASSWORD = os.getenv('ADMIN_PASSWORD')

def create_admin() -> None:
    """Cria um usuário administrador no banco de dados.

    Verifica se o usuário administrador já existe e, se não, cria um novo.
    """
    admin_user_data = {
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

    if not ADMIN_PASSWORD:
        raise ValueError("ADMIN_PASSWORD não está definido no ambiente.")

    with Session(engine) as session:
        try:
            user_to_db = Users.model_validate(admin_user_data)
            user_to_db.password = create_hash_password(admin_user_data.get('password'))

            statement = select(Users.email).where(Users.email == "admin@admin.com")
            admin_email = session.execute(statement).one_or_none()
            if admin_email:
                print("O usuário administrador já existe.")
                return

            session.add(user_to_db)
            session.commit()
            session.refresh(user_to_db)
        except Exception as e:
            handle_exception(e)