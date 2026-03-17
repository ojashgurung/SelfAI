from langchain_openai import ChatOpenAI
from langchain_anthropic import ChatAnthropic
from langchain_core.prompts import ChatPromptTemplate

PROMPT = """
You are a personalized AI assistant with deep knowledge about a specific person.

Below is personal context about this person — their background, experiences, skills, goals, and personality. Use this to make your responses genuinely tailored to WHO THEY ARE, not generic advice.

Personal Context:
{context}

---

Instructions:
- Combine your own knowledge WITH the personal context above
- Give advice and answers specific to this person's situation
- Speak directly to them — "Based on your background..." or "Given that you're..."
- Don't just summarize their data back to them — THINK about what's best for them specifically
- If the question has nothing to do with the person (e.g. math, general facts), answer normally without forcing personal context
- Never make up information about them that isn't in the context

Question:
{question}

Answer:
"""

_prompt = ChatPromptTemplate.from_template(PROMPT)

SUPPORTED_MODELS = {
    "gpt-4o": lambda: ChatOpenAI(model="gpt-4o", temperature=0.7),
    "gpt-4o-mini": lambda: ChatOpenAI(model="gpt-4o-mini", temperature=0.7),
    "gpt-3.5-turbo": lambda: ChatOpenAI(model="gpt-3.5-turbo", temperature=0.7),
    "claude-3-5-sonnet": lambda: ChatAnthropic(model="claude-3-5-sonnet-20241022", temperature=0.7),
    "gemini-1.5-pro": lambda: ChatGoogleGenerativeAI(model="gemini-1.5-pro", temperature=0.7),
}

async def answer_with_context(*, context: str, question: str, model_name: str = "gpt-4o") -> str:
    model = SUPPORTED_MODELS.get(model_name, SUPPORTED_MODELS["gpt-4o"])()
    messages = _prompt.format_messages(context=context, question=question)
    resp = model.invoke(messages)
    return resp.content


async def answer_without_context(*, question: str, model_name: str = "gpt-4o") -> str:
    GENERIC_PROMPT = ChatPromptTemplate.from_template("""
    You are a helpful AI assistant. Answer the following question as best you can.
    
    Question: {question}
    
    Answer:
    """)
    
    model = SUPPORTED_MODELS.get(model_name, SUPPORTED_MODELS["gpt-4o"])()
    messages = GENERIC_PROMPT.format_messages(question=question)
    resp = model.invoke(messages)
    return resp.content