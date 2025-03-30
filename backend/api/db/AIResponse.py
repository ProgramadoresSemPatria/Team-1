from sqlmodel import SQLModel, Field
from .AIResponseTags import AiResponseTags

import datetime
import uuid

class AiResponse(SQLModel, table=True):
    id: int | None = Field(primary_key=True, default=None)
    text: str
    sentiment_prediction: str
    consulted_query_date: datetime.datetime = Field(index=True)
    user_id: uuid.UUID
    related_key:str|None = Field(default=None)