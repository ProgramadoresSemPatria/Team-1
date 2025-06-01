import datetime
import uuid
from sqlmodel import Field, SQLModel
from api.db.AIResponseTags import AiResponseTags

class AiResponse(SQLModel, table=True):
    id: int | None = Field(primary_key=True, default=None)
    text: str
    sentiment_prediction: str
    consulted_query_date: datetime.datetime = Field(index=True)
    user_id: uuid.UUID
    related_key:str|None = Field(default=None)

    # Campos adicionais para metadados do artigo
    article_title: str | None = Field(default=None)
    article_source_name: str | None = Field(default=None)
    article_published_at: datetime.datetime | None = Field(default=None)
    original_keyword: str | None = Field(default=None) # Palavra-chave que originou este resultado