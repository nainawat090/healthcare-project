# System Architecture — MediAI Healthcare Platform

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                         │
│                                                             │
│  React 18 + Vite  │  Tailwind CSS  │  Framer Motion         │
│  React Router v6  │  React Query   │  Recharts              │
│  Zustand (state)  │  Axios         │  Lucide Icons          │
└────────────────────────────┬────────────────────────────────┘
                             │ HTTP/REST + WebSocket
┌────────────────────────────▼────────────────────────────────┐
│                        API LAYER                            │
│                                                             │
│             FastAPI 0.109  (Python 3.11)                    │
│                                                             │
│  /api/v1/auth          JWT authentication                   │
│  /api/v1/patients      Patient CRUD + vitals                │
│  /api/v1/appointments  Booking management                   │
│  /api/v1/triage        AI severity classification           │
│  /api/v1/chatbot       LLM + rule-based assistant           │
│  /api/v1/doctors       Doctor management                    │
│  /api/v1/records       Digital health records               │
│  /api/v1/analytics     Hospital KPIs + trends               │
│  /api/v1/ws/vitals     WebSocket IoT streaming              │
└────────┬───────────────────┬───────────────────────────────┘
         │                   │
┌────────▼───────┐  ┌────────▼────────────────────────────────┐
│  PostgreSQL 15 │  │            AI / ML LAYER                │
│                │  │                                         │
│  users         │  │  Rule-based engine → Triage scoring          │
│  appointments  │  │  scikit-learn → Risk classifier         │
│  vitals        │  │  Gemini 2.5 Pro → Chatbot (if API key set)        │
│  health_records│  │  Claude API   → Chatbot fallback        │
│  notifications │  │  Simulated IoT → Vitals stream          │
└────────────────┘  └─────────────────────────────────────────┘
```

## Role-Based Access Control

```
Admin ──────► Full access: all routes, analytics, staff mgmt
Doctor ─────► Own schedule, assigned patients, triage data
Patient ────► Own data only: vitals, records, appointments
```

## AI Component Architecture

```
                User Input (symptoms)
                        │
                        ▼
            ┌───────────────────────┐
            │  Triage Service       │
            │                       │
            │  1. Keyword matching  │ ◄── TRIAGE_RULES dict
            │  2. Score calculation │
            │  3. Age modifiers     │
            │  4. Risk conditions   │
            └───────────┬───────────┘
                        │
                        ▼
              Severity: LOW/MEDIUM/HIGH/CRITICAL
              Score:    0.0 – 10.0
              Category: Cardiac, Respiratory, etc.
              Action:   Recommendation text


                User Chat Message
                        │
                        ▼
            ┌───────────────────────┐
            │  Chatbot Service      │
            │                       │
            │  1. Try OpenAI API    │ → 500-token response
            │  2. Try Claude API    │ → 500-token response
            │  3. Rule-based engine │ → keyword matching
            └───────────┬───────────┘
                        │
                        ▼
              Reply text + Severity tag + Action hint
```

## Database Schema

```
users
├── id, email, hashed_password, name, phone
├── role: admin | doctor | patient
└── is_active, created_at

doctor_profiles        (1:1 → users)
├── specialty, experience_years, rating
├── consultation_fee, available_today
└── bio, license_number

patient_profiles       (1:1 → users)
├── age, gender, blood_group
├── severity: low|medium|high|critical
├── status: waiting|in_care|admitted|discharged|emergency
├── queue_position, risk_score
└── allergies[], chronic_conditions[]

appointments           (M:1 → users as patient & doctor)
├── appointment_date, duration_minutes
├── appointment_type, status
├── symptoms[], notes, doctor_notes
└── created_at

vital_records          (M:1 → patient_profiles)
├── heart_rate, systolic_bp, diastolic_bp
├── temperature, spo2, resp_rate
├── is_abnormal, alert_triggered
└── recorded_at

health_records         (M:1 → patient_profiles)
├── record_type: Lab Report|Prescription|Imaging|ECG
├── title, summary, file_path
├── tags[]
└── created_at

triage_assessments     (M:1 → patient_profiles)
├── symptoms[], severity, severity_score
├── ai_analysis, recommendation
└── assessed_by, created_at

notifications          (M:1 → users)
├── type: emergency|appointment|lab|system
├── title, message
├── is_read
└── created_at
```

## WebSocket Protocol

```
Client connects:  ws://host/api/v1/ws/vitals/{patient_id}
Server sends every 2.5s:
{
  "patient_id": 101,
  "tick": 45,
  "heart_rate": 78,
  "systolic_bp": 122,
  "diastolic_bp": 81,
  "temperature": 98.4,
  "spo2": 98,
  "resp_rate": 16,
  "is_abnormal": false,
  "alert": false
}
```

## Security Architecture

```
Request ──► CORS middleware ──► Rate limiter
               │
               ▼
           JWT Bearer token
               │
         decode_token()
               │
         get_current_user()     ← DB lookup
               │
         require_role()         ← RBAC check
               │
           Route handler
```
