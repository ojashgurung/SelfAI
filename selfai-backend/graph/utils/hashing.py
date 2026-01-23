import hashlib

def sha256_text(text: str | None) -> str | None:
    if not text:
        return None
    return hashlib.sha256(text.encode("utf-8", errors="ignore")).hexdigest()