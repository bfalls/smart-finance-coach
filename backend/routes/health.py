from fastapi import APIRouter

from backend.models.health import HealthStatus
from backend.services.health import get_health_status

router = APIRouter(prefix="/health", tags=["health"])


@router.get("/", response_model=HealthStatus)
async def health_check() -> HealthStatus:
    """Return basic health information to verify the server is running."""
    return get_health_status()
