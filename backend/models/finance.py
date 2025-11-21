from datetime import date
from typing import List, Literal, Optional

from pydantic import BaseModel


class Persona(BaseModel):
    """Finance persona metadata exposed to the UI persona selector."""

    id: str
    name: str
    description: str


class TransactionRecord(BaseModel):
    """Normalized transaction row sourced from the CSV dataset."""

    persona_id: str
    date: date
    description: Optional[str] = None
    category: str
    amount: float
    type: Literal["income", "expense"]
    essential: bool = False


class MonthlyOverview(BaseModel):
    """Aggregated monthly totals keyed by YYYY-MM for trend displays."""

    month: str
    total: float
    income: float
    savings: float


class CategorySummary(BaseModel):
    """Latest category spend snapshot with essential flag for UI grouping."""

    name: str
    latest: float
    essential: bool


class GoalsSummary(BaseModel):
    """Savings goal comparison derived from income and spending totals."""

    target_savings_rate: float
    current_savings_rate: float


class FinanceSummary(BaseModel):
    """High-level finance snapshot returned to the frontend dashboard."""

    monthly_overview: List[MonthlyOverview]
    categories: List[CategorySummary]
    goals: GoalsSummary


class ChatMessage(BaseModel):
    """Single chat message mirroring the frontend chat message shape."""

    id: str
    role: Literal["user", "assistant", "system"]
    content: str


class ChatRequest(BaseModel):
    """Incoming chat payload including persona context and message history."""

    persona_id: str
    messages: List[ChatMessage]
    summary: FinanceSummary


class ChatResponse(BaseModel):
    """Assistant reply returned to the chat panel after model generation."""

    message: ChatMessage
