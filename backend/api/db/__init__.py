from sqlmodel import create_engine, SQLModel, Session
import os 
from dotenv import load_dotenv

load_dotenv()

from .Users import BaseUser, CreateUser, Users
from .AIResponse import AiResponse
from .AIResponseTags import AiResponseTags

DATABASE_URL = (
    f"postgresql://{os.getenv('POSTGRESQL_USERNAME')}:"
    f"{os.getenv('POSTGRESQL_PASSWORD')}@localhost:5432/"
    f"{os.getenv('POSTGRESQL_DATABASE')}"
)

engine = create_engine(
    DATABASE_URL, 
)

def get_session():
    with Session(engine) as session:
        yield session

def create_all_table_and_db():
    SQLModel.metadata.create_all(engine)