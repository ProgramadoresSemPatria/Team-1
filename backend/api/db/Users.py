from sqlmodel import SQLModel, Field, create_engine, Session, select

class BaseUser(SQLModel):
    name: str = Field(index=True)
    username: str = Field(index=True)

class User(BaseUser, table=True):
    id: int | None = Field(default=None, primary_key=True)
    password: str 

class CreateUser(BaseUser):
    password: str