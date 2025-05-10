import joblib
import pandas as pd
import uuid
from datetime import datetime
from fastapi import HTTPException
from sqlmodel import Session, select, text, delete
from ..db.AIResponse import AiResponse
from ..db.AIResponseTags import AiResponseTags
from api.utils.token import decode_token
from api.utils.query_helper import build_where_clause
from api.enum.DateOperator import DateOperator
from ml_model.preprocess import clear_text
# Load models
model = joblib.load('ml_model/model/modelo_sentimento.pkl') 
vectorizer = joblib.load('ml_model/model/vectorizer.pkl') 

def upload_file(file, session: Session, token: str):
    extension = file.filename.split('.')[-1].lower()
    
    if extension not in ["csv", "xlsx"]:
        raise HTTPException(status_code=400, detail="Only '.csv' and '.xlsx' files available")
    
    try:
        if extension == "csv":
            df = pd.read_csv(file.file)
        else:
            df = pd.read_excel(file.file)

        today = datetime.now()
        df['Text'] = df['Text'].apply(clear_text)
        X = vectorizer.transform(df['Text'])
        df['Sentiment_Prediction'] = model.predict(X)

        df_table = df.copy()
        df_table.rename({"Text": "text", "Sentiment_Prediction": "sentiment_prediction"}, axis=1, inplace=True)
        df_table["consulted_query_date"] = today

        user = decode_token(token)
        user_id = str(user.get("id"))
        df_table["user_id"] = uuid.UUID(user_id)
        df_table["related_key"] = df_table["user_id"].astype(str) + df_table["consulted_query_date"].astype(str)
        df_table_dict = df_table.to_dict(orient='records')
        session.bulk_insert_mappings(AiResponse, df_table_dict)

        file_name = file.filename.split('.')[0]
        dict_tag_prediction = {
            "consulted_query_date": today,
            "tag": file_name,
            "user_id": uuid.UUID(user_id),
            "related_key": f"{str(user_id)}{str(today)}",
            "key": f"{str(user_id)}{str(file_name)}"
        }
        dict_to_db = AiResponseTags.model_validate(dict_tag_prediction)
        session.add(dict_to_db)
        session.commit()
    except Exception as e:
        for error in ["UNIQUE constraint failed", "restrição de unicidade"]:
            if error in str(e).lower():
                raise HTTPException(status_code=400, detail="Tag/Document name already analyzed. Please choose another or rename it")
        raise HTTPException(status_code=500, detail=str(e))

    session.refresh(dict_to_db)
    return {"message": "success", "sample": df[['Text', 'Sentiment_Prediction']].to_dict(orient='records')}

def find_feedback(keywords: list[str]):
    # Implementar lógica de busca aqui
    return {"message": "We are searching for feedbacks for you, please wait until finish!", "keywords": keywords}

def results_by_day(session: Session, token: str):
    try:
        user = decode_token(token.removeprefix("bearer ").removeprefix("Bearer "))
        user_id = str(user.get("id"))
        statement = f"""SELECT tag, sentiment_prediction, count(*) FROM airesponse 
                        LEFT JOIN airesponsetags ON airesponse.consulted_query_date = airesponsetags.consulted_query_date 
                        WHERE airesponse.user_id = '{user_id.replace('-', '')}' 
                        GROUP BY sentiment_prediction, tag"""

        results = session.execute(text(statement)).all()

        return [
            {"tag": result[0], "sentiment": result[1], "count": result[2]}
            for result in results
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def distinct_tag(session: Session, token: str):
    try:
        user = decode_token(token)
        user_id = str(user.get("id"))
        result = session.execute(text(f"SELECT DISTINCT tag FROM AiResponseTags WHERE user_id='{user_id.replace('-', '')}'"))
        return [i[0] for i in result.all()]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def filter_inputted(session: Session, token: str, tags: dict, sentiment: str, items_per_page: int, page: int, date: str, date_operator: DateOperator):
    user = decode_token(token)
    user_id = str(user.get("id"))

    if (date and not date_operator) or (date_operator and not date):
        raise HTTPException(status_code=400, detail="Please provide operator and date to filter - operators: [gte, gt, e, lt, lte]")

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
    
    statement = f"""SELECT airesponse.consulted_query_date, airesponse.sentiment_prediction, airesponse.text, airesponsetags.tag 
                     FROM airesponse 
                     LEFT JOIN airesponsetags ON airesponse.consulted_query_date = airesponsetags.consulted_query_date 
                     {where_clause if where_clause else ''}"""

    try:
        results = session.execute(text(statement)).all()
        return [
            {"date": result[0], "sentiment": result[1], "text": result[2], "tag" : result[3]}
            for result in results[(page-1)*items_per_page:page*items_per_page]
            ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def delete_response(session: Session, tag: str, token: str):
    try:
        user = decode_token(token)
        user_id = user.get("id")

        statement_airesponsetags = select(AiResponseTags.related_key).where(AiResponseTags.tag == tag).where(AiResponseTags.user_id == uuid.UUID(user_id))
        related_key = session.execute(statement_airesponsetags).one()[0]

        statement_airesponse = delete(AiResponse).where(AiResponse.related_key == related_key)
        statement_airesponsetags = delete(AiResponseTags).where(AiResponseTags.related_key == related_key)
        session.execute(statement_airesponse)
        session.execute(statement_airesponsetags)
        
        session.commit()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
