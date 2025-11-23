# Smart Finance Coach (Demo)

Demo-only finance coaching app using AI.

## Backend quickstart
1) Create and activate a virtual environment.
   ```bash
   python -m venv .venv
   source .venv/bin/activate
   ```
2) Install dependencies and start the API server.
   ```bash
   pip install -r requirements.txt
   uvicorn backend.main:app --reload
   ```

The API listens on `http://localhost:8000` by default. Use `FRONTEND_ORIGIN` to override the allowed CORS origin (defaults to `http://localhost:5173`). All data is demo-only and read-only; the API serves canned responses from static CSVs and does not persist changes.

Copy the example environment file if you want to configure API keys or override defaults:

```bash
cp .env.example .env
```

Environment variables:

- `FRONTEND_ORIGIN`: Allowed CORS origins (comma-separated). Defaults to common localhost Vite ports.
- `AI_PROVIDER`: `mock` (default, no external calls) or `openai` (requires `OPENAI_API_KEY`).
- `AI_MODEL`: Model name for AI responses (default: `gpt-4.1-mini`).
- `OPENAI_API_KEY`: Your OpenAI API key when using the OpenAI provider.

### REST endpoints (curl examples)
Base URL: `http://localhost:8000`

* Health check
  ```bash
  curl http://localhost:8000/health/
  ```

* List personas (demo/read-only data)
  ```bash
  curl http://localhost:8000/personas/
  ```

* Persona finance summary (demo/read-only data)
  ```bash
  curl http://localhost:8000/personas/{persona_id}/summary
  # Example
  curl http://localhost:8000/personas/family/summary
  ```

* Chat (AI-backed; read-only demo data)
  ```bash
  curl -X POST http://localhost:8000/chat/ \
    -H "Content-Type: application/json" \
    -d '{
      "personaId": "family",
      "messages": [
        {"id": "1", "role": "user", "content": "How am I tracking this month?"}
      ],
      "summary": $(curl -s http://localhost:8000/personas/family/summary)
    }'
  ```

### AI provider setup

The app is demo-only. You can run the AI path locally using either the mock provider (default) or OpenAI:

1. Copy the environment template and select a provider:
   ```bash
   cp .env.example .env # this file should stay in MOCK mode for normal dev
   # Use AI_PROVIDER=mock here (default) to avoid any external/metered calls
   ```

   * OpenAI configuration (optional, controlled use)
   * To avoid accidental costs, keep `.env` in mock mode and create a **separate file** for OpenAI usage:
      ```bash
      cp .env.example .env.openai
      echo "AI_PROVIDER=openai" >> .env.openai
      echo "OPENAI_API_KEY=sk-your-key" >> .env.openai
      ```
2. Start the backend API:
   ```bash
   uvicorn backend.main:app --reload
   ```
3. Start the frontend (in another terminal):
   ```bash
   cd frontend
   npm install
   VITE_API_BASE_URL=http://localhost:8000 npm run dev
   ```
4. Open the app in your browser (default `http://localhost:5173`), pick a persona, and send a chat message. You should see an AI reply and metadata (model + latency) from the backend. All data is fictional and limited to the provided personas.

### Local AI smoke tests

There are now two separate smoke tests to validate the full AI pipeline:

| Command | Provider | Cost | Purpose |
|--------|----------|------|---------|
| `make chat-smoke` | `mock` | $0 | End-to-end test using the mock provider (always safe). |
| `make openai-smoke` | `openai` | Paid | Sends a real request to OpenAI (requires API key). |
| `make dev-openai` | `openai` | Paid | Starts the API using OpenAI for manual UI testing. |

#### Mock (safe) smoke test

```bash
make chat-smoke  
```

## Frontend quickstart
```bash
cd frontend
npm install
VITE_API_BASE_URL=http://localhost:8000 npm run dev
```

Set `VITE_API_BASE_URL` to point the frontend at your running API (expected: `http://localhost:8000`). For production builds, use `npm run build` and `npm run preview`.

### Development shortcuts
You can also use the `Makefile` for common tasks:

```bash
make dev   # Run the API with uvicorn and reload
make test  # Execute pytest
make lint  # Run Ruff linting
make format # Apply Ruff and Black formatting
make openai-smoke  # Requires `.env.openai`, runs a real OpenAI request
make dev-openai     # Starts the API with OpenAI provider for manual testing
```

### OpenAI smoke test

Run this quick check to confirm the app can reach OpenAI with your key. The `openai-smoke` target loads your `.env`, exports
`AI_PROVIDER=openai`, `AI_MODEL`, and `OPENAI_API_KEY`, starts the API, and posts to `/chat` with a sample persona summary (same
flow as the curl example above).

```bash
# Create OpenAI config separately (DO NOT overwrite .env)
cp .env.example .env.openai
echo "AI_PROVIDER=openai" >> .env.openai
echo "OPENAI_API_KEY=sk-your-key" >> .env.openai

# Run a real OpenAI test (single request, low cost)
make openai-smoke
```

Expected success:
- Terminal prints `✅ OpenAI smoke test returned: ...` with the first part of the AI reply.
- Request/response JSONs are saved to `/tmp/openai_smoke_request.json` and `/tmp/openai_smoke_response.json` for inspection.

Common failure cases:
- Missing key: `make` stops immediately with `Set OPENAI_API_KEY with your OpenAI token`.
- Model name mismatch: OpenAI returns a model-not-found error in `/tmp/openai_smoke_response.json`; set `OPENAI_MODEL` to a
  model available to your account.
- Expired/insufficient permissions: OpenAI returns 401/429 errors; confirm the key and quota, then re-run the target.

### Cost Safety Notes

- `.env` should remain in **mock mode** for normal development.
- OpenAI usage requires `.env.openai` AND an explicit Makefile command.
- Only these targets will use your API key:
  - `make openai-smoke`  -> one request (automated test)
  - `make dev-openai`    -> manual testing via UI or curl
- To return to free mode, simply stop the server and run `make dev`.
