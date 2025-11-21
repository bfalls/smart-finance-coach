# Smart Finance Coach (Demo Version)

This is a **demo-only** personal finance coaching web application.
It simulates how an AI assistant could analyze spending data and provide guidance -
**without storing real user data and without requiring authentication**. (It's just a demo)

The goal is to demonstrate:
- Real-time interaction between **AI and structured financial data**.
- How a **chat interface** can change the behavior of the app (planning mode, budgeting mode, etc.).
- A **privacy-first architecture** suitable for a production system later.
- Deployment on **AWS Free Tier** from **GitHub Actions**.

---

## Core Concept

The app uses **pre-seeded demo CSV files** (no real user data).  
Users pick a **demo persona** - then explore:
- Spending summaries
- Category-level trends
- AI-powered chat guidance
- Budget planning / goal adjustment via natural language

There is **no login**, **no file uploads**, and **no backend storage** of financial data.

---

## Tech Stack

| Layer | Technology |
|------|------------|
| Frontend | React + TypeScript + Vite + Tailwind CSS |
| Charts | Recharts (or alternative lightweight lib) |
| Backend | FastAPI (Python) |
| AI Calls | OpenAI API or Replicate API (configurable) |
| Deployment | GitHub Actions -> AWS S3 + CloudFront (frontend), AWS Lambda or ECS for backend |
| Data | CSV files in `/data/` folder (only demo data) |

---

## Directory Structure

```
smart-finance-coach/
│
├─ frontend/
│ ├─ src/
│ │ ├─ components/
│ │ │ ├─ PersonaSelector.tsx
│ │ │ ├─ SpendingCharts.tsx
│ │ │ ├─ SummaryPanel.tsx
│ │ │ └─ ChatPanel.tsx
│ │ ├─ hooks/
│ │ │ ├─ useFinanceData.ts
│ │ │ └─ useChat.ts
│ │ ├─ types/
│ │ │ └─ finance.ts
│ │ └─ App.tsx
│ └─ index.html
│
├─ backend/
│ ├─ main.py
│ ├─ models/ # Pydantic models (not ML models)
│ └─ services/
│ ├─ finance_loader.py
│ ├─ analytics.py
│ ├─ chat_logic.py
│ └─ ai_client.py
│
├─ data/
│ ├─ persona_single_demo.csv
│ ├─ persona_family_demo.csv
│ └─ persona_recent_grad_demo.csv
│
├─ .github/workflows/
│ ├─ frontend-deploy.yml
│ └─ backend-deploy.yml
│
├─ DESIGN.md <-- THIS FILE
└─ README.md <-- lightweight quickstart & summary
```


---

## AI Interaction Model

AI should **not** see raw transactions.  
The backend prepares **structured summary JSON** such as:

```json
{
  "monthly_overview": [
    { "month": "2025-06", "total": 3200, "income": 4500, "savings": 1300 },
    { "month": "2025-07", "total": 3400, "income": 4500, "savings": 1100 }
  ],
  "categories": [
    { "name": "Rent", "latest": 1500, "essential": true },
    { "name": "Restaurants", "latest": 520, "essential": false },
    { "name": "Shopping", "latest": 390, "essential": false }
  ],
  "goals": { "target_savings_rate": 0.20, "current_savings_rate": 0.12 }
}
```

This allows AI to answer questions like:

"Where can I cut spending painlessly?"

"Why did my spending rise last month?"

"Give me a 30-day plan to save $400 more."

## AI Call Structure

```
POST /chat
{
  personaId: string,
  messages: [
    { role: "user" | "assistant" | "system", content: string }
  ],
  summary: FinanceSummary  // precomputed server-side
}
```

Backend constructs:
```
SYSTEM_PROMPT = """
You are a personal finance coach.
You receive financial summaries as JSON.
Do not ask for raw transactions.
Provide helpful analysis and budgeting strategies based solely on the provided summaries.
"""
```

## Backend API Design

| Method | Endpoint                 | Description                      |
| ------ | ------------------------ | -------------------------------- |
| GET    | `/personas`              | List available demo personas     |
| GET    | `/personas/{id}/summary` | Return computed spending summary |
| POST   | `/chat`                  | Handle chatbot requests          |

All data is read-only and loaded from CSV.
No storage of user-specific data is ever performed.

## Privacy Strategy

- No authentication
- No user uploads

- No S3 / DB storage of financial data

- AI sees aggregates only - never raw transactions

- Can extend later to encrypted user-specific analysis (out of scope for MVP)

## Development Flow

1. Scaffold repo & folder structure
2. Create CSV loader + data models
3. Build aggregation functions
4. Implement GET /personas & /summary
5. Add chat endpoint -> ai_client
6. Build frontend persona selector
7. Add charts & summary panel
8. Connect chat panel -> backend
9. Deploy via GitHub Actions to AWS (Free Tier)

## Future Enhancements (Optional)
| Feature                             | Purpose                     |
| ----------------------------------- | --------------------------- |
| User uploads CSV (client-side only) | Local-only analysis         |
| AI-driven income simulation         | "What if I earned +10%"     |
| Debt payoff strategy                | Avalanche / snowball models |
| Scenario planning                   | "Move to cheaper city"      |
| Export plan as PDF                  | For real UX polish          |
