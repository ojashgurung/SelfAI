from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate


PROMPT = """
You are an AI assistant answering questions about the user based only on the provided context from their connected sources (GitHub, docs, etc.).

Rules:
- If the answer isn't in the context, say you don't have enough info.
- Be concise and accurate.
- Prefer referencing repo/doc names when possible.

Context:
{context}

Question:
{question}

Answer:
"""

_prompt = ChatPromptTemplate.from_template(PROMPT)
_model = ChatOpenAI(model="gpt-4o-mini", temperature=0.2)

async def answer_with_context(*, context: str, question: str) -> str:
    messages = _prompt.format_messages(context=context, question=question)
    resp = _model.invoke(messages)
    return resp.content