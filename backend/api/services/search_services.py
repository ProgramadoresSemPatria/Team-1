from datetime import datetime
from fastapi import HTTPException
import joblib
import pandas as pd
from pathlib import Path
from sqlmodel import Session, select, text, delete
import uuid

from api.db.AIResponse import AiResponse
from api.db.AIResponseTags import AiResponseTags
from api.enum.DateOperator import DateOperator
from api.utils.exception_handler import handle_exception
from api.utils.ml_loader import sentiment_model as model, text_vectorizer as vectorizer
from api.utils.query_helper import build_where_clause
from api.utils.token import decode_token
from ml_model.preprocess import clear_text

# Get the absolute path to the model files
BASE_DIR = Path(__file__).resolve().parent.parent.parent
MODEL_PATH = BASE_DIR / "ml_model" / "model"

# Load models
model = joblib.load(MODEL_PATH / "modelo_sentimento.pkl")
vectorizer = joblib.load(MODEL_PATH / "vectorizer.pkl")

def upload_file(file, session: Session, token: str):
    """Upload and process a file with feedback data for sentiment analysis.
    
    Args:
        file: The uploaded file object
        session: Database session
        token: Authentication token
        
    Returns:
        dict: Response with success message and sample of the processed data
    """
    extension = file.filename.split('.')[-1].lower()
    filename = file.filename.split('.')[0].lower()
    
    if extension not in ["csv", "xlsx"]:
        raise HTTPException(status_code=400, detail="Only '.csv' and '.xlsx' files available")
    
    all_files = session.exec(select(AiResponseTags.tag)).all()
    if filename in all_files:
        raise HTTPException(status_code=400, detail="Tag/Document name already analyzed. Please choose another or rename it")
    
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
        handle_exception(e)

    session.refresh(dict_to_db)
    return {"message": "success", "sample": df[['Text', 'Sentiment_Prediction']].to_dict(orient='records')}

def find_feedback(keywords: list[str]):
    """Search for feedback based on keywords.
    
    Args:
        keywords: List of keywords to search for
        
    Returns:
        dict: Message and keywords
    """
    # Implement search logic here
    return {"message": "We are searching for feedbacks for you, please wait until finish!", "keywords": keywords}

def results_by_day(session: Session, token: str):
    """Get sentiment analysis results grouped by day and tag.
    
    Args:
        session: Database session
        token: Authentication token
        
    Returns:
        list: Results grouped by tag and sentiment
    """
    try:
        user = decode_token(token)
        user_id = str(user.get("id"))
        
        # Fix SQL Injection: Use parameterized query
        query = """
            SELECT tag, sentiment_prediction, count(*) 
            FROM airesponse 
            LEFT JOIN airesponsetags ON airesponse.consulted_query_date = airesponsetags.consulted_query_date 
            WHERE airesponse.user_id = :user_id
            GROUP BY sentiment_prediction, tag
        """
        
        results = session.execute(
            text(query), 
            {"user_id": user_id.replace('-', '')}
        ).all()

        return [
            {"tag": result[0], "sentiment": result[1], "count": result[2]}
            for result in results
        ]
    except Exception as e:
        handle_exception(e)

def distinct_tag(session: Session, token: str):
    """Get distinct tags for a user.
    
    Args:
        session: Database session
        token: Authentication token
        
    Returns:
        list: Distinct tags
    """
    try:
        user = decode_token(token)
        user_id = str(user.get("id"))
        
        # Fix SQL Injection: Use parameterized query
        query = "SELECT DISTINCT tag FROM AiResponseTags WHERE user_id = :user_id"
        result = session.execute(text(query), {"user_id": user_id.replace('-', '')})
        
        return [i[0] for i in result.all()]
    except Exception as e:
        handle_exception(e)

def filter_inputted(session: Session, token: str, tags: dict, sentiment: str, items_per_page: int, page: int, date: str, date_operator: DateOperator):
    """Filter AI responses based on various criteria.
    
    Args:
        session: Database session
        token: Authentication token
        tags: Tags to filter by
        sentiment: Sentiment to filter by
        items_per_page: Number of items per page
        page: Page number
        date: Date to filter by
        date_operator: Date operator (gt, lt, eq, etc.)
        
    Returns:
        list: Filtered results
    """
    try:
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
        
        query = f"""
            SELECT 
                airesponse.consulted_query_date, 
                airesponse.sentiment_prediction, 
                airesponse.text, 
                airesponsetags.tag 
            FROM airesponse 
            LEFT JOIN airesponsetags ON airesponse.consulted_query_date = airesponsetags.consulted_query_date 
            {where_clause if where_clause else ''}
        """

        results = session.execute(text(query)).all()
        
        # Handle pagination in Python - note that for large datasets, this should be done in SQL
        paginated_results = results[(page-1)*items_per_page:page*items_per_page]
        
        return [
            {"date": result[0], "sentiment": result[1], "text": result[2], "tag": result[3]}
            for result in paginated_results
        ]
    except Exception as e:
        handle_exception(e)

def delete_response(session: Session, tag: str, token: str):
    """Delete responses associated with a tag.
    
    Args:
        session: Database session
        tag: Tag to delete
        token: Authentication token
    """
    try:
        user = decode_token(token)
        user_id = user.get("id")

        # Use SQLModel/SQLAlchemy properly for safer queries
        statement_airesponsetags = select(AiResponseTags.related_key).where(
            AiResponseTags.tag == tag,
            AiResponseTags.user_id == uuid.UUID(user_id)
        )
        
        result = session.execute(statement_airesponsetags).one_or_none()
        if not result:
            raise HTTPException(status_code=404, detail="Tag not found")
            
        related_key = result[0]

        # Use ORM methods for delete operations
        statement_airesponse = delete(AiResponse).where(AiResponse.related_key == related_key)
        statement_airesponsetags = delete(AiResponseTags).where(AiResponseTags.related_key == related_key)
        
        session.execute(statement_airesponse)
        session.execute(statement_airesponsetags)
        session.commit()
        
        return {"message": "Responses deleted successfully"}
    except Exception as e:
        handle_exception(e)
