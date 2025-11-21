from backend.models.health import HealthStatus


def get_health_status() -> HealthStatus:
    return HealthStatus(status="ok", message="Smart Finance Coach backend is running")
