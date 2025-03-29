from typing import Optional
from fastapi import APIRouter, Depends, status, UploadFile, File, HTTPException
from sqlmodel.ext.asyncio.session import AsyncSession
from ..database.models import Documents
from ..database.db import get_session
from ..errors import NoSourceProvided, NoQueryProvided
from .service import RagService
from ..auth.dependencies import AccessTokenBearer
from sqlmodel import select

from ..vector_store.vector_db import (
    delete_vectors
) 

from .schemas import (
    QueryRequest
)

rag_router = APIRouter()
rag_service = RagService()
access_token_bearer = AccessTokenBearer()


@rag_router.get("/documents", status_code=status.HTTP_200_OK)
async def get_user_documents(
    current_user: dict = Depends(access_token_bearer),
    session: AsyncSession = Depends(get_session),
):
    try:
        user_id = current_user["user"]["id"]
        
        # Query documents for the current user
        query = select(Documents).where(Documents.user_id == user_id)
        result = await session.execute(query)
        documents = result.scalars().all()

        return {
            "message": "Documents retrieved successfully",
            "documents": [
                {
                    "id": doc.id,
                    "filename": doc.file_name,
                    "filesize": doc.file_size,
                    "created_at": doc.created_at,
                    "namespace": doc.namespace,
                    "vector_ids": doc.vector_ids
                }
                for doc in documents
            ]
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

def convert_size(size_bytes: int) -> str:
    """Convert bytes to human readable format"""
    for unit in ['B', 'KB', 'MB', 'GB']:
        if size_bytes < 1024.0:
            return f"{size_bytes:.2f} {unit}"
        size_bytes /= 1024.0
    return f"{size_bytes:.2f} TB"


@rag_router.post("/upload-document", status_code=status.HTTP_201_CREATED)
async def upload(
    file: Optional[UploadFile] = File(...),
    current_user: dict = Depends(access_token_bearer),
    session: AsyncSession = Depends(get_session),
): 
    try:
        user_id = current_user["user"]["id"]

        if not file:
            raise NoSourceProvided()
        result = await rag_service.save_and_extract_text(file, user_id)
        file_size = convert_size(file.size)
        # Store document metadata in database
        document = Documents(
            user_id=user_id,
            file_name=file.filename,
            file_size = file_size,
            file_path=result["file_path"],
            vector_ids=result["inserted_ids"],
            namespace=result["namespace"],
        )
        session.add(document)
        await session.commit()

        return {
            "message": "File uploaded and trained successfully",
            "document": {
                "filename": file.filename,
                "filesize" : file_size,
                "vector_ids": result["inserted_ids"],
                "namespace": result["namespace"]
            }
        }
    except Exception as e:
        await session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@rag_router.delete("/documents/{document_id}", status_code=status.HTTP_200_OK)
async def delete_document(
    document_id: str,
    current_user: dict = Depends(access_token_bearer),
    session: AsyncSession = Depends(get_session),
):
    try:
        user_id = current_user["user"]["id"]
        
        # Find the document and verify ownership
        query = select(Documents).where(Documents.id == document_id, Documents.user_id == user_id)
        result = await session.execute(query)
        document = result.scalar_one_or_none()
       
        if not document:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Document not found or you don't have permission to delete it"
            )

        # Delete vectors from Pinecone
        await delete_vectors(document.vector_ids, document.namespace)
        
        # Delete document from database
        await session.delete(document)
        await session.commit()

        return {
            "message": "Document and associated vectors deleted successfully",
            "document_id": document_id
        }
    except Exception as e:
        await session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@rag_router.post("/query", status_code=status.HTTP_201_CREATED)
async def query_rag(
    query: QueryRequest,
    current_user: dict = Depends(access_token_bearer)
    # Later: Upload Chat history in Postgresql DB
): 
    user_id = current_user["user"]["id"]
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