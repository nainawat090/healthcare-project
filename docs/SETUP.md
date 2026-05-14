# Setup Guide

## Prerequisites
- Node.js 18+
- Python 3.11+
- PostgreSQL 15+ (or Docker)
- Git

---

## Option 1: Docker (Fastest — Recommended)

```bash
# Clone repository
git clone https://github.com/your-username/healthcare-system
cd healthcare-system

# Copy and configure environment
cp backend/.env.example backend/.env
# Edit backend/.env if needed (defaults work for Docker)

# Start all services
docker-compose up --build

# Seed demo data (in a new terminal)
docker exec -it healthcare_backend python seed.py
```

Visit:
- Frontend: http://localhost:3000
- API Docs: http://localhost:8000/docs

---

## Option 2: Manual Setup

### 1. PostgreSQL Setup
```bash
# macOS (Homebrew)
brew install postgresql@15
brew services start postgresql@15

# Create database
psql -U postgres -c "CREATE USER healthcare_user WITH PASSWORD 'healthcare_pass';"
psql -U postgres -c "CREATE DATABASE healthcare_db OWNER healthcare_user;"
```

### 2. Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your PostgreSQL credentials

# Run migrations
alembic upgrade head

# Seed demo data
python seed.py

# Start server
uvicorn app.main:app --reload --port 8000
```

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

---

## Environment Variables

### Backend (`.env`)

| Variable | Description | Default |
|---|---|---|
| `DATABASE_URL` | Async PostgreSQL URL | postgresql+asyncpg://... |
| `SECRET_KEY` | JWT secret (32+ chars) | *change this!* |
| `GEMINI_API_KEY` | Google Gemini 2.5 Pro key — enables AI chatbot | empty (rule-based fallback used) |
| `ENVIRONMENT` | development / production | development |

> **Without a Gemini key**: The chatbot uses the built-in rule-based engine — fully functional for demo with no API key needed. Get a free Gemini key at https://aistudio.google.com/app/apikey

### Frontend (`.env.local`)

| Variable | Description | Default |
|---|---|---|
| `VITE_API_URL` | Backend API URL | http://localhost:8000 |
| `VITE_WS_URL` | WebSocket URL | ws://localhost:8000 |

---

## Demo Credentials

| Role | Email | Password |
|---|---|---|
| **Admin** | admin@hospital.com | Admin@123 |
| **Doctor** | dr.sharma@hospital.com | Doctor@123 |
| **Patient** | patient@demo.com | Patient@123 |

---

## Project Structure Summary

```
healthcare-system/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/       Sidebar, Topbar, DashboardLayout
│   │   │   ├── ui/           StatsCard, VitalsCard, SeverityBadge
│   │   │   ├── charts/       TrendsChart, DepartmentChart
│   │   │   └── chatbot/      Chatbot (full AI chat UI)
│   │   ├── pages/
│   │   │   ├── patient/      Dashboard, Vitals, Records, Appointments
│   │   │   ├── doctor/       Dashboard, Patients, Schedule
│   │   │   └── admin/        Dashboard, Queue, Emergency, Analytics, Staff
│   │   ├── context/          AuthContext, AppContext
│   │   ├── utils/            api.js, helpers.js
│   │   └── data/             dummyData.js
│   ├── tailwind.config.js
│   └── package.json
│
├── backend/
│   ├── app/
│   │   ├── main.py           FastAPI entry point
│   │   ├── core/             config, database, security
│   │   ├── models/           SQLAlchemy ORM models
│   │   ├── schemas/          Pydantic request/response models
│   │   ├── services/         Business logic layer
│   │   ├── api/routes/       All REST endpoints + WebSocket
│   │   └── utils/            Helpers (vitals checker, etc.)
│   ├── alembic/              Database migrations
│   ├── seed.py               Demo data seeder
│   └── requirements.txt
│
├── docs/
│   ├── ARCHITECTURE.md
│   ├── API_REFERENCE.md
│   └── SETUP.md
│
├── docker-compose.yml
└── README.md
```

---

## Production Checklist

- [ ] Change `SECRET_KEY` to a random 64-char string
- [ ] Set `ENVIRONMENT=production` in `.env`
- [ ] Use HTTPS (add Nginx SSL config)
- [ ] Restrict `CORS_ORIGINS` to your domain
- [ ] Set strong PostgreSQL passwords
- [ ] Enable rate limiting (fastapi-limiter)
- [ ] Set up database backups
- [ ] Configure monitoring (Sentry, etc.)
- [ ] Remove `DEBUG=True` from FastAPI
