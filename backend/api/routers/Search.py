from fastapi import APIRouter, File, UploadFile, Body, Depends, Query
from typing import Annotated
import pandas as pd
from sqlmodel import Session, select, text
from sqlalchemy import func
from pydantic import BaseModel
from datetime import datetime

import joblib

from ..enum.TagsEnum import TagsEnum
from ml_model.preprocess import clear_text
from ..db import get_session
from ..db.AIResponse import AiResponse


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
    statement = (
        select(
            func.strftime('%Y-%m-%d %H:%M:%S', AiResponse.consulted_query_date),
            AiResponse.sentiment_prediction,
            func.count(AiResponse.id)
        )
        .group_by(func.strftime('%Y-%m-%d %H:%M:%S', AiResponse.consulted_query_date), AiResponse.sentiment_prediction)
    )

    results = session.exec(statement).all()
    to_return = [
        {"date": result[0], "sentiment": result[1], "count": result[2]}
        for result in results
    ]
    return to_return

@router.get('/input/distinct_date')
def distinct_inputted_date(session: session_dependency):
    result = session.execute(text("SELECT DISTINCT consulted_query_date FROM airesponse"))
    return [{"inputted_date": i[0]} for i in result.all()]