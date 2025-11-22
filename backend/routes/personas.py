from typing import Dict, List

from fastapi import APIRouter, HTTPException

from backend.models.finance import FinanceSummary, Persona
from backend.services.analytics import get_finance_summary
from backend.services.finance_loader import list_personas

router = APIRouter(prefix="/personas", tags=["personas"])

_PERSONAS: List[Persona] = list_personas()
_PERSONA_IDS = {persona.id for persona in _PERSONAS}
_SUMMARY_CACHE: Dict[str, FinanceSummary] = {
    persona.id: get_finance_summary(persona.id) for persona in _PERSONAS
}


def _ensure_persona_exists(persona_id: str) -> None:
    if persona_id not in _PERSONA_IDS:
        raise HTTPException(status_code=404, detail=f"Persona '{persona_id}' not found.")


@router.get("/", response_model=List[Persona])
async def get_personas() -> List[Persona]:
    """Return the available personas from the cached list."""
    return _PERSONAS


@router.get("/{persona_id}/summary", response_model=FinanceSummary)
async def get_persona_summary(persona_id: str) -> FinanceSummary:
    """Return the precomputed finance summary for a specific persona."""
    _ensure_persona_exists(persona_id)
    return _SUMMARY_CACHE[persona_id]
