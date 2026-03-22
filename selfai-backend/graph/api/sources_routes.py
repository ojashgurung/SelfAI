from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File
from graph.controllers.sources_controller import SourcesController
from core.database.db import AsyncSessionLocal
from core.auth.dependencies import get_current_user
from graph.pipeline.run import ingest_and_index_payload
from graph.ingestors.base import IngestPayload, IngestedDocument

router = APIRouter(prefix="/sources", tags=["graph-sources"])

@router.get("/")
async def get_all_sources(current_user=Depends(get_current_user)):
    return await SourcesController.get_all_sources(current_user.id)


@router.post("/{source_id}/reset")
async def reset_source(source_id: str, current_user=Depends(get_current_user)):
    result = await SourcesController.reset_sources(user_id = current_user.id, source_id=source_id)
    if not result:
        raise HTTPException(status_code=404, detail="Source not found")
    
    return result
    
@router.post("/{source_id}/ingest")
async def ingest_source(source_id: str, top_n: int = Query(15, ge=1, le=100), sort_by: str = Query("updated"),current_user=Depends(get_current_user)):
    result = await SourcesController.ingest_source(user_id = current_user.id, source_id=source_id, top_n=top_n, sort_by=sort_by)
    if not result:
        raise HTTPException(status_code=404, detail="Source not found")
    
    return result

@router.post("/sources/documents/upload")
async def upload_document(
    file: UploadFile = File(...),
    current_user=Depends(get_current_user)
):
    async with AsyncSessionLocal() as session:
        # Get or create documents source
        source = await get_or_create_documents_source(session, current_user.id)
        
        # Extract text using your existing utils
        text = await extract_text(file)
        
        # Use your existing ingest_and_index_payload
        from graph.utils.hash import sha256_text
        external_id = f"upload:file:{sha256_text(text)}"
        
        payload_doc = IngestedDocument(
            external_id=external_id,
            doc_type=file.filename.split(".")[-1],
            title=file.filename,
            text=text,
            url=None,
            metadata={"filename": file.filename},
        )
        
        stats = await ingest_and_index_payload(
            session,
            user_id=current_user.id,
            source=source,
            payload=SimplePayload(documents=[payload_doc])
        )
        
        await session.commit()
        return {"status": "success", "source_id": str(source.id), **stats}
