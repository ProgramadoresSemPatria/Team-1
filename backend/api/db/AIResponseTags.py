from sqlmodel import SQLModel, Field

import datetime

class AiResponseTags(SQLModel, table=True):
    tag: str|None = Field(default=None, index=True, primary_key=True)
    consulted_query_date: datetime.datetime = Field(index=True)