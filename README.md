# Smart Finance Coach

Finance coaching app using AI. (Currently just a demo)

## Build, run, and test

### 1) Backend setup
1. Create and activate a virtual environment.
   ```bash
   python -m venv .venv
   source .venv/bin/activate
   ```
2. Install backend dependencies.
   ```bash
   pip install -r requirements.txt
   ```
3. Copy the example environment file.
   ```bash
   cp .env.example .env
   # `.env` should normally stay in mock mode for free local runs
   ```

Key environment variables:

- `FRONTEND_ORIGIN`: Allowed CORS origins (comma-separated). Defaults to common localhost Vite ports.
- `AI_PROVIDER`: `mock` (default, no external calls) or `openai` (requires `OPENAI_API_KEY`).
- `AI_MODEL`: Model name for AI responses (default: `gpt-4.1-mini`).
- `OPENAI_API_KEY`: Your OpenAI API key when using the OpenAI provider.

### 2) Frontend setup
```bash
cd frontend
npm install
```

To build the frontend for production:
```bash
npm run build
npm run preview
```

### 3) Run in mock mode (safe/local)
This uses the default mock AI provider and costs nothing.

```bash
# Backend (from repo root)
make dev

# Frontend (new terminal)
cd frontend
VITE_API_BASE_URL=http://localhost:8000 npm run dev
```

Open `http://localhost:5173` and chat with any persona. The API listens on `http://localhost:8000` by default. Use `FRONTEND_ORIGIN` if you need to override the allowed CORS origin.

### 4) Run with OpenAI (paid)
You need to setup a billing method on https://platform.openai.com/settings/organization/billing/overview if you haven't already. Keep `.env` in mock mode for normal development. Create a separate file for OpenAI usage to avoid accidental costs:

```bash
cp .env.example .env.openai
echo "AI_PROVIDER=openai" >> .env.openai
echo "OPENAI_API_KEY=sk-your-key" >> .env.openai
```

Start the app using OpenAI:

```bash
# Backend (loads .env.openai)
make dev-openai

# Frontend (new terminal)
cd frontend
VITE_API_BASE_URL=http://localhost:8000 npm run dev
```

### 5) Tests and smoke checks
- Unit tests (mock data):
  ```bash
  make test
  ```
- Mock end-to-end chat smoke test (safe):
  ```bash
  make chat-smoke
  ```
- OpenAI smoke test (paid, requires `.env.openai`):
  ```bash
  make openai-smoke
  ```
  Saves request/response JSONs to `/tmp/openai_smoke_request.json` and `/tmp/openai_smoke_response.json`.

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

### Cost Safety Notes

- `.env` should remain in **mock mode** for normal development.
- OpenAI usage requires `.env.openai` AND an explicit Makefile command.
- Only these targets will use your API key:
  - `make openai-smoke`  -> one request (automated test)
  - `make dev-openai`    -> manual testing via UI or curl
- To return to free mode, simply stop the server and run `make dev`.
