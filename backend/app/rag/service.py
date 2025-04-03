
import os
import uuid
from typing import Any
import shutil
import aiofiles
from fastapi import UploadFile
from langchain.prompts import ChatPromptTemplate
from langchain_ollama.llms import OllamaLLM

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

    async def save_and_extract_text(self, file: UploadFile, user_id: str) -> dict:
        allowed_extension = ['.pdf','.docx', '.html','.md']
        if not file or not file.filename:
            return {}

        file_extension = os.path.splitext(file.filename)[1].lower()

        if file_extension not in allowed_extension:
            raise UnsupportedFileType()
        
        # Create user directory
        user_dir = os.path.join(self.upload_dir, user_id)
        os.makedirs(user_dir, exist_ok=True)

        # # Save file permanently
        secure_name = f"{uuid.uuid4().hex}_{file.filename}"
        file_path = os.path.join(user_dir, secure_name)
        
        async with aiofiles.open(file_path, 'wb') as out_file:
            content = await file.read()
            await out_file.write(content)
        try:
            if file_extension == '.pdf':
                text = extract_text_from_pdf(file_path)
            elif file_extension == '.docx':
                text = extract_text_from_docx(file_path)
            elif file_extension in ['.md', '.html']:
                text = extract_text_from_md_html(file_path)
            else:
                raise UnsupportedFileType()
            

            result: dict = await self.clean_and_chunk_text(text, secure_name, file.content_type, user_id)
            result['file_path'] = file_path
            result['original_filename'] = file.filename
            return result

        except Exception as e:
            if os.path.exists(file_path):
                os.remove(file_path)
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
        extracted_texts = [
            match["metadata"].get("content", "") for match in answer["matches"]
        ]
        return "\n\n".join(extracted_texts)
    
    async def query_llm(self, retrieved_text: str, user_query: str): 
        PROMPT_TEMPLATE = f"""
            Use the following context to answer the user's question:

            Context:
            {retrieved_text}

            User Question:
            {user_query}

            Provide a concise and accurate response.
            """
        
        prompt_template = ChatPromptTemplate.from_template(PROMPT_TEMPLATE)
        prompt = prompt_template.format(context=retrieved_text, question=user_query)
        # print(prompt)

        model = OllamaLLM(model="mistral")
        response_text = model.invoke(prompt)
        return response_text

    
    async def check_namespace_exists(self, namespace: str) -> bool:
        return await check_namespace_exists(namespace)