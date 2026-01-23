from langchain_openai import OpenAIEmbeddings

_embeddings = OpenAIEmbeddings(model="text-embedding-3-small")

def embed_texts(texts: list[str]) -> list[list[float]]:
    # batch embed
    return _embeddings.embed_documents(texts)

def embed_query(text: str) -> list[float]:
    return _embeddings.embed_query(text)