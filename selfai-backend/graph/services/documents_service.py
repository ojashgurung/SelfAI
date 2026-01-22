from sqlmodel import select
from graph.models.documents import Document
from graph.utils.hash import sha256_text
from graph.utils.time import utcnow

class DocumentsService:
    @staticmethod
    async def get_all_documents(session, user_id):
        stmt = select(Document).where(Document.user_id == user_id)
        return (await session.exec(stmt)).all()

    @staticmethod
    async def upsert_document(session, *, user_id, source_id, doc):
        now = utcnow()
        content_hash = sha256_text(doc.text)

        stmt = select(Document).where(
            Document.user_id == user_id,
            Document.source_id == source_id,
            Document.external_id == doc.external_id,
        )
        existing = (await session.exec(stmt)).first()

        if existing:
            if existing.content_hash == content_hash:
                return existing, False  # unchanged
            existing.title = doc.title
            existing.doc_type = doc.doc_type
            existing.url = doc.url
            existing.content_hash = content_hash
            existing.extracted_text = doc.text
            existing.updated_at_source = doc.updated_at_source
            existing.doc_metadata = doc.metadata or {}
            existing.updated_at = now
            session.add(existing)
            await session.flush()
            return existing, True

        row = Document(
            user_id=user_id,
            source_id=source_id,
            external_id=doc.external_id,
            doc_type=doc.doc_type,
            title=doc.title,
            url=doc.url,
            content_hash=content_hash,
            extracted_text=doc.text,
            updated_at_source=doc.updated_at_source,
            doc_metadata=doc.metadata or {},
            created_at=now,
            updated_at=now,
        )
        session.add(row)
        await session.flush()
        return row, True