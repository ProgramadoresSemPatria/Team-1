from sqlmodel import SQLModel, Field

import datetime

class AiResponse(SQLModel, table=True):
    id: int | None = Field(primary_key=True, default=None)
    text: str
    sentiment_prediction: str
    consulted_query_date: datetime.datetime = Field(index=True)