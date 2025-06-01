from datetime import datetime
from pydantic import BaseModel, Field
from typing import List, Optional

class NewsAnalysisRequest(BaseModel):
    keyword: str = Field(..., min_length=1, description="Palavra-chave para buscar notícias.")

class ArticleSentiment(BaseModel):
    title: Optional[str]
    source: Optional[str]
    published_at: Optional[datetime]
    text_snippet: str
    sentiment: str

class NewsAnalysisResponse(BaseModel):
    message: str
    keyword_searched: str
    tag_id: Optional[int]
    related_key: Optional[str]
    articles_processed_count: int
    analysis_results: List[ArticleSentiment]

class ErrorResponse(BaseModel):
    detail: str

# Schema para o corpo da resposta em caso de erro de validação do token, por exemplo
class TokenErrorResponse(BaseModel):
    detail: str = "Token inválido ou ausente."

# Schema para resposta de erro da NewsAPI
class NewsApiErrorResponse(BaseModel):
    detail: str = "Erro ao buscar notícias. Tente novamente mais tarde."
