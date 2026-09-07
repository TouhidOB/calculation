# CalcHub

Decoupled rewrite of the TouhidOB/calculation Django monolith.

## Stack

- **backend/** — Django 5 + Django REST Framework. A *calculator registry engine* (40 calculators across 7 categories) served through 4 generic API endpoints.
- **frontend/** — Next.js 15 (TypeScript, Tailwind, App Router). One dynamic calculator UI driven by the API's field definitions — no per-calculator pages needed.

## API

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/health/` | heartbeat + calculator count |
| GET | `/api/calculators/` | all calculators grouped by category |
| GET | `/api/calculators/:id/` | one calculator's field definitions |
| POST | `/api/calculators/:id/run/` | execute a calculation |

Adding a calculator = one `register_calculator(...)` call in `backend/api/calculators/` — the frontend picks it up automatically.

## Run (Docker)

```bash
docker compose up --build -d
# frontend: http://localhost:3000
# API:      http://localhost:8000/api/calculators/
```

## Run (local dev)

```bash
# backend
cd backend && python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
python manage.py runserver 0.0.0.0:8000

# frontend (separate terminal)
cd frontend && npm install
NEXT_PUBLIC_API_URL=http://localhost:8000/api npm run dev
```

## Categories

finance (11) · business_investment (4) · health (6) · construction (6) · basic (5) · garments (4) · conversion (5)