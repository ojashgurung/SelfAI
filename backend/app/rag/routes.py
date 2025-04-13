from typing import Optional
from fastapi import APIRouter, Depends, status, UploadFile, File, HTTPException
from sqlmodel.ext.asyncio.session import AsyncSession
from ..database.models import Documents, ChatSessions, ChatMessages
from ..database.db import get_session
from ..errors import NoSourceProvided
from .service import RagService
from ..chat.service import ChatService
from ..auth.dependencies import AccessTokenBearer
from sqlmodel import select, delete

from ..vector_store.vector_db import (
    delete_vectors
) 

from ..chat.schemas import (
    ChatSessionCreate
)

rag_router = APIRouter()
rag_service = RagService()
chat_service = ChatService()
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
        result = await session.exec(query)
        documents = result.all()

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

def convert_size(size_bytes) -> str:
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

        if not file or not file.filename:
            raise NoSourceProvided()

        file_size = convert_size(file.size)
        result = await rag_service.save_and_extract_text(file, user_id)

        if not result or result.get("status") == "error":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to process the uploaded file"
            )

        try:
            master_session = await session.exec(
                select(ChatSessions).where(
                    ChatSessions.user_id == user_id,
                    ChatSessions.namespace == result["namespace"],
                    ChatSessions.title == "Owner",
                )
            )
            existing_session = master_session.first()

            if not existing_session:
                session_data = ChatSessionCreate(
                    namespace=result["namespace"],
                    title="Owner",
                    is_public=True
                )
                await chat_service.create_session(
                    session_data=session_data,
                    current_user=current_user,
                    rag_service=rag_service,
                    db_session=session
                )
                await session.commit() 
                
            document = Documents(
                user_id=user_id,
                file_name=file.filename,
                file_size=file_size,
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
        except Exception as db_error:
            await session.rollback()
            print(f"Database error during upload: {db_error}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Database error: {str(db_error)}"
            )

    except HTTPException:
        raise
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
        print("User ID:", user_id)

        query = select(Documents).where(Documents.id == document_id, Documents.user_id == user_id)
        result = await session.exec(query)
        document = result.first()
        print("Document found:", document)
       
        if not document:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Document not found or you don't have permission to delete it"
            )
        print("Vector IDs:", document.vector_ids)
        print("Namespace:", document.namespace)

        try:
            await delete_vectors(document.vector_ids, document.namespace)
        except Exception as vector_error:
            print(f"Error deleting vectors: {vector_error}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to delete vectors: {str(vector_error)}"
            )
        print("Vectors deleted")    

        try:
            # Delete document and related data
            await session.delete(document)

            # Check for remaining documents
            result = await session.exec(
                select(Documents).where(Documents.user_id == user_id)
            )
            remaining_docs = result.all()

            if not remaining_docs:
                # Delete related sessions and messages
                owned_sessions = await session.exec(
                    select(ChatSessions.id).where(ChatSessions.user_id == user_id)
                )
                owned_sessions_ids = owned_sessions.all()

                if owned_sessions_ids:
                    session_ids = [str(sid) for sid in owned_sessions_ids]

                    await session.exec(
                        delete(ChatMessages).where(ChatMessages.session_id.in_(session_ids))
                    )
                    await session.exec(
                        delete(ChatSessions).where(ChatSessions.id.in_(session_ids))
                    )

            await session.commit()
            
            return {
                "message": "Document and associated vectors deleted successfully",
                "document_id": document_id
            }
        
        except Exception as db_error:
            await session.rollback()
            print(f"Database error: {db_error}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Database error: {str(db_error)}"
            )

    except HTTPException:
        raise
    except Exception as e:
        await session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete vectors: {str(e)}"
        )