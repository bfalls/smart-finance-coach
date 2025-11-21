from collections import defaultdict
from typing import Dict, Iterable, List

from backend.models.finance import (
    CategorySummary,
    FinanceSummary,
    GoalsSummary,
    MonthlyOverview,
    TransactionRecord,
)
from backend.services.finance_loader import get_persona_target_rate, load_transactions

_summary_cache: Dict[str, FinanceSummary] = {}


def _aggregate_months(records: Iterable[TransactionRecord]) -> List[MonthlyOverview]:
    monthly_totals: Dict[str, Dict[str, float]] = defaultdict(lambda: {"income": 0.0, "expense": 0.0})

    for record in records:
        month_key = record.date.strftime("%Y-%m")
        if record.type == "income":
            monthly_totals[month_key]["income"] += record.amount
        else:
            monthly_totals[month_key]["expense"] += record.amount

    monthly_overview = []
    for month in sorted(monthly_totals.keys()):
        totals = monthly_totals[month]
        total_expense = totals["expense"]
        income = totals["income"]
        savings = income - total_expense
        monthly_overview.append(
            MonthlyOverview(month=month, total=total_expense, income=income, savings=savings)
        )

    return monthly_overview


def _latest_month(records: Iterable[TransactionRecord]) -> str:
    months = {record.date.strftime("%Y-%m") for record in records}
    return max(months) if months else ""


def _aggregate_categories(records: Iterable[TransactionRecord], latest_month: str) -> List[CategorySummary]:
    category_totals: Dict[str, Dict[str, object]] = defaultdict(lambda: {"amount": 0.0, "essential": False})

    for record in records:
        if record.type != "expense":
            continue
        if record.date.strftime("%Y-%m") != latest_month:
            continue
        category_data = category_totals[record.category]
        category_data["amount"] += record.amount
        category_data["essential"] = category_data["essential"] or record.essential

    categories = [
        CategorySummary(name=name, latest=values["amount"], essential=bool(values["essential"]))
        for name, values in category_totals.items()
    ]

    categories.sort(key=lambda category: category.latest, reverse=True)
    return categories


def compute_finance_summary(persona_id: str, transactions: List[TransactionRecord]) -> FinanceSummary:
    monthly_overview = _aggregate_months(transactions)
    latest_month = _latest_month(transactions)
    categories = _aggregate_categories(transactions, latest_month)

    latest_overview = next((item for item in monthly_overview if item.month == latest_month), None)
    income_latest = latest_overview.income if latest_overview else 0
    savings_latest = latest_overview.savings if latest_overview else 0
    target_savings_rate = get_persona_target_rate(persona_id)

    goals = GoalsSummary(
        target_savings_rate=target_savings_rate,
        current_savings_rate=(savings_latest / income_latest) if income_latest else 0,
    )

    return FinanceSummary(monthly_overview=monthly_overview, categories=categories, goals=goals)


def get_finance_summary(persona_id: str) -> FinanceSummary:
    if persona_id in _summary_cache:
        return _summary_cache[persona_id]

    transactions = load_transactions(persona_id)
    summary = compute_finance_summary(persona_id, transactions)

    _summary_cache[persona_id] = summary
    # TODO: add periodic refresh strategy if CSV data is updated while the server is running
    return summary
