import uuid
import os
import shutil
from datetime import datetime

from fastapi import UploadFile, Depends
from fastapi.security import OAuth2PasswordBearer
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession

from .utils import (
    clean_text,
    extract_text_from_docx,
    extract_text_from_pdf,
    extract_text_from_md_html
)

from ..errors import UnsupportedFileType, TokenExpired
from ..auth.utils import decode_token
from ..database.models import UserDataSource
from .schemas import UserDataSourceCreate

allowed_extension = ['.pdf','.docx', '.html','.md']

async def save_and_extract_text(file: UploadFile) -> str:
    if file:
        file_extension = os.path.splitext(file.filename)[1].lower()

        if file_extension not in allowed_extension:
            raise UnsupportedFileType()
        
        temp_file_path = f"temp_{file.filename}"

        try:
            # Save the uploaded file to a temporary file
            with open(temp_file_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)

            if file_extension == '.pdf':
                text = extract_text_from_pdf(temp_file_path)
            elif file_extension == '.docx':
                text = extract_text_from_docx(temp_file_path)
            elif file_extension == '.md' or file_extension == '.html':
                text = extract_text_from_md_html(temp_file_path)
            else:
                raise UnsupportedFileType()
            return clean_text(text)
        finally:
            if os.path.exists(temp_file_path):
                os.remove(temp_file_path)


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

async def get_current_user(token: str = Depends(oauth2_scheme)):  
    user = decode_token(token)
    if not user:
        raise TokenExpired()
    return user


async def process_vectorize(
    user_id: str, file: UploadFile = None, text: str = None, session: AsyncSession = None
):
    """Process uploaded personal bio file or raw text and store it."""
    
    if not file and not text:
        raise ValueError("Either a file or text input is required.")

    # Read content
    content = text or (await file.read()).decode("utf-8")

    # Store in vector DB
    vector_db_id = await store_in_vector_db(user_id, content)

    # Save metadata in PostgreSQL
    user_data_source = UserDataSource(
        id=uuid.uuid4(),
        uuid=user_id,
        source="personal_bio",
        vector_db_id=vector_db_id,
        data=content,  # Optional: Store raw text
        created_at=datetime.now,
        update_at=datetime.now,
    )
    
    session.add(user_data_source)
    await session.commit()

    return vector_db_id