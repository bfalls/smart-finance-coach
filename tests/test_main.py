from backend.main import create_app, get_allowed_origins
from backend.services.health import get_health_status


def test_health_status_service_returns_ok() -> None:
    status = get_health_status()

    assert status.status == "ok"
    assert "backend is running" in status.message


def test_create_app_registers_health_route() -> None:
    app = create_app()

    assert app.title == "Smart Finance Coach API"
    assert app.url_path_for("health_check") == "/health/"


def test_get_allowed_origins_defaults(monkeypatch: object) -> None:
    monkeypatch.delenv("FRONTEND_ORIGIN", raising=False)

    origins = get_allowed_origins()

    assert "http://localhost:5173" in origins


def test_get_allowed_origins_reads_env(monkeypatch: object) -> None:
    monkeypatch.setenv("FRONTEND_ORIGIN", "http://example.com, http://test.com")

    origins = get_allowed_origins()

    assert origins == ["http://example.com", "http://test.com"]
