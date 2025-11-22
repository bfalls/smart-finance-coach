# Smart Finance Coach (Demo)

Demo-only finance coaching app using AI.

## Backend quickstart
```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn backend.main:app --reload
```

The API listens on `http://localhost:8000` by default. Use `FRONTEND_ORIGIN` to override the allowed CORS origin (defaults to `http://localhost:5173`). All data is demo-only and read-only; the API serves canned responses from static CSVs and does not persist changes.

### REST endpoints (curl examples)
* Health check
  ```bash
  curl http://localhost:8000/health/
  ```

* List personas
  ```bash
  curl http://localhost:8000/personas/
  ```

* Persona finance summary
  ```bash
  curl http://localhost:8000/personas/family/summary
  ```

* Chat (demo response only)
  ```bash
  curl -X POST http://localhost:8000/chat/ \
    -H "Content-Type: application/json" \
    -d '{
      "persona_id": "family",
      "messages": [
        {"id": "1", "role": "user", "content": "How am I tracking this month?"}
      ],
      "summary": $(curl -s http://localhost:8000/personas/family/summary)
    }'
  ```

## Frontend quickstart
```bash
cd frontend
npm install
VITE_API_BASE_URL=http://localhost:8000 npm run dev
```

Set `VITE_API_BASE_URL` to point the frontend at your running API (e.g., `http://localhost:8000`). For production builds, use `npm run build` and `npm run preview`.

### Development shortcuts
You can also use the `Makefile` for common tasks:

```bash
make dev   # Run the API with uvicorn and reload
make test  # Execute pytest
make lint  # Run Ruff linting
make format # Apply Ruff formatting
```
