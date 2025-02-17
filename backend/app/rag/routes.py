from typing import Optional

from fastapi import APIRouter, Depends, status, UploadFile, File

from ..database.db import get_session
from ..errors import NoSourceProvided, NoQueryProvided
from .service import RagService
from ..auth.dependencies import AccessTokenBearer


from .schemas import (
    QueryRequest
)

rag_router = APIRouter()
rag_service = RagService()
access_token_bearer = AccessTokenBearer()

@rag_router.post("/upload-document", status_code=status.HTTP_201_CREATED)
async def upload(
    file: Optional[UploadFile] = File(...),
    current_user: dict = Depends(access_token_bearer)
): 
    user_id = current_user["user"]["user_uid"]
    if not file:
        raise NoSourceProvided()

    if file:
        # If file is provided, extract text from it
        result = await rag_service.save_and_extract_text(file, user_id)

    return {
        "message": "File uploaded successfully.", 
        "vector_ids": result["inserted_ids"],
        "namespace" : result["namespace"]
    } 


@rag_router.post("/query", status_code=status.HTTP_201_CREATED)
async def query_rag(
    query: QueryRequest,
    current_user: dict = Depends(access_token_bearer)
    # TODO: Upload Chat history in Postgresql DB
): 
    user_id = current_user["user"]["user_uid"]
    user_query = query.question
    
    if not user_query:
        raise NoQueryProvided()
    
    if user_query:
        response = await rag_service.handle_query(user_query, user_id)

        if response:
            retrieve_text = await rag_service.handle_answer(response)
            answer = await rag_service.query_llm(retrieve_text, user_query)

    return {
        "message": "Response back successfully", 
        "response" : answer
    } 