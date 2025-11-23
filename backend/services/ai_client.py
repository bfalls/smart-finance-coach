"""AI provider abstraction for chat completions.

Supports a pluggable provider model keyed off the AI_PROVIDER environment
variable. Currently supports:
- mock: deterministic demo replies
- openai: OpenAI Chat Completions API via the official SDK
"""

from __future__ import annotations

import importlib.util
import logging
import os
from dataclasses import dataclass
from typing import Any, Iterable, List, Mapping, MutableMapping, Optional, Tuple, Type

logger = logging.getLogger(__name__)

ChatMessage = Mapping[str, str]


@dataclass
class AIConfig:
    """Runtime configuration for AI providers."""

    provider: str
    model: str
    openai_api_key: Optional[str]


class BaseAIProvider:
    """Protocol-like base class for AI providers."""

    def generate_chat(self, *, messages: Iterable[ChatMessage], system_prompt: str, model: Optional[str] = None) -> str:
        raise NotImplementedError


class MockAIProvider(BaseAIProvider):
    """Deterministic mock provider for demos and tests."""

    def generate_chat(self, *, messages: Iterable[ChatMessage], system_prompt: str, model: Optional[str] = None) -> str:
        logger.debug("MockAIProvider invoked with %d messages", len(list(messages)))
        return (
            "This is a mock Smart Finance Coach reply for demo purposes only. "
            "The conversation and finance data are fictional."
        )


class OpenAIProvider(BaseAIProvider):
    """OpenAI provider implementation using the official SDK."""

    def __init__(self, config: AIConfig) -> None:
        if not config.openai_api_key:
            raise ValueError("OPENAI_API_KEY is required when AI_PROVIDER is 'openai'")

        openai_client_class, api_error, openai_error = self._load_openai_dependencies()

        # Ensure the env var is set so the OpenAI client can pick it up.
        os.environ.setdefault("OPENAI_API_KEY", config.openai_api_key)

        # Note: we intentionally type this as Any so static type checkers
        # don't complain about dynamic attributes (e.g. `.chat`).
        self.client: Any = openai_client_class()
            
            
        self.api_error = api_error
        self.openai_error = openai_error
        self.default_model = config.model

    def generate_chat(self, *, messages: Iterable[ChatMessage], system_prompt: str, model: Optional[str] = None) -> str:
        # Convert to list so we can prepend system prompt deterministically
        message_list: List[MutableMapping[str, str]] = [
            {"role": "system", "content": system_prompt},
            *[{"role": msg["role"], "content": msg["content"]} for msg in messages],
        ]

        selected_model = model or self.default_model
        try:
            completion = self.client.chat.completions.create(
                model=selected_model,
                messages=message_list,
                max_tokens=600,
                temperature=0.4,
            )
        except (self.api_error, self.openai_error) as exc:
            logger.exception("OpenAI chat completion failed: %s", exc)
            raise RuntimeError("AI provider unavailable. Please try again later.") from exc

        choice = completion.choices[0].message
        return choice.content or ""

    @staticmethod
    def _load_openai_dependencies() -> Tuple[Type[object], Type[Exception], Type[Exception]]:
        if importlib.util.find_spec("openai") is None:
            raise RuntimeError(
                "The 'openai' package is required when AI_PROVIDER is 'openai'. "
                "Install it with `pip install openai`."
            )

        from openai import APIError, OpenAI, OpenAIError  # type: ignore

        return OpenAI, APIError, OpenAIError


def load_ai_config() -> AIConfig:
    """Load AI configuration from environment variables."""

    provider = os.getenv("AI_PROVIDER", "mock").lower()
    model = os.getenv("AI_MODEL", "gpt-4.1-mini")
    api_key = os.getenv("OPENAI_API_KEY")

    return AIConfig(provider=provider, model=model, openai_api_key=api_key)


def _provider_for(config: AIConfig) -> BaseAIProvider:
    if config.provider == "mock":
        return MockAIProvider()
    if config.provider == "openai":
        return OpenAIProvider(config)

    raise ValueError(f"Unsupported AI_PROVIDER '{config.provider}'. Supported providers: mock, openai")


def generate_chat(*, messages: Iterable[ChatMessage], system_prompt: str, model: Optional[str] = None) -> str:
    """Generate a chat completion using the configured AI provider.

    Args:
        messages: Iterable of message dicts with keys ``role`` and ``content``.
        system_prompt: System instruction/preamble sent to the model.
        model: Optional model name override. Defaults to ``AI_MODEL`` environment variable.

    Returns:
        The assistant response content as a string.
    """

    config = load_ai_config()
    provider = _provider_for(config)

    return provider.generate_chat(messages=messages, system_prompt=system_prompt, model=model)