import datetime
import uuid
from sqlmodel import SQLModel, Field

class AiResponseTags(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    tag: str|None = Field(default=None, index=True)
    consulted_query_date: datetime.datetime = Field(index=True)
    user_id: uuid.UUID
    related_key:str|None = Field(default=None)
    key:str|None = Field(default=None)