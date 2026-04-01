import os
from io import BytesIO
from fastapi import APIRouter, Depends, File, UploadFile, HTTPException
from sqlmodel import select

from core.auth.dependencies import get_current_user
from core.database.db import AsyncSessionLocal
from graph.models.sources import Source
from graph.services.sources_service import SourcesService
from graph.ingestors.base import IngestPayload, IngestedDocument
from graph.ingestors.document_ingestor import DocumentIngestor
from graph.pipeline.run import ingest_and_index_payload

router = APIRouter(prefix="/integrations/documents", tags=["integrations-documents"])

@router.post("/upload")
async def upload_document(
    file: UploadFile = File(...),
    current_user=Depends(get_current_user),
):
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in {".pdf", ".docx", ".md", ".html", ".txt"}:
        raise HTTPException(status_code=400, detail="Unsupported file type")

    file_bytes = await file.read()
    if len(file_bytes) > 5 * 1024 * 1024:
        raise HTTPException(status_code=413, detail="File exceeds 5MB limit")

    ingestor = DocumentIngestor()
    payload = ingestor.ingest(
        file_bytes=file_bytes,
        filename=file.filename,
        content_type=file.content_type,
        user_id=str(current_user.id),
    )

    async with AsyncSessionLocal() as session:
        source = await SourcesService.get_or_create_documents_source(session, current_user.id)
        stats = await ingest_and_index_payload(
            session,
            user_id=current_user.id,
            source=source,
            payload=payload,
        )
        await session.commit()

    return {
        "status": "success",
        "source_id": str(source.id),
        "filename": file.filename,
        **stats,
    }