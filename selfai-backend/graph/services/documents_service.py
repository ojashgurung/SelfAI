from sqlmodel import select
from graph.models.documents import Document
from graph.utils.hash import sha256_text
from graph.utils.time import utcnow

class DocumentsService:
    @staticmethod
    async def get_all_documents(session, user_id, source_id=None):
        stmt = select(Document).where(Document.user_id == user_id)
        if source_id:
            stmt = stmt.where(Document.source_id == source_id)
        return (await session.exec(stmt)).all()

    @staticmethod
    async def upsert_document(
        session,
        *,
        user_id,
        source_id,
        external_id: str,
        doc_type: str,
        title: str,
        url: str | None,
        extracted_text: str | None,
        content_hash: str | None,
        doc_metadata: dict,
        updated_at_source=None,
        file_asset_id=None,
    ) -> Document:
        stmt = select(Document).where(
            Document.user_id == user_id,
            Document.source_id == source_id,
            Document.external_id == external_id,
        )
        existing = (await session.exec(stmt)).first()

        now = utcnow()

        if existing:
            existing.doc_type = doc_type
            existing.title = title
            existing.url = url
            existing.extracted_text = extracted_text
            existing.content_hash = content_hash
            existing.doc_metadata = doc_metadata
            existing.updated_at_source = updated_at_source
            existing.file_asset_id = file_asset_id
            existing.updated_at = now
            session.add(existing)
            await session.flush()
            return existing

        doc = Document(
            user_id=user_id,
            source_id=source_id,
            external_id=external_id,
            doc_type=doc_type,
            title=title,
            url=url,
            extracted_text=extracted_text,
            content_hash=content_hash,
            doc_metadata=doc_metadata,
            updated_at_source=updated_at_source,
            file_asset_id=file_asset_id,
            created_at=now,
            updated_at=now,
        )
        session.add(doc)
        await session.flush()
        return doc
        