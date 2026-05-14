# API Endpoints Reference

Base URL: `http://localhost:8000/api/v1`

## Authentication

| Method | Endpoint           | Auth | Description                          |
|--------|--------------------|------|--------------------------------------|
| POST   | /auth/register     | ❌   | Register new user                    |
| POST   | /auth/login        | ❌   | Login, get JWT tokens                |
| POST   | /auth/refresh      | ❌   | Refresh access token                 |
| GET    | /auth/me           | ✅   | Get current user profile             |

## Patients

| Method | Endpoint                          | Roles         | Description               |
|--------|-----------------------------------|---------------|---------------------------|
| GET    | /patients                         | admin, doctor | List all patients         |
| GET    | /patients/{id}                    | all           | Get patient by ID         |
| GET    | /patients/{id}/vitals             | all           | Get patient vitals        |
| POST   | /patients/{id}/vitals             | all           | Record new vitals         |

## Appointments

| Method | Endpoint                          | Roles         | Description               |
|--------|-----------------------------------|---------------|---------------------------|
| GET    | /appointments                     | all           | List appointments (scoped)|
| POST   | /appointments                     | patient       | Book appointment          |
| GET    | /appointments/{id}                | all           | Get appointment detail    |
| PUT    | /appointments/{id}                | doctor, admin | Update appointment        |
| PATCH  | /appointments/{id}/cancel         | patient       | Cancel appointment        |

## Triage

| Method | Endpoint                          | Roles         | Description               |
|--------|-----------------------------------|---------------|---------------------------|
| POST   | /triage/analyze                   | all           | AI symptom analysis       |
| GET    | /triage/queue                     | admin, doctor | Get patient queue         |
| GET    | /triage/emergency                 | admin, doctor | Get critical cases        |

## Chatbot

| Method | Endpoint                          | Roles         | Description               |
|--------|-----------------------------------|---------------|---------------------------|
| POST   | /chatbot/chat                     | all           | Send chat message         |

## Doctors

| Method | Endpoint                          | Roles         | Description               |
|--------|-----------------------------------|---------------|---------------------------|
| GET    | /doctors                          | all           | List doctors              |
| GET    | /doctors/{id}                     | all           | Get doctor profile        |
| GET    | /doctors/{id}/patients            | doctor, admin | Get doctor's patients     |

## Health Records

| Method | Endpoint                          | Roles         | Description               |
|--------|-----------------------------------|---------------|---------------------------|
| GET    | /records/{patient_id}             | all           | Get patient records       |
| POST   | /records                          | doctor, admin | Create health record      |
| GET    | /records/detail/{id}              | all           | Get record detail         |

## Analytics

| Method | Endpoint                          | Roles         | Description               |
|--------|-----------------------------------|---------------|---------------------------|
| GET    | /analytics/overview               | admin, doctor | Hospital KPIs             |
| GET    | /analytics/trends                 | admin, doctor | Monthly trends data       |
| GET    | /analytics/departments            | admin, doctor | Department breakdown      |

## WebSocket

| Protocol  | Endpoint                          | Description               |
|-----------|-----------------------------------|---------------------------|
| WebSocket | /ws/vitals/{patient_id}           | Live vitals stream        |
| WebSocket | /ws/notifications/{user_id}       | Live notification stream  |

---

## Sample Requests

### Login
```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@hospital.com","password":"Admin@123"}'
```

### Analyze Symptoms
```bash
curl -X POST http://localhost:8000/api/v1/triage/analyze \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"symptoms":["chest pain","shortness of breath"],"patient_age":55}'
```

### Chat with Bot
```bash
curl -X POST http://localhost:8000/api/v1/chatbot/chat \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"I have severe chest pain"}],"language":"en"}'
```
