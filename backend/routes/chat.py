import json
from time import perf_counter
from typing import Dict, List
from uuid import uuid4

from fastapi import APIRouter, HTTPException

from backend.models.finance import ChatMessage, ChatMetadata, ChatRequest, ChatResponse
from backend.services.ai_client import generate_chat, load_ai_config
from backend.services.analytics import get_finance_summary
from backend.services.finance_loader import Persona, list_personas

router = APIRouter(prefix="/chat", tags=["chat"])

_MAX_MESSAGES = 50
_HISTORY_LIMIT = 12

_PERSONAS: List[Persona] = list_personas()
_PERSONA_BY_ID: Dict[str, Persona] = {persona.id: persona for persona in _PERSONAS}


def _validate_persona(persona_id: str) -> Persona:
    persona = _PERSONA_BY_ID.get(persona_id)
    if not persona:
        raise HTTPException(status_code=404, detail=f"Persona '{persona_id}' not found.")
    return persona


def _build_system_prompt(persona: Persona, summary_json: dict) -> str:
    context_block = json.dumps(
        {"persona": persona.model_dump(), "finance_summary": summary_json}, indent=2
    )
    return (
        "You are Smart Finance Coach, a demo-only personal finance assistant. "
        "All conversations and finance data are fictional and limited to the provided persona. "
        "Never request or invent real personal information. Use only the context supplied.\n\n"
        "When replying:\n"
        "- Keep answers concise and actionable.\n"
        "- Ground suggestions in the provided finance summary.\n"
        "- Do not fabricate new transactions or external data.\n"
        "- If context is missing, say so and ask clarifying questions.\n\n"
        f"Context:\n{context_block}"
    )


def _prepare_history(messages: List[ChatMessage]) -> List[Dict[str, str]]:
    history = [msg for msg in messages if msg.role in {"user", "assistant"}]
    trimmed = history[-_HISTORY_LIMIT:]
    return [{"role": msg.role, "content": msg.content} for msg in trimmed]


@router.post("/", response_model=ChatResponse)
async def chat(request: ChatRequest) -> ChatResponse:
    if len(request.messages) > _MAX_MESSAGES:
        raise HTTPException(
            status_code=400,
            detail=f"Too many messages in request (max {_MAX_MESSAGES}).",
        )

    persona = _validate_persona(request.persona_id)

    summary = request.summary or get_finance_summary(request.persona_id)
    summary_payload = summary.model_dump()

    system_prompt = _build_system_prompt(persona, summary_payload)
    history = _prepare_history(request.messages)
    if not history:
        raise HTTPException(status_code=400, detail="At least one user message is required.")

    config = load_ai_config()

    start = perf_counter()
    reply = generate_chat(messages=history, system_prompt=system_prompt, model=config.model)
    latency_ms = int((perf_counter() - start) * 1000)

    content = reply.strip() or "I could not generate a response. Please try again."
    message = ChatMessage(id=str(uuid4()), role="assistant", content=content)
    metadata = ChatMetadata(model=config.model, latency_ms=latency_ms)

    return ChatResponse(message=message, metadata=metadata)
