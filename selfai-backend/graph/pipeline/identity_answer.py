import json
import re
from typing import Dict, Any
from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate

PROMPT = """
You are an Identity Reasoning Engine.

You will be given CONTEXT extracted from the user's connected sources (GitHub docs, files, etc.).
Answer the QUESTION using ONLY the CONTEXT.

Return a SINGLE valid JSON object (no markdown, no backticks) with exactly these keys:
- summary: string
- capabilities: array of strings
- evidence: array of objects (each object should include: title, url (optional), why_it_matters, confidence (0..1))

Rules:
- Do not hallucinate. If context is insufficient, say so in summary and keep evidence minimal/empty.
- Prefer concrete proof (projects, repos, docs) and include why_it_matters.
- depth = "concise" => summary <= 6 sentences. depth = "detailed" => can be longer.

depth: {depth}

CONTEXT:
{context}

QUESTION:
{question}
"""

_template = ChatPromptTemplate.from_template(PROMPT)
_model = ChatOpenAI(model="gpt-4o-mini", temperature=0.2)

async def identity_answer_json(*, question: str, context: str, depth: str = "concise") -> Dict[str, Any]:
    msgs = _template.format_messages(question=question, context=context, depth=depth)
    resp = _model.invoke(msgs)
    content = resp.content

    # Clean markdown code blocks if present
    if "```" in content:
        content = re.sub(r"```json\s*", "", content)
        content = re.sub(r"```", "", content)
    
    content = content.strip()

    try:
        return json.loads(content)
    except json.JSONDecodeError:
        # Fallback if JSON is invalid
        return {
            "summary": content,
            "capabilities": [],
            "evidence": []
        }