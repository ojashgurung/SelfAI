def build_context(matches, max_chars: int = 12000) -> str:
    parts = []
    used = 0

    for m in matches:
        md = m.metadata or {}
        chunk = md.get("content") or ""
        if not chunk:
            continue

        title = md.get("title") or md.get("document_name") or ""
        url = md.get("url") or ""
        header = f"{title}\n{url}".strip()

        block = f"{header}\n\n{chunk}".strip() if header else chunk.strip()

        if used + len(block) > max_chars:
            break

        parts.append(block)
        used += len(block) + 2

    return "\n\n---\n\n".join(parts)    