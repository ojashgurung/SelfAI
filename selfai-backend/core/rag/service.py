import os
from io import BytesIO
from typing import Any
from fastapi import UploadFile

from sqlmodel.ext.asyncio.session import AsyncSession
from graph.models.documents import Document
from sqlmodel import select

from .utils import (
    clean_text,
    split_document,
    extract_text_from_docx,
    extract_text_from_pdf,
    extract_text_from_md_html,
    get_embedding,
    query_embedding
)

from ..vector_store.vector_db import (
    get_query_pinecone,
    upsert_to_pinecone,
    check_namespace_exists
) 

from ..errors import UnsupportedFileType


class RagService:
    def __init__(self):
        self.upload_dir = "./Document/uploads"
        os.makedirs(self.upload_dir, exist_ok=True)

    async def get_user_Document(self, user_id: str, db_session: AsyncSession):
        query = select(Document).where(Document.user_id == user_id)
        result = await db_session.exec(query)
        response = result.all()
        return response

    async def get_user_doc_count(self, user_id: str, db_session: AsyncSession) -> int:
        query = select(Document).where(Document.user_id == user_id)
        result = await db_session.exec(query)
        response = result.all()
        return len(response)

    async def save_and_extract_text(self, file: UploadFile, user_id: str) -> dict:
        allowed_extension = ['.pdf','.docx', '.html','.md']
        if not file or not file.filename:
            return {}

        file_extension = os.path.splitext(file.filename)[1].lower()

        if file_extension not in allowed_extension:
            raise UnsupportedFileType()
        
        # Create user directory
        # user_dir = os.path.join(self.upload_dir, user_id)
        # os.makedirs(user_dir, exist_ok=True)

        # # # Save file permanently
        # secure_name = f"{uuid.uuid4().hex}_{file.filename}"
        # file_path = os.path.join(user_dir, secure_name)
        
        try:
            content = await file.read()
            
            # Create a temporary BytesIO object
            buffer = BytesIO(content)
        # async with aiofiles.open(file_path, 'wb') as out_file:
        #     await out_file.write(content)
        
            if file_extension == '.pdf':
                text = extract_text_from_pdf(buffer)
            elif file_extension == '.docx':
                text = extract_text_from_docx(buffer)
            elif file_extension in ['.md', '.html']:
                text = extract_text_from_md_html(buffer)
            else:
                raise UnsupportedFileType()
                

            result: dict = await self.clean_and_chunk_text(text, file.filename, file.content_type, user_id)
            result['file_path'] = "in_memory"
            result['original_filename'] = file.filename
            return result

        except Exception as e:
            raise e
            

    async def clean_and_chunk_text(self, text, file_name:str, file_type:str,  user_id: str) -> dict[str, Any]:
        document = clean_text(text)
        chunks = split_document(document, file_name, file_type, user_id)
        embeddings = get_embedding(chunks)
        # print(embeddings)
        return await upsert_to_pinecone(embeddings, user_id)
    
    async def handle_query(self, text: str, namespace: str):
        query_embeddings = query_embedding(text)
        
        return await get_query_pinecone(query_embeddings, namespace)
    
    async def handle_answer(self, answer):
        if not answer or not answer.get("matches"):
            return "No relevant information found in the Document."
            
        extracted_texts = [
            match["metadata"].get("content", "") for match in answer["matches"]
            if match.get("metadata") and match["metadata"].get("content")]
        
        
        if not extracted_texts:
            return "No readable content found in the matched Document."
            
        return "\n\n".join(extracted_texts)
    
    async def check_namespace_exists(self, namespace: str) -> bool:
        return await check_namespace_exists(namespace)