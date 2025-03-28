from fastapi import APIRouter, File, UploadFile, Body, Depends, Query
from typing import Annotated, Union
import pandas as pd
from sqlmodel import Session, select, text
from sqlalchemy import func
from pydantic import BaseModel
from datetime import datetime

import joblib

from ..enum.TagsEnum import TagsEnum
from ..enum.DateOperator import DateOperator
from ml_model.preprocess import clear_text
from ..db import get_session
from ..db.AIResponse import AiResponse
from api.utils.operators import convert_text_to_operator


router = APIRouter(
    prefix="/search",
    tags=[TagsEnum.search]
)

model = joblib.load('ml_model/model/modelo_sentimento.pkl') 
vectorizer = joblib.load('ml_model/model/vectorizer.pkl') 
session_dependency = Annotated[Session, Depends(get_session)]


@router.post('/input')
async def upload_file(file: Annotated[UploadFile, File()], session: session_dependency):
    df = pd.read_csv(file.file)

    df['Text'] = df['Text'].apply(clear_text)

    X = vectorizer.transform(df['Text'])
    df['Sentiment_Prediction'] = model.predict(X)
    df_table = df.copy()
    result = df[['Text', 'Sentiment_Prediction']].to_dict(orient='records')


    df_table.rename({"Text":"text", "Sentiment_Prediction":"sentiment_prediction"}, axis=1, inplace=True)
    df_table["consulted_query_date"] = datetime.now()
    df_table_dict = df_table.to_dict(orient='records')
    session.bulk_insert_mappings(AiResponse, df_table_dict)
    session.commit()

    return result

@router.post('/find')
async def find_feedback(keywords:Annotated[list[str], Body()]):
    # ALL THE AI LOGIC HERE
    return {"message": "We are searching for feedbacks for you, please wait until finish!", "keywords": keywords}

@router.get('/input/group/')
def results_by_day(session: session_dependency):
    statment = "SELECT strftime('%Y-%m-%d %H:%M:%S', consulted_query_date), sentiment_prediction, count(*) FROM airesponse GROUP BY sentiment_prediction, consulted_query_date"
    results = session.execute(text(statment)).all()
    to_return = [
        {"date": result[0], "sentiment": result[1], "count": result[2]}
        for result in results
    ]
    return to_return

@router.get('/input/distinct_date')
def distinct_inputted_date(session: session_dependency):
    result = session.execute(text("SELECT DISTINCT consulted_query_date FROM airesponse"))
    return [{"inputted_date": i[0]} for i in result.all()]

@router.get('/input/filter/')
def filter_inputted(
    session: session_dependency, 
    date:Annotated[str | None, Query()] = None, 
    date_operator:Annotated[DateOperator | None, Query()] = None, 
    sentiment:Annotated[Union[str, None], Query(regex="^(positivo|negativo|neutro)$", )] = None, 
    items_per_page:Annotated[int, Query(le=100)] = 10, 
    page:Annotated[int, Query()] = 1):
    if date and not date_operator :
        return {"message": "Please provide operator for filter data - [gte, gt, e, lt, lte]"}
    if date_operator and not date:
        return {"message": "Using date operator, you must provide a date"}
        
    where_date = None
    where_sentiment = None

    if date:
        where_date = f"consulted_query_date {convert_text_to_operator(date_operator.value)} '{date}'"
    if sentiment:
        where_sentiment = f"sentiment_prediction = '{sentiment}'"


    where_clause_parts = []
    if where_date:
        where_clause_parts.append(where_date)
    if where_sentiment:
        where_clause_parts.append(where_sentiment)

    where_clause = "WHERE " + " AND ".join(where_clause_parts) if where_clause_parts else ""
    statment = f"SELECT * FROM airesponse {where_clause if where_clause else ""}"

    try:
        results = session.execute(text(statment)).all()
        to_return = [
        {"date": result[3], "sentiment": result[2], "text": result[1]}
        for result in results[(page-1)*items_per_page:items_per_page]
        ]
        return to_return
    except Exception as e:
        print(e)
        return {"message" : "Failed to get data!", "erro" : str(e.message)}