from sqlmodel import SQLModel, Field, create_engine, Session, select
from pydantic import EmailStr

class BaseUser(SQLModel):
    name: str = Field(index=True)
    username: str = Field(index=True)
    email: EmailStr = Field(unique=True, nullable=False, index=True)
    cpf: str 
    cnpj: str = Field(unique=True)
    company_name: str
    company_type: str

class User(BaseUser, table=True):
    id: int | None = Field(default=None, primary_key=True)
    password: str 
    

class CreateUser(BaseUser):
    password: str
