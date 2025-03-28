from fastapi import APIRouter, File, UploadFile, Body
from typing import Annotated
import pandas as pd

import joblib

from ..enum.TagsEnum import TagsEnum
from ml_model.preprocess import clear_text

router = APIRouter(
    prefix="/search",
    tags=[TagsEnum.search]
)

model = joblib.load('ml_model/model/modelo_sentimento.pkl') 
vectorizer = joblib.load('ml_model/model/vectorizer.pkl') 

@router.post('/input')
async def upload_file(file: Annotated[UploadFile, File()]):
    df = pd.read_csv(file.file)

    df['Text'] = df['Text'].apply(clear_text)

    X = vectorizer.transform(df['Text'])
    df['Sentiment_Prediction'] = model.predict(X)
    result = df[['Text', 'Sentiment_Prediction']].to_dict(orient='records')

    return result

@router.post('/find')
async def find_feedback(keywords:Annotated[list[str], Body()]):
    # ALL THE AI LOGIC HERE
    return {"message": "We are searching for feedbacks for you, please wait until finish!", "keywords": keywords}