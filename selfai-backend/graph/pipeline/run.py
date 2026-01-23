from graph.pipeline.chunking import chunk_text
from graph.pipeline.embeddings import embed_texts
from graph.pipeline.vector_store import upsert_document_vectors
from graph.services.documents_service import DocumentsService
from graph.services.sources_service import SourcesService
from graph.utils.hash import sha256_text
from graph.utils.time import utcnow

async def ingest_and_index_payload(session, *, user_id, source, payload):
    """
    payload: IngestPayload with payload.documents: list[IngestedDocument]
    source: Source DB row
    """
    namespace = str(user_id)  # v1 namespace strategy

    total_vectors = 0
    docs_upserted = 0
    docs_indexed = 0

    for d in payload.documents:
        # 1) persist document
        content_hash = sha256_text(d.text)

        doc_row = await DocumentsService.upsert_document(
            session,
            user_id=user_id,
            source_id=source.id,
            external_id=d.external_id,
            doc_type=d.doc_type,
            title=d.title,
            url=d.url,
            extracted_text=d.text,
            content_hash=content_hash,
            doc_metadata=d.metadata or {},
            updated_at_source=d.updated_at_source,
        )
        docs_upserted += 1

        # 2) index to pinecone
        if not d.text:
            continue

        chunks = chunk_text(d.text)
        if not chunks:
            continue

        vectors = embed_texts(chunks)

        base_meta = {
            "user_id": str(user_id),
            "source_id": str(source.id),
            "platform": source.platform,
            "document_id": str(doc_row.id),
            "external_id": d.external_id,
            "doc_type": d.doc_type,
            "title": d.title,
            "url": d.url,
        }

        n = await upsert_document_vectors(
            namespace=namespace,
            document_id=str(doc_row.id),
            chunks=chunks,
            vectors=vectors,
            metadata_base=base_meta,
        )

        total_vectors += n
        docs_indexed += 1

    # update source timestamps
    source.last_ingested_at = utcnow()
    await session.flush()

    return {
        "docs_upserted": docs_upserted,
        "docs_indexed": docs_indexed,
        "vectors_upserted": total_vectors,
    }