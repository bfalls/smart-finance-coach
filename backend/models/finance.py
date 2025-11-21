from datetime import date
from typing import List, Literal, Optional

from pydantic import BaseModel


class Persona(BaseModel):
    id: str
    name: str
    description: str


class TransactionRecord(BaseModel):
    persona_id: str
    date: date
    description: Optional[str] = None
    category: str
    amount: float
    type: Literal["income", "expense"]
    essential: bool = False


class MonthlyOverview(BaseModel):
    month: str
    total: float
    income: float
    savings: float


class CategorySummary(BaseModel):
    name: str
    latest: float
    essential: bool


class GoalsSummary(BaseModel):
    target_savings_rate: float
    current_savings_rate: float


class FinanceSummary(BaseModel):
    monthly_overview: List[MonthlyOverview]
    categories: List[CategorySummary]
    goals: GoalsSummary
