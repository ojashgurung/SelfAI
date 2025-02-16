import uuid
from typing import Optional

from fastapi import APIRouter, Depends, status, UploadFile, File
from sqlmodel.ext.asyncio.session import AsyncSession

from ..database.db import get_session
from ..errors import NoSourceProvided
from .service import RagService
from ..auth.dependencies import TokenBearer

from pydantic import Field

from .utils import (
    clean_text
)

from .schemas import (
    UploadFileRequest,
    TestFileRequest
)

rag_router = APIRouter()
rag_service = RagService()
access_token_bearer = TokenBearer()

@rag_router.post("/upload-test", status_code=status.HTTP_201_CREATED)
async def upload(
    file: UploadFile = File(...),
    current_user: dict = Depends(access_token_bearer)
): 
    user_id = current_user
    if not file and not text:
        raise NoSourceProvided()

    if file:
        # If file is provided, extract text from it
        text = await rag_service.save_and_extract_text(file)

    elif text:
        # If only text is provided, clean it directly
        text = clean_text(text)


    return {
        "message": "Extracted Text.", 
        "text": text,
        "current_user_id" : user_id
    } 

@rag_router.post("/upload-doc", status_code=status.HTTP_201_CREATED)
async def upload(
    document: UploadFileRequest, 
    session: AsyncSession = Depends(get_session),
    current_user: dict = Depends(access_token_bearer)
): 
    file = document.file
    text = document.text

    user_uuid = current_user.get("uuid")
    
    if not file and not text:
        raise NoSourceProvided()

    if file:
        # If file is provided, extract text from it
        text = await rag_service.save_and_extract_text(file)

    elif text:
        # If only text is provided, clean it directly
        text = clean_text(text)

    # vector_db_id = await process_vectorize(user_uuid, file, text, session)



    return {
        "message": "File uploaded successfully.", 
        "vector_db_id": text
    }