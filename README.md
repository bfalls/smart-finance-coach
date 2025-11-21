# Smart Finance Coach (Demo)

Demo-only finance coaching app using AI.

## Install and Run Frontend
```bash
cd frontend
npm install
npm run build
npm run preview
```

## Install and Run Backend
```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn backend.main:app --reload
```

Use `FRONTEND_ORIGIN` to override the allowed CORS origin (defaults to `http://localhost:5173`).
