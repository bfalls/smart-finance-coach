from uuid import uuid4

from fastapi import APIRouter, HTTPException

from backend.models.finance import ChatMessage, ChatRequest, ChatResponse

router = APIRouter(prefix="/chat", tags=["chat"])

_MAX_MESSAGES = 50


@router.post("/", response_model=ChatResponse)
async def chat(request: ChatRequest) -> ChatResponse:
    """Return a canned assistant reply while preserving the expected shape."""

    if len(request.messages) > _MAX_MESSAGES:
        raise HTTPException(
            status_code=400,
            detail=f"Too many messages in request (max {_MAX_MESSAGES}).",
        )

    persona_reference = request.persona_id
    top_category = request.summary.categories[0].name if request.summary.categories else None
    savings_rate = request.summary.goals.current_savings_rate
    target_rate = request.summary.goals.target_savings_rate

    content_parts = [
        f"I'm the assistant for persona '{persona_reference}'.",
    ]

    if top_category:
        content_parts.append(f"I noticed your top recent spending category is {top_category}.")

    content_parts.append(
        "Let's review your progress: your current savings rate is "
        f"{savings_rate:.1%} against a target of {target_rate:.1%}."
    )

    content_parts.append(
        "This is a demo response — we'll swap in the real AI client soon."
    )

    message = ChatMessage(id=str(uuid4()), role="assistant", content=" ".join(content_parts))

    # TODO: Replace canned response with real AI client once integrated.
    return ChatResponse(message=message)
