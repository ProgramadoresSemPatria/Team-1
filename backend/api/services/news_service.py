import logging
import os
import uuid
from datetime import datetime, timezone
from pathlib import Path

import pandas as pd
from newsapi import NewsApiClient
from newsapi.newsapi_exception import NewsAPIException
from sqlmodel import Session, select

from api.db.AIResponse import AiResponse
from api.db.AIResponseTags import AiResponseTags
from api.utils.exception_handler import handle_exception
from api.utils.token import decode_token
from api.utils.ml_loader import sentiment_model as model, text_vectorizer as vectorizer
from ml_model.preprocess import clear_text

# Get the absolute path to the model files
BASE_DIR = Path(__file__).resolve().parent.parent.parent
MODEL_PATH = BASE_DIR / "ml_model" / "model"


NEWSAPI_KEY = os.getenv("NEWSAPI_KEY")
newsapi_client = NewsApiClient(api_key=NEWSAPI_KEY)

MAX_ARTICLES_TO_PROCESS = 30

def analyze_news_by_keyword(keyword: str, token: str, session: Session):
    """
    Busca notícias pela palavra-chave, analisa o sentimento e salva no banco.
    """
    try:
        user_info = decode_token(token)
        user_id_str = user_info.get("id")
        if not user_id_str:
            raise ValueError("ID do usuário não encontrado no token.")
        user_id = uuid.UUID(user_id_str)
    except ValueError as e:
        logging.error(f"Erro na decodificação do token: {e}")
        handle_exception(ValueError("Token inválido ou informações do usuário ausentes."))
        return {}
    
    current_time_str = datetime.now(timezone.utc).strftime("%Y/%m/%d-%H:%M")
    tag_value = f"{keyword}-{current_time_str}"

    all_tag_vales = session.exec(select(AiResponseTags.tag).filter(AiResponseTags.tag.like(f"{tag_value}"))).all()
    if all_tag_vales:
        raise ValueError("Já existe uma análise com esta palavra-chave.")

    try:
        all_articles_data = newsapi_client.get_everything(
            q=keyword,
            language='pt',
            sort_by='relevancy',
            page_size=MAX_ARTICLES_TO_PROCESS 
        )
    except NewsAPIException as e:
        logging.error(f"Erro ao chamar a NewsAPI: {e.get_message()}")
        handle_exception(RuntimeError(f"NewsAPI error: {e.get_message()}"), session)
        return {} 
    except Exception as e:
        logging.error(f"Erro de conexão com a NewsAPI: {e}")
        handle_exception(RuntimeError(f"Connection error with NewsAPI: {e}"), session)
        return {}

    articles = all_articles_data.get('articles', [])
    if not articles:
        return {
            "message": "Nenhum artigo encontrado para a palavra-chave fornecida.",
            "keyword_searched": keyword,
            "tag_id": None,
            "related_key": None,
            "articles_processed_count": 0,
            "analysis_results": []
        }

    df_data = []
    for article in articles:
        text_to_analyze = article.get('description') or article.get('content')
        if text_to_analyze:
            df_data.append({
                'Text': text_to_analyze,
                'Title': article.get('title'),
                'Source': article.get('source', {}).get('name'),
                'PublishedAt': article.get('publishedAt')
            })
    
    if not df_data:
         return {
            "message": "Nenhum artigo com conteúdo textual (descrição/conteúdo) encontrado.",
            "keyword_searched": keyword,
            "tag_id": None,
            "related_key": None,
            "articles_processed_count": 0,
            "analysis_results": []
        }

    df = pd.DataFrame(df_data)
    
    current_time_utc = datetime.now(timezone.utc)
    df['Clean_Text'] = df['Text'].apply(lambda x: clear_text(str(x)) if pd.notnull(x) else "")
    
    df = df[df['Clean_Text'].str.len() > 0].copy()
    if df.empty:
        return {
            "message": "Nenhum texto válido para análise após limpeza.",
            "keyword_searched": keyword,
            "tag_id": None,
            "related_key": None,
            "articles_processed_count": 0,
            "analysis_results": []
        }

    X = vectorizer.transform(df['Clean_Text'])
    df['Sentiment_Prediction'] = model.predict(X)

    df_table = df.copy()
    
    # Corrigindo a operação de renomeação
    column_mapping = {
        "Text": "text",
        "Sentiment_Prediction": "sentiment_prediction",
        "Title": "article_title",
        "Source": "article_source_name",
        "PublishedAt": "article_published_at"
    }
    df_table = df_table.rename(columns=column_mapping)
    
    df_table["consulted_query_date"] = current_time_utc
    df_table["user_id"] = user_id
    
    def parse_datetime_optional(dt_str):
        if pd.notnull(dt_str):
            try:
                return datetime.fromisoformat(dt_str.replace('Z', '+00:00'))
            except ValueError:
                return None
        return None

    df_table["article_published_at"] = df_table["article_published_at"].apply(parse_datetime_optional)
    
    related_key_value = f"{str(user_id)}{str(current_time_utc.timestamp())}"
    df_table["related_key"] = related_key_value
    df_table["original_keyword"] = keyword

    columns_for_ai_response = [
        "text", "sentiment_prediction", "consulted_query_date", 
        "user_id", "related_key", "article_title", 
        "article_source_name", "article_published_at", "original_keyword"
    ]
    ai_response_records_dict = df_table[columns_for_ai_response].to_dict(orient='records')

    tag_key_value = f"{str(user_id)}{keyword}"
    
    
    
    ai_response_tag_data = AiResponseTags(
        consulted_query_date=current_time_utc,
        tag=tag_value,
        user_id=user_id,
        related_key=related_key_value,
        key=tag_key_value
    )
    
    try:
        session.add(ai_response_tag_data)
        
        for record_dict in ai_response_records_dict:
            session.add(AiResponse.model_validate(record_dict))
        
        session.commit()
        session.refresh(ai_response_tag_data)
        
        analysis_results_for_response = []
        for record in ai_response_records_dict:
            analysis_results_for_response.append({
                "title": record.get("article_title"),
                "source": record.get("article_source_name"),
                "published_at": record.get("article_published_at"),
                "text_snippet": record.get("text", "")[:150] + "..." if record.get("text") else "",
                "sentiment": record.get("sentiment_prediction")
            })

        return {
            "message": "Análise de notícias concluída com sucesso.",
            "keyword_searched": keyword,
            "tag_id": ai_response_tag_data.id,
            "related_key": related_key_value,
            "articles_processed_count": len(ai_response_records_dict),
            "analysis_results": analysis_results_for_response
        }

    except Exception as e:
        logging.error(f"Erro ao salvar no banco de dados: {e}")
        handle_exception(e)
        return {}

