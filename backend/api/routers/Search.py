from fastapi import APIRouter, File, UploadFile, Body, Depends, Query, Path, HTTPException, status
from typing import Annotated, Union
from sqlmodel import Session
from ..db import get_session
from ..enum.TagsEnum import TagsEnum
from ..enum.DateOperator import DateOperator
from ..services.search_services import upload_file, find_feedback, results_by_day, distinct_tag, filter_inputted, delete_response  # Atualização da importação
from .auth import o_auth_pass_bearer

router = APIRouter(
    prefix="/search",
    tags=[TagsEnum.search]
)

session_dependency = Annotated[Session, Depends(get_session)]

@router.post('/input', status_code=status.HTTP_201_CREATED)
async def upload_file_route(file: Annotated[UploadFile, File()], session: session_dependency, token: Annotated[str, Depends(o_auth_pass_bearer)]):
    return upload_file(file, session, token)

@router.post('/find')
async def find_feedback_route(keywords: Annotated[list[str], Body()]):
    return find_feedback(keywords)

@router.get('/input/group/', status_code=status.HTTP_200_OK)
def results_by_day_route(session: session_dependency, token: Annotated[str, Depends(o_auth_pass_bearer)]):
    return results_by_day(session, token)

@router.get('/input/distinct_tag', status_code=status.HTTP_200_OK)
def distinct_tag_route(session: session_dependency, token: Annotated[str, Depends(o_auth_pass_bearer)]):
    return distinct_tag(session, token)

@router.post('/input/filter/', status_code=status.HTTP_200_OK)
def filter_inputted_route(
    session: session_dependency, 
    token: Annotated[str, Depends(o_auth_pass_bearer)],
    tags: Annotated[dict[str,list[str]] | None, Body()] = None,
    sentiment:Annotated[Union[str, None], Query(regex="^(positivo|negativo|neutro)$", )] = None, 
    items_per_page:Annotated[int, Query()] = 10, 
    page:Annotated[int, Query()] = 1,
    date:Annotated[str | None, Query()] = None, 
    date_operator:Annotated[DateOperator | None, Query()] = None, 
):
    return filter_inputted(session, token, tags, sentiment, items_per_page, page, date, date_operator)

@router.delete('/input/delete/{tag}', status_code=status.HTTP_204_NO_CONTENT)
def delete_response_route(session: session_dependency, tag: Annotated[str, Path()], token: Annotated[str, Depends(o_auth_pass_bearer)]):
    return delete_response(session, tag, token)