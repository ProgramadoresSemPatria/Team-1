from fastapi import APIRouter, File, UploadFile, Body
from typing import Annotated

from ..enum.TagsEnum import TagsEnum

router = APIRouter(
    prefix="/search",
    tags=[TagsEnum.search]
)

@router.post('/input')
async def upload_file(file: Annotated[UploadFile, File()]):
    # ALL THE AI LOGIC HERE
    return {"Message":f"{file.filename} is under evalluation, please wait until finish!\nWe will let you know once finished"}

@router.post('/find')
async def find_feedback(keywords:Annotated[list[str], Body()]):
    # ALL THE AI LOGIC HERE
    return {"message": "We are searching for feedbacks for you, please wait until finish!", "keywords": keywords}