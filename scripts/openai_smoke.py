#!/usr/bin/env python
"""
Simple end-to-end smoke test for the OpenAI-backed Smart Finance Coach API.

- Starts the FastAPI app with AI_PROVIDER=openai
- Waits for it to become ready
- Fetches a demo summary for the 'family' persona
- Calls POST /chat with a simple question
- Verifies that an assistant message is present
"""

from __future__ import annotations

import json
import os
import subprocess
import sys
import time
from contextlib import suppress
from pathlib import Path
from urllib.error import URLError, HTTPError
from urllib.request import Request, urlopen

API_BASE = os.getenv("SMOKE_API_BASE", "http://localhost:8000")
PERSONA_ID = os.getenv("SMOKE_PERSONA_ID", "family")
STARTUP_TIMEOUT_SECONDS = 20
POLL_INTERVAL_SECONDS = 0.5


def _http_get_json(path: str) -> dict:
    url = f"{API_BASE.rstrip('/')}/{path.lstrip('/')}"
    req = Request(url, method="GET")
    with urlopen(req, timeout=10) as resp:  # nosec B310 (local dev tool)
        data = resp.read()
    return json.loads(data.decode("utf-8"))


def _http_post_json(path: str, payload: dict) -> dict:
    url = f"{API_BASE.rstrip('/')}/{path.lstrip('/')}"
    data = json.dumps(payload).encode("utf-8")
    req = Request(url, data=data, method="POST", headers={"Content-Type": "application/json"})
    with urlopen(req, timeout=20) as resp:  # nosec B310 (local dev tool)
        body = resp.read()
    return json.loads(body.decode("utf-8"))


def wait_for_api_ready() -> None:
    """Poll the summary endpoint until the API responds or timeout."""
    deadline = time.time() + STARTUP_TIMEOUT_SECONDS
    last_error: Exception | None = None

    while time.time() < deadline:
        try:
            _http_get_json(f"personas/{PERSONA_ID}/summary")
            print("✅ API is ready")
            return
        except (URLError, HTTPError, json.JSONDecodeError) as exc:
            last_error = exc
            time.sleep(POLL_INTERVAL_SECONDS)

    print("❌ API did not become ready in time.")
    if last_error:
        print(f"Last error: {last_error}")
    raise SystemExit(1)


def run_smoke_test() -> int:
    # Check critical env
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        print("❌ OPENAI_API_KEY is not set in the environment.")
        return 1

    model = os.getenv("AI_MODEL", os.getenv("OPENAI_MODEL", "gpt-4.1-mini"))
    print(f"Using model: {model}")

    # Start the API server as a subprocess
    env = os.environ.copy()
    env.setdefault("AI_PROVIDER", "openai")
    env.setdefault("AI_MODEL", model)

    print("Starting FastAPI app with OpenAI provider...")
    api_log = Path("/tmp/openai_smoke_api.log")
    with api_log.open("wb") as log_file:
        proc = subprocess.Popen(  # nosec B603
            [
                "uvicorn",
                "backend.main:app",
                "--host",
                "0.0.0.0",
                "--port",
                "8000",
            ],
            env=env,
            stdout=log_file,
            stderr=subprocess.STDOUT,
        )

    try:
        wait_for_api_ready()

        print(f"Fetching summary for persona '{PERSONA_ID}'...")
        summary = _http_get_json(f"personas/{PERSONA_ID}/summary")

        payload = {
            "personaId": PERSONA_ID,
            "messages": [
                {
                    "id": "1",
                    "role": "user",
                    "content": "Give me one actionable savings tip for this family profile.",
                }
            ],
            "summary": summary,
        }

        request_path = Path("/tmp/openai_smoke_request.json")
        response_path = Path("/tmp/openai_smoke_response.json")
        request_path.write_text(json.dumps(payload, indent=2), encoding="utf-8")

        print(f"Sending chat request to {API_BASE}/chat/ ...")
        resp = _http_post_json("chat/", payload)
        response_path.write_text(json.dumps(resp, indent=2), encoding="utf-8")

        # Your backend contract: { "message": { "role": "assistant", "content": "..." }, "metadata": {...} }
        message = resp.get("message") or {}
        content = message.get("content")

        if content:
            preview = str(content).replace("\n", " ")
            print(f"✅ OpenAI smoke test returned: {preview[:160]}...")
            return 0

        print("❌ Response missing 'message.content'. Full payload saved to /tmp/openai_smoke_response.json")
        return 1

    finally:
        print("Stopping API server...")
        with suppress(ProcessLookupError):
            proc.terminate()
        try:
            proc.wait(timeout=5)
        except subprocess.TimeoutExpired:
            with suppress(ProcessLookupError):
                proc.kill()


if __name__ == "__main__":
    try:
        sys.exit(run_smoke_test())
    except KeyboardInterrupt:
        print("\nInterrupted by user.")
        sys.exit(130)
