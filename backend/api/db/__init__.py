from sqlmodel import create_engine, SQLModel, Session

from .Users import BaseUser, CreateUser, User

database_name = "database.db"
database_url = f"sqlite:///api/db/{database_name}"
connect_args = {"check_same_thread":False}
engine = create_engine(
    database_url, 
    connect_args=connect_args
)

def get_session():
    with Session(engine) as session:
        yield session

def create_all_table_and_db():
    SQLModel.metadata.create_all(engine)