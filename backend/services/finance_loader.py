from datetime import datetime
from pathlib import Path
from typing import Dict, Iterable, List

import pandas as pd

from backend.models.finance import Persona, TransactionRecord

DATA_DIR = Path(__file__).resolve().parents[2] / "data"

_PERSONA_CONFIG: Dict[str, Dict[str, str]] = {
    "single": {
        "file": "persona_single_demo.csv",
        "name": "Solo Starter",
        "description": "Young professional exploring mindful spending.",
        "target_savings_rate": 0.2,
    },
    "family": {
        "file": "persona_family_demo.csv",
        "name": "Family Planner",
        "description": "Parents balancing household costs and childcare.",
        "target_savings_rate": 0.22,
    },
    "recent_grad": {
        "file": "persona_recent_grad_demo.csv",
        "name": "Recent Grad",
        "description": "Early career graduate managing starter salary and loans.",
        "target_savings_rate": 0.18,
    },
}


def list_personas() -> List[Persona]:
    return [
        Persona(id=persona_id, name=config["name"], description=config["description"])
        for persona_id, config in _PERSONA_CONFIG.items()
    ]


def get_persona_target_rate(persona_id: str) -> float:
    config = _PERSONA_CONFIG.get(persona_id)
    if not config:
        raise ValueError(f"Unknown persona id: {persona_id}")
    return float(config.get("target_savings_rate", 0.2))


def _parse_essential(value: object) -> bool:
    if isinstance(value, bool):
        return value
    if isinstance(value, (int, float)):
        return bool(value)
    if isinstance(value, str):
        lowered = value.strip().lower()
        return lowered in {"1", "true", "yes", "y"}
    return False


def _ensure_data_dir_exists() -> None:
    if not DATA_DIR.exists():
        raise FileNotFoundError(f"Data directory not found: {DATA_DIR}")


def _load_csv_rows(file_path: Path) -> Iterable[Dict[str, object]]:
    data_frame = pd.read_csv(file_path)
    for _, row in data_frame.iterrows():
        yield row.to_dict()


def load_transactions(persona_id: str) -> List[TransactionRecord]:
    config = _PERSONA_CONFIG.get(persona_id)
    if not config:
        raise ValueError(f"Unknown persona id: {persona_id}")

    _ensure_data_dir_exists()

    file_path = DATA_DIR / config["file"]
    if not file_path.exists():
        raise FileNotFoundError(f"Persona data not found: {file_path}")

    records: List[TransactionRecord] = []
    for row in _load_csv_rows(file_path):
        records.append(
            TransactionRecord(
                persona_id=persona_id,
                date=datetime.strptime(str(row.get("date")), "%Y-%m-%d").date(),
                description=str(row.get("description") or "").strip() or None,
                category=str(row.get("category") or "").strip(),
                amount=float(row.get("amount", 0) or 0),
                type=str(row.get("type") or "expense").strip().lower(),
                essential=_parse_essential(row.get("essential")),
            )
        )

    return records
