from fastapi import APIRouter, File, UploadFile, Body, Depends, Query, Path, HTTPException, status, Response
from typing import Annotated, Union, Dict, List, Any, Optional
from sqlmodel import Session
from pydantic import BaseModel

from api.db import get_session
from api.enum.TagsEnum import TagsEnum
from api.enum.DateOperator import DateOperator
from api.routers.auth import o_auth_pass_bearer
from api.services.search_services import upload_file, find_feedback, results_by_day, distinct_tag, filter_inputted, delete_response
from api.utils.exception_handler import handle_exception
from api.utils.response_helper import create_success_response, create_paginated_response

# Response models
class UploadResponse(BaseModel):
    message: str
    sample: List[Dict[str, Any]]

class SearchResponse(BaseModel):
    message: str
    keywords: List[str]

class TagListResponse(BaseModel):
    data: List[str]

class ResultsByDayResponse(BaseModel):
    data: List[Dict[str, Any]]

class FilteredFeedbackResponse(BaseModel):
    data: List[Dict[str, Any]]
    pagination: Dict[str, int]
    status: str
    status_code: int

router = APIRouter(
    prefix="/search",
    tags=[TagsEnum.search]
)

session_dependency = Annotated[Session, Depends(get_session)]

@router.post(
    '/input', 
    response_model=UploadResponse, 
    status_code=status.HTTP_201_CREATED,
    summary="Upload feedback file",
    description="Uploads a CSV or Excel file containing feedback data for sentiment analysis"
)
async def upload_file_route(
    file: Annotated[UploadFile, File(description="CSV or Excel file with feedback data")], 
    session: session_dependency, 
    token: Annotated[str, Depends(o_auth_pass_bearer)]
):
    try:
        result = upload_file(file, session, token)
        return result
    except Exception as e:
        handle_exception(e)

@router.post(
    '/find',
    response_model=SearchResponse,
    status_code=status.HTTP_200_OK,
    summary="Find feedback by keywords",
    description="Searches for feedback data matching the provided keywords"
)
async def find_feedback_route(
    keywords: Annotated[List[str], Body(description="List of keywords to search for")]
):
    try:
        result = find_feedback(keywords)
        return result
    except Exception as e:
        handle_exception(e)

@router.get(
    '/input/group/', 
    response_model=ResultsByDayResponse, 
    status_code=status.HTTP_200_OK,
    summary="Group results by day",
    description="Retrieves feedback analysis results grouped by day and sentiment"
)
def results_by_day_route(
    session: session_dependency, 
    token: Annotated[str, Depends(o_auth_pass_bearer)]
):
    try:
        results = results_by_day(session, token)
        return create_success_response(data=results)
    except Exception as e:
        handle_exception(e)

@router.get(
    '/input/distinct_tag', 
    response_model=TagListResponse, 
    status_code=status.HTTP_200_OK,
    summary="Get distinct tags",
    description="Retrieves all distinct tags associated with the user's feedback data"
)
def distinct_tag_route(
    session: session_dependency, 
    token: Annotated[str, Depends(o_auth_pass_bearer)]
):
    try:
        tags = distinct_tag(session, token)
        return create_success_response(data=tags)
    except Exception as e:
        handle_exception(e)

@router.post(
    '/input/filter/', 
    response_model=FilteredFeedbackResponse, 
    status_code=status.HTTP_200_OK,
    summary="Filter feedback data",
    description="Filters feedback data based on various criteria such as tags, sentiment, and date"
)
def filter_inputted_route(
    session: session_dependency, 
    token: Annotated[str, Depends(o_auth_pass_bearer)],
    tags: Annotated[Dict[str, List[str]] | None, Body(description="Tags to filter by")] = None,
    sentiment: Annotated[
        Union[str, None], 
        Query(regex="^(positivo|negativo|neutro)$", description="Sentiment to filter by (positive, negative, or neutral)")
    ] = None, 
    items_per_page: Annotated[int, Query(description="Number of items per page")] = 10, 
    page: Annotated[int, Query(description="Page number")] = 1,
    date: Annotated[str | None, Query(description="Date to filter by (format: YYYY-MM-DD)")] = None, 
    date_operator: Annotated[DateOperator | None, Query(description="Date operator (gt, lt, eq, etc.)")] = None, 
):
    try:
        results = filter_inputted(
            session=session,
            token=token,
            tags=tags,
            sentiment=sentiment,
            items_per_page=items_per_page,
            page=page,
            date=date,
            date_operator=date_operator
        )
        
        # For this endpoint, the pagination is handled in the service layer,
        # so we need to add pagination info to the response
        return create_paginated_response(
            items=results,
            total=len(results),  # This is not ideal, but without a count query from the service layer, it's the best we can do
            page=page,
            items_per_page=items_per_page
        )
    except Exception as e:
        handle_exception(e)

@router.delete(
    '/input/delete/{tag}', 
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete feedback by tag",
    description="Deletes all feedback data associated with the specified tag"
)
def delete_response_route(
    session: session_dependency, 
    tag: Annotated[str, Path(description="Tag to delete")], 
    token: Annotated[str, Depends(o_auth_pass_bearer)]
):
    try:
        delete_response(session, tag, token)
        return Response(status_code=status.HTTP_204_NO_CONTENT)
    except Exception as e:
        handle_exception(e)