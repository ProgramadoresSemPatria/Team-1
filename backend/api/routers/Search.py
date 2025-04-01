from fastapi import APIRouter, File, UploadFile, Body, Depends, Query, Path, Header, HTTPException, status
from typing import Annotated, Union
import pandas as pd
from sqlmodel import Session, select, text
from sqlalchemy import func, delete
from pydantic import BaseModel
from datetime import datetime
import os

import joblib
import uuid


from ..enum.TagsEnum import TagsEnum
from ..enum.DateOperator import DateOperator
from ml_model.preprocess import clear_text
from ..db import get_session
from ..db.AIResponse import AiResponse
from ..db.AIResponseTags import AiResponseTags
from api.utils.operators import convert_text_to_operator
from api.utils.query_helper import build_where_clause
from api.utils.token import decode_token
from .auth import o_auth_pass_bearer


router = APIRouter(
    prefix="/search",
    tags=[TagsEnum.search]
)

model = joblib.load('ml_model/model/modelo_sentimento.pkl') 
vectorizer = joblib.load('ml_model/model/vectorizer.pkl') 
session_dependency = Annotated[Session, Depends(get_session)]


@router.post('/input', status_code=status.HTTP_201_CREATED)
async def upload_file(file: Annotated[UploadFile, File()], session: session_dependency, token: Annotated[str, Depends(o_auth_pass_bearer)]):
    extension = os.path.splitext(file.filename)[1].lower()
    
    extension = str(extension)
    if (extension == ".csv"):
        df = pd.read_csv(file.file)
    elif (extension == ".xlsx"):
        df = pd.read_excel(file.file)
    else :
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Only '.csv' and '.xlsx' files available")
    try:
        today = datetime.now()
        

        df['Text'] = df['Text'].apply(clear_text)

        X = vectorizer.transform(df['Text'])
        df['Sentiment_Prediction'] = model.predict(X)
        df_table = df.copy()
        result = df[['Text', 'Sentiment_Prediction']].to_dict(orient='records')


        df_table.rename({"Text":"text", "Sentiment_Prediction":"sentiment_prediction"}, axis=1, inplace=True)
        df_table["consulted_query_date"] = today

        user = decode_token(token)
        user_id = str(user.get("id"))

        df_table["user_id"] = uuid.UUID(user_id)
        df_table["related_key"] = df_table["user_id"].astype(str) + df_table["consulted_query_date"].astype(str)
        df_table_dict = df_table.to_dict(orient='records')
        session.bulk_insert_mappings(AiResponse, df_table_dict)

        file_name = os.path.splitext(file.filename)[0]
        dict_tag_prediction = {
            "consulted_query_date" : today,
            "tag" : file_name,
            "user_id" : uuid.UUID(user_id),
            "related_key" : f"{str(user_id)}{str(today)}",
            "key" : f"{str(user_id)}{str(file_name)}"
        }
        dict_to_db = AiResponseTags.model_validate(dict_tag_prediction)
        session.add(dict_to_db)

    
        session.commit()
    except Exception as e :
        if "UNIQUE constraint failed: airesponsetags.key" in str(e):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Tag/Document name already analyzed. Please choose another or rename it")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
    
    session.refresh(dict_to_db)
    return {"message": "success", "sample": result}

@router.post('/find')
async def find_feedback(keywords:Annotated[list[str], Body()]):
    # ALL THE AI LOGIC HERE
    return {"message": "We are searching for feedbacks for you, please wait until finish!", "keywords": keywords}

@router.get('/input/group/', status_code=status.HTTP_200_OK)
def results_by_day(session: session_dependency, token: Annotated[str, Depends(o_auth_pass_bearer)]):
    try:
        user = decode_token(token.removeprefix("bearer ").removeprefix("Bearer "))
        user_id = str(user.get("id"))
        statment = f"""SELECT tag, sentiment_prediction, count(*)  FROM airesponse LEFT JOIN airesponsetags on airesponse.consulted_query_date = airesponsetags.consulted_query_date WHERE airesponse.user_id = '{user_id.replace('-', '')}' GROUP BY sentiment_prediction, tag """

        results = session.execute(text(statment)).all()

        to_return = [
            {"tag": result[0], "sentiment": result[1], "count": result[2]}
            for result in results
        ]
        return to_return
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@router.get('/input/distinct_tag', status_code=status.HTTP_200_OK)
def distinct_tag(session: session_dependency, token: Annotated[str, Depends(o_auth_pass_bearer)]):
    try :
        user = decode_token(token)
        user_id = str(user.get("id"))
        result = session.execute(text(f"SELECT DISTINCT tag FROM AiResponseTags WHERE user_id='{user_id.replace('-', '')}'"))
        return [i[0] for i in result.all()]
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@router.post('/input/filter/', status_code=status.HTTP_200_OK)
def filter_inputted(
    session: session_dependency, 
    token: Annotated[str, Depends(o_auth_pass_bearer)],
    tags: Annotated[dict[str,list[str]] | None, Body()] = None,
    sentiment:Annotated[Union[str, None], Query(regex="^(positivo|negativo|neutro)$", )] = None, 
    items_per_page:Annotated[int, Query()] = 10, 
    page:Annotated[int, Query()] = 1,
    date:Annotated[str | None, Query()] = None, 
    date_operator:Annotated[DateOperator | None, Query()] = None, 
    ):
    user = decode_token(token)
    user_id = str(user.get("id"))

    if (date and not date_operator) or (date_operator and not date) :
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Please provide operator and data to filter - operators: [gte, gt, e, lt, lte]")


    filters = {}
    if date and date_operator:
        filters["airesponse.consulted_query_date"] = {"operator": date_operator.value, "value": date}
    if sentiment:
        filters["sentiment_prediction"] = [sentiment]
    if tags:
        tags_dict_key = list(tags.keys())[0]
        filters['tag'] = tags[tags_dict_key]
    filters['airesponse.user_id'] = [user_id.replace('-', '')]

    where_clause = build_where_clause(**filters)
    
    statment = f"SELECT airesponse.consulted_query_date, airesponse.sentiment_prediction, airesponse.text, airesponsetags.tag FROM airesponse LEFT JOIN airesponsetags on airesponse.consulted_query_date = airesponsetags.consulted_query_date {where_clause if where_clause else ''}"

    try:
        results = session.execute(text(statment)).all()
        to_return = [
        {"date": result[0], "sentiment": result[1], "text": result[2], "tag" : result[3]}
        for result in results[(page-1)*items_per_page:page*items_per_page]
        ]
        return to_return
    except Exception as e:
        print(e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@router.delete('/input/delete/{tag}', status_code=status.HTTP_204_NO_CONTENT)
def delete_response(session:session_dependency, tag:Annotated[str, Path()], token: Annotated[str, Depends(o_auth_pass_bearer)]):
    try :
        user = decode_token(token)
        user_id = user.get("id")

        statment_airesponsetags = select(AiResponseTags.related_key).where(AiResponseTags.tag == tag).where(AiResponseTags.user_id == uuid.UUID(user_id))

        related_key = session.execute(statment_airesponsetags).one()[0]

        statment_airesponse = delete(AiResponse).where(AiResponse.related_key == related_key)
        statment_airesponsetags = delete(AiResponseTags).where(AiResponseTags.related_key == related_key)
        session.execute(statment_airesponse)
        session.execute(statment_airesponsetags)
        
        session.commit()
    
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))