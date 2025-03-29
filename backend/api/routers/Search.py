from fastapi import APIRouter, File, UploadFile, Body, Depends, Query, Path
from typing import Annotated, Union
import pandas as pd
from sqlmodel import Session, select, text
from sqlalchemy import func, delete
from pydantic import BaseModel
from datetime import datetime

import joblib

from ..enum.TagsEnum import TagsEnum
from ..enum.DateOperator import DateOperator
from ml_model.preprocess import clear_text
from ..db import get_session
from ..db.AIResponse import AiResponse
from ..db.AIResponseTags import AiResponseTags
from api.utils.operators import convert_text_to_operator
from api.utils.query_helper import build_where_clause


router = APIRouter(
    prefix="/search",
    tags=[TagsEnum.search]
)

model = joblib.load('ml_model/model/modelo_sentimento.pkl') 
vectorizer = joblib.load('ml_model/model/vectorizer.pkl') 
session_dependency = Annotated[Session, Depends(get_session)]


@router.post('/input')
async def upload_file(file: Annotated[UploadFile, File()], session: session_dependency):
    today = datetime.now()
    df = pd.read_csv(file.file)

    df['Text'] = df['Text'].apply(clear_text)

    X = vectorizer.transform(df['Text'])
    df['Sentiment_Prediction'] = model.predict(X)
    df_table = df.copy()
    result = df[['Text', 'Sentiment_Prediction']].iloc[:30, :].to_dict(orient='records')


    df_table.rename({"Text":"text", "Sentiment_Prediction":"sentiment_prediction"}, axis=1, inplace=True)
    df_table["consulted_query_date"] = today
    df_table_dict = df_table.to_dict(orient='records')
    session.bulk_insert_mappings(AiResponse, df_table_dict)

    dict_tag_prediction = {
        "consulted_query_date" : today,
        "tag" : file.filename.replace('.csv', '')
    }
    dict_to_db = AiResponseTags.model_validate(dict_tag_prediction)
    session.add(dict_to_db)

    try:
        session.commit()
    except Exception as e :
        return {"message":"Error", "erro": str(e._message)}
    
    session.refresh(dict_to_db)
    return {"message": "success", "sample": result}

@router.post('/find')
async def find_feedback(keywords:Annotated[list[str], Body()]):
    # ALL THE AI LOGIC HERE
    return {"message": "We are searching for feedbacks for you, please wait until finish!", "keywords": keywords}

@router.get('/input/group/')
def results_by_day(session: session_dependency):
    statment = "SELECT tag, sentiment_prediction, count(*) FROM airesponse LEFT JOIN airesponsetags on airesponse.consulted_query_date = airesponsetags.consulted_query_date GROUP BY sentiment_prediction, tag"
    results = session.execute(text(statment)).all()
    to_return = [
        {"tag": result[0], "sentiment": result[1], "count": result[2]}
        for result in results
    ]
    return to_return

@router.get('/input/distinct_tag')
def distinct_tag(session: session_dependency):
    result = session.execute(text("SELECT DISTINCT tag FROM AiResponseTags"))
    return [i[0] for i in result.all()]

@router.post('/input/filter/')
def filter_inputted(
    session: session_dependency, 
    tags: Annotated[list[str] | None, Body()] = None,
    sentiment:Annotated[Union[str, None], Query(regex="^(positivo|negativo|neutro)$", )] = None, 
    items_per_page:Annotated[int, Query(le=100)] = 10, 
    page:Annotated[int, Query()] = 1,
    date:Annotated[str | None, Query()] = None, 
    date_operator:Annotated[DateOperator | None, Query()] = None, 
    ):
    if (date and not date_operator) or (date_operator and not date) :
        return {"message": "Please provide operator and data to filter - operators: [gte, gt, e, lt, lte]"}


    filters = {}
    if date and date_operator:
        filters["consulted_query_date"] = {"operator": date_operator.value, "value": date}
    if sentiment:
        filters["sentiment_prediction"] = [sentiment]
    if tags:
        filters['tag'] = tags

    where_clause = build_where_clause(**filters)
    
    statment = f"SELECT * FROM airesponse LEFT JOIN airesponsetags on airesponse.consulted_query_date = airesponsetags.consulted_query_date {where_clause if where_clause else ""}"

    try:
        results = session.execute(text(statment)).all()
        to_return = [
        {"date": result[3], "sentiment": result[2], "text": result[1], "tag" : result[4]}
        for result in results[(page-1)*items_per_page:page*items_per_page]
        ]
        return to_return
    except Exception as e:
        print(e)
        return {"message" : "Failed to get data!", "erro" : str(e._message)}

@router.delete('/input/{tag}')
def delete_response(session:session_dependency, tag:Annotated[str, Path()]):
    try :
        statment_airesponsetags = select(AiResponseTags).where(AiResponseTags.tag == tag)
        result_airesponsetags = session.execute(statment_airesponsetags).one().tuple()[0]
        tag_date = [value for (column, value) in result_airesponsetags if column=="consulted_query_date"][0]

        statment_airesponse = delete(AiResponse).where(AiResponse.consulted_query_date == tag_date)
        statment_airesponsetags = delete(AiResponseTags).where(AiResponseTags.tag == tag)
        session.execute(statment_airesponse)
        session.execute(statment_airesponsetags)
        
        session.commit()
    
    except Exception as e:
        return {"message": "Failed to delete", "erro": str(e)}
    return {"message": f"Input successfully deleted: {tag}"}