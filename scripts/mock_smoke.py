#!/usr/bin/env python
"""
Smoke test for MOCK AI provider.
Validates pipeline: /personas → /chat → mock reply,
WITHOUT requiring OPENAI_API_KEY.
"""

import json
import sys
import time
from urllib.request import Request, urlopen
from urllib.error import URLError, HTTPError

API_BASE = "http://localhost:8000"
PERSONA_ID = "family"

def get_json(path: str) -> dict:
    url = f"{API_BASE}/{path}"
    req = Request(url, method="GET")
    with urlopen(req, timeout=5) as resp:
        return json.loads(resp.read())

def post_json(path: str, payload: dict) -> dict:
    url = f"{API_BASE}/{path}"
    req = Request(url,
        method="POST",
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"},
    )
    with urlopen(req, timeout=5) as resp:
        return json.loads(resp.read())

def run():
    print("🔎 Testing personas/... endpoint")
    summary = get_json(f"personas/{PERSONA_ID}/summary")
    print("Summary OK")

    payload = {
        "personaId": PERSONA_ID,
        "messages": [{"id":"1","role":"user","content":"Hello mock coach!"}],
        "summary": summary,
    }
    print("💬 Sending chat mock request...")
    resp = post_json("chat/", payload)
    content = resp.get("message", {}).get("content", "")

    if "mock" in content.lower():
        print(f"✅ MOCK chat returned as expected: {content[:80]}...")
        return 0

    print("❌ Unexpected mock response")
    print(json.dumps(resp, indent=2))
    return 1

if __name__ == "__main__":
    sys.exit(run())
