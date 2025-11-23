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
   cp .env.example .env
   # Mock mode (default, no network calls)
   # AI_PROVIDER=mock
   
   # OpenAI mode (requires a key)
   AI_PROVIDER=openai
   OPENAI_API_KEY=sk-your-key
   # Optionally override the model name
   # AI_MODEL=gpt-4.1-mini
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
```
