from fastapi import APIRouter, Depends, HTTPException, status, Body
from sqlmodel import Session
from typing import Annotated
import logging

from api.db import get_session
from api.routers.auth import o_auth_pass_bearer
from api.schemas.news_schema import NewsAnalysisRequest, NewsAnalysisResponse
from api.services.news_service import analyze_news_by_keyword

router = APIRouter(
    prefix="/news",
    tags=["News Analysis"]
)

session_dependency = Annotated[Session, Depends(get_session)]

@router.post(
    "/analyze",
    response_model=NewsAnalysisResponse,
    summary="Analisa o sentimento de notícias baseado em uma palavra-chave",
    description="Busca notícias usando a NewsAPI, processa o texto, prediz o sentimento e salva os resultados."
)
async def analyze_news_endpoint(
    payload: Annotated[NewsAnalysisRequest, Body(description="Palavra-chave para a busca.")],
    session: session_dependency,
    token: Annotated[str, Depends(o_auth_pass_bearer)],
):
    """
    Endpoint para análise de sentimento de notícias.

    - **keyword**: A palavra-chave para buscar artigos na NewsAPI.
    - **Authorization Header**: Deve conter o token JWT no formato "Bearer seu_token_aqui".
    """
    try:
        result = analyze_news_by_keyword(
            keyword=payload.keyword,
            token=token,
            session=session
        )
        
        if not result or result.get("articles_processed_count", 0) == 0 and not result.get("tag_id"):
            if "message" not in result:
                result["message"] = "Nenhum artigo processado ou encontrado."
                result["keyword_searched"] = payload.keyword
                result["articles_processed_count"] = 0
                result["analysis_results"] = []

            return NewsAnalysisResponse(**result)

        return NewsAnalysisResponse(**result)

    except HTTPException as http_exc:
        raise http_exc
    except ValueError as ve:
        logging.warning(f"Erro de valor no endpoint /analyze: {ve}")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ve))
    except Exception as e:
        logging.error(f"Erro inesperado no endpoint /analyze: {e}", exc_info=True)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Ocorreu um erro inesperado.")

