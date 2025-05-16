import os
from io import BytesIO
from typing import Any
from fastapi import UploadFile
from langchain.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI

from sqlmodel.ext.asyncio.session import AsyncSession
from ..database.models import Documents
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
        self.upload_dir = "./documents/uploads"
        os.makedirs(self.upload_dir, exist_ok=True)

    async def get_user_documents(self, user_id: str, db_session: AsyncSession):
        query = select(Documents).where(Documents.user_id == user_id)
        result = await db_session.exec(query)
        response = result.all()
        return response

    async def get_user_doc_count(self, user_id: str, db_session: AsyncSession) -> int:
        query = select(Documents).where(Documents.user_id == user_id)
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
            return "No relevant information found in the documents."
            
        extracted_texts = [
            match["metadata"].get("content", "") for match in answer["matches"]
            if match.get("metadata") and match["metadata"].get("content")]
        
        
        if not extracted_texts:
            return "No readable content found in the matched documents."
            
        return "\n\n".join(extracted_texts)
    
    async def query_llm(self, retrieved_text: str, user_query: str): 
        PROMPT_TEMPLATE = """
        You are an AI assistant designed to answer questions about a specific person, based on the documents and data they've provided.

        Speak in a professional, third-person tone — for example: "They are currently pursuing a Master's degree..." or "This person has worked on...".

        Use the context below to answer the user's question truthfully. If the context does not contain enough information, politely say so. Do not guess or make up information.

        You can infer lightly based on what is available, but always prioritize accuracy. Be friendly and clear in your tone.

        ---

        Context:
        {context}

        User's Question:
        {question}

        Answer:
        """

        # Create the prompt template
        prompt_template = ChatPromptTemplate.from_template(PROMPT_TEMPLATE)

        # Format as list of messages
        messages = prompt_template.format_messages(
            context=retrieved_text,
            question=user_query
        )

        model = ChatOpenAI(model="gpt-3.5-turbo", temperature=0.7)

        response = model.invoke(messages)
        return response.content
    
    async def check_namespace_exists(self, namespace: str) -> bool:
        return await check_namespace_exists(namespace)