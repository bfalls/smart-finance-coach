import importlib.util
from typing import Any

from fastapi.testclient import TestClient

from backend.main import create_app


class _DummyMessage:
    def __init__(self, content: str) -> None:
        self.content = content


class _DummyChoice:
    def __init__(self, content: str) -> None:
        self.message = _DummyMessage(content)


class _DummyCompletion:
    def __init__(self, content: str) -> None:
        self.choices = [_DummyChoice(content)]


class _DummyCompletions:
    def __init__(self, content: str) -> None:
        self._content = content

    def create(self, **_kwargs: Any) -> _DummyCompletion:  # type: ignore[override]
        return _DummyCompletion(self._content)


class _DummyChat:
    def __init__(self, content: str) -> None:
        self.completions = _DummyCompletions(content)


class _DummyClient:
    def __init__(self, content: str) -> None:
        self.chat = _DummyChat(content)


class _DummyClientFactory:
    def __init__(self, content: str) -> None:
        self._content = content

    def __call__(self) -> _DummyClient:
        return _DummyClient(self._content)


class _DummyAPIError(Exception):
    pass


class _DummyOpenAIError(Exception):
    pass


def _patch_openai(monkeypatch: Any, content: str) -> None:
    monkeypatch.setattr(
        "backend.services.ai_client.OpenAIProvider._load_openai_dependencies",
        staticmethod(lambda: (_DummyClientFactory(content), _DummyAPIError, _DummyOpenAIError)),
    )


def test_chat_returns_stubbed_openai_response(monkeypatch: Any) -> None:
    monkeypatch.setenv("AI_PROVIDER", "openai")
    monkeypatch.setenv("AI_MODEL", "gpt-test")
    monkeypatch.setenv("OPENAI_API_KEY", "test-key")

    stub_content = "Canned assistant guidance."
    _patch_openai(monkeypatch, stub_content)

    client = TestClient(create_app())

    response = client.post(
        "/chat/",
        json={
            "personaId": "single",
            "messages": [
                {"id": "1", "role": "user", "content": "Hello"},
                {"id": "2", "role": "assistant", "content": "Hi there"},
            ],
        },
    )

    assert response.status_code == 200
    payload = response.json()
    assert payload["message"]["content"] == stub_content
    assert payload["message"]["role"] == "assistant"
    assert payload["metadata"]["provider"] == "openai"
    assert payload["metadata"]["model"] == "gpt-test"
    assert isinstance(payload["metadata"]["latency_ms"], int)


def test_chat_returns_config_error_without_api_key(monkeypatch: Any) -> None:
    monkeypatch.setenv("AI_PROVIDER", "openai")
    monkeypatch.delenv("OPENAI_API_KEY", raising=False)

    client = TestClient(create_app())

    response = client.post(
        "/chat/",
        json={"personaId": "single", "messages": [{"id": "1", "role": "user", "content": "Hello"}]},
    )

    assert response.status_code == 400
    assert "OPENAI_API_KEY is required" in response.json()["detail"]


def test_chat_returns_config_error_when_openai_missing(monkeypatch: Any) -> None:
    monkeypatch.setenv("AI_PROVIDER", "openai")
    monkeypatch.setenv("OPENAI_API_KEY", "test-key")

    original_find_spec = importlib.util.find_spec
    monkeypatch.setattr(
        importlib.util,
        "find_spec",
        lambda name: None if name == "openai" else original_find_spec(name),
    )

    client = TestClient(create_app())

    response = client.post(
        "/chat/",
        json={"personaId": "single", "messages": [{"id": "1", "role": "user", "content": "Hello"}]},
    )

    assert response.status_code == 400
    assert "'openai' package is required" in response.json()["detail"]
