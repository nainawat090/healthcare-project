# 🏥 AI-Powered Healthcare Automation & Smart Patient Management System

> A production-grade, AI-driven healthcare platform built for hackathons, portfolios, and real-world demo impact.

![Healthcare System Banner](https://img.shields.io/badge/Stack-React%20%7C%20FastAPI%20%7C%20PostgreSQL%20%7C%20AI-blue?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen?style=for-the-badge)

---

## 🚀 Project Overview

This system solves the most critical problems in hospital management:
- **Overcrowded queues** → Smart AI triage & queue management
- **Delayed diagnosis** → AI symptom analysis & severity scoring
- **Poor patient management** → Digital health records & smart dashboards
- **Emergency delays** → Real-time emergency prioritization
- **Communication gaps** → AI chatbot + notification system

---

## ✨ Core Features

| Feature | Description |
|---|---|
| 🧠 AI Symptom Analysis | ML-based severity classification (Low/Medium/High/Critical) |
| 🤖 AI Patient Chatbot | Context-aware conversational assistant (English + Hindi) |
| 📋 Smart Queue Management | Real-time patient queue with priority scoring |
| 🚨 Emergency Triage | Automated critical case flagging & alerts |
| 📊 Analytics Dashboard | Hospital KPIs, charts, and trend analysis |
| 🏥 Digital Health Records | Complete patient history & document management |
| 👨‍⚕️ Doctor Dashboard | Decision support, patient lists, appointment calendar |
| 🩺 Patient Dashboard | Health summary, upcoming appointments, vitals |
| ⌚ IoT Vitals Monitoring | Simulated real-time vitals with anomaly detection |
| 🔔 Notification System | Appointment reminders, emergency alerts, updates |
| 🌍 Multilingual Support | English and Hindi language toggle |
| 🔒 Role-Based Access | Admin / Doctor / Patient role separation |

---

## 🏗️ Tech Stack

### Frontend
```
React 18 + Vite          → Fast SPA with hot reload
Tailwind CSS             → Utility-first responsive styling
Framer Motion            → Smooth page & component animations
Recharts                 → Interactive healthcare analytics charts
Lucide React             → Clean, consistent icon library
React Router v6          → Client-side routing
React Query              → Server state & data caching
Axios                    → HTTP client with interceptors
```

### Backend
```
FastAPI                  → High-performance async Python API
PostgreSQL               → Relational DB for structured health data
SQLAlchemy 2.0           → ORM with async support
Alembic                  → Database migration management
Pydantic v2              → Request/response validation
JWT (python-jose)        → Authentication & authorization
bcrypt                   → Password hashing
WebSockets               → Real-time vitals & notifications
```

### AI / ML
```
scikit-learn             → Symptom severity classification model
Google Gemini 2.5 Pro    → LLM chatbot & report simplification
Rule-based engine        → Triage decision tree (no model needed)
Simulated IoT data       → Vitals anomaly detection
```

### DevOps
```
Docker + Docker Compose  → Containerized local & cloud deployment
PostgreSQL container     → Isolated database instance
Nginx                    → Frontend serving & API proxying
```

---

## 📁 Project Structure

```
healthcare-system/
├── frontend/                     # React + Vite frontend
│   ├── src/
│   │   ├── components/           # Reusable UI components
│   │   │   ├── ui/               # Buttons, Cards, Modals, Badges
│   │   │   ├── layout/           # Navbar, Sidebar, Layout
│   │   │   ├── charts/           # All chart components
│   │   │   └── chatbot/          # AI chatbot UI
│   │   ├── pages/                # Full page views
│   │   ├── context/              # React Context providers
│   │   ├── hooks/                # Custom React hooks
│   │   ├── utils/                # API client, helpers
│   │   └── data/                 # Dummy/seed data
│   ├── package.json
│   └── tailwind.config.js
│
├── backend/                      # FastAPI backend
│   ├── app/
│   │   ├── api/routes/           # All API route handlers
│   │   ├── models/               # SQLAlchemy DB models
│   │   ├── schemas/              # Pydantic schemas
│   │   ├── services/             # Business logic layer
│   │   ├── core/                 # Config, security, DB
│   │   └── utils/                # Helpers, validators
│   ├── alembic/                  # Database migrations
│   ├── requirements.txt
│   └── .env.example
│
├── docker-compose.yml            # Full stack orchestration
└── README.md
```

---

## 🚀 Quick Start

### Option 1: Docker (Recommended)
```bash
git clone https://github.com/your-username/healthcare-system
cd healthcare-system
cp backend/.env.example backend/.env
docker-compose up --build
```
Visit: `http://localhost:3000`

### Option 2: Manual Setup

**Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your DB credentials
alembic upgrade head
uvicorn app.main:app --reload --port 8000
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

---

## 🔑 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@hospital.com | Admin@123 |
| Doctor | dr.sharma@hospital.com | Doctor@123 |
| Patient | patient@demo.com | Patient@123 |

---

## 📡 API Documentation

After running the backend, visit:
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

---

## 🧠 AI Components Explained

### 1. Symptom Severity Classifier (Rule-Based + ML)
- Input: symptom list + duration + patient age
- Output: LOW / MEDIUM / HIGH / CRITICAL score
- Method: Decision tree trained on synthetic medical triage data
- Fallback: Rule-based keyword matching for demo safety

### 2. AI Chatbot (Gemini 2.5 Pro)
- Powered by Google Gemini 2.5 Pro API
- System prompt engineered for medical assistant behavior
- Includes safety disclaimers automatically
- Context window maintains conversation history
- Falls back to built-in rule engine if no API key is set

### 3. IoT Vitals Anomaly Detection
- Simulated WebSocket stream (heart rate, SpO2, BP, temp)
- Rule-based thresholds for alert triggering
- Dashboard shows live pulse animations on critical values

### 4. Doctor Decision Support
- Rule-based suggestion engine based on symptom patterns
- Maps diagnoses → typical treatment protocols
- Clearly marked as "AI suggestion, not prescription"

---

## 🎨 UI Pages

1. **Landing Page** - Hero, features, stats, CTA
2. **Login / Register** - Role-based auth
3. **Patient Dashboard** - Health summary, vitals, appointments
4. **Doctor Dashboard** - Patient list, schedule, decision support
5. **Admin Dashboard** - Analytics, reports, system overview
6. **Patient Queue** - Real-time queue with triage priority
7. **Emergency Triage** - Critical case management
8. **Health Records** - Digital records viewer/uploader
9. **Appointment Booking** - Calendar-based scheduling
10. **AI Chatbot** - Full-screen conversational assistant
11. **Analytics** - Charts, KPIs, trend analysis

---

## 🔒 Security Features

- JWT access + refresh tokens
- Bcrypt password hashing (12 rounds)
- Role-based route guards (frontend + backend)
- CORS configuration
- Rate limiting on auth endpoints
- SQL injection prevention via ORM
- Environment variable secrets management
- HTTPS-ready configuration

---

## 📊 Resume-Ready Description

> **AI-Powered Healthcare Management System** | React, FastAPI, PostgreSQL, AI/ML
>
> Built a full-stack healthcare platform featuring AI symptom analysis, real-time patient triage, IoT vitals monitoring, and an LLM-powered patient chatbot. Implemented role-based access (Admin/Doctor/Patient), digital health records, automated appointment scheduling, and a hospital analytics dashboard. Used machine learning for severity scoring and rule-based engines for emergency prioritization. Containerized with Docker and designed for production deployment.

---

## 🔮 Future Enhancements

- [ ] FHIR API compliance for EHR interoperability
- [ ] Telemedicine video call integration (WebRTC)
- [ ] Prescription management module
- [ ] Pharmacy inventory integration
- [ ] AI-powered medical image analysis (X-ray, MRI)
- [ ] Insurance claim automation
- [ ] Wearable device integration (Apple Health, Fitbit)
- [ ] SMS/WhatsApp notification via Twilio
- [ ] Audit logging and HIPAA compliance
- [ ] Multi-hospital/branch management

---

## 📄 License

MIT License — Free for educational and portfolio use.

---

*Built with ❤️ for healthcare innovation*
