from sqlmodel import SQLModel, Field, create_engine, Session, select
from pydantic import EmailStr, BaseModel

import uuid

class BaseUser(SQLModel):
    name: str = Field(index=True)
    username: str = Field(index=True)
    email: EmailStr = Field(unique=True, nullable=False, index=True)
    cpf: str 
    cnpj: str = Field(unique=True)
    company_name: str
    company_type: str

class Users(BaseUser, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    password: str 
    is_admin: bool = Field(default=False)
    

class CreateUser(BaseUser):
    password: str

class UserIn(BaseModel):
    email: EmailStr
    password: str

class UpdateUser(BaseUser):
    name: str | None = Field(default=None, index=True)
    username: str | None = Field(default=None, index=True)
    email: EmailStr | None = Field(default=None, unique=True, nullable=False, index=True)
    cpf: str | None = Field(default=None, )
    cnpj: str | None = Field(default=None, unique=True)
    company_name: str | None = Field(default=None, )
    company_type: str | None = Field(default=None, )

class RetrieveUser(BaseUser):
    id: uuid.UUID

class PublicUser(BaseModel):
    username: str

class UpdateUserAdmin(BaseUser):
    name: str | None = Field(default=None, index=True)
    username: str | None = Field(default=None, index=True)
    email: EmailStr | None = Field(default=None, unique=True, nullable=False, index=True)
    cpf: str | None = Field(default=None, )
    cnpj: str | None = Field(default=None, unique=True)
    company_name: str | None = Field(default=None, )
    company_type: str | None = Field(default=None, )
    is_admin: bool | None = Field(default=False),
    password: str | None = Field(default=None)