from sqlmodel import SQLModel, Field
from .AIResponseTags import AiResponseTags

import datetime

class AiResponse(SQLModel, table=True):
    id: int | None = Field(primary_key=True, default=None)
    text: str
    sentiment_prediction: str
    consulted_query_date: datetime.datetime = Field(index=True, foreign_key="airesponsetags.consulted_query_date")