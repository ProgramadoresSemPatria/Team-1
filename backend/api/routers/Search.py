from fastapi import APIRouter, File, UploadFile
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