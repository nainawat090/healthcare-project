from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from app.models.models import AppointmentStatus, SeverityLevel


# ── Appointment schemas ───────────────────────────────────────
class AppointmentCreate(BaseModel):
    doctor_id:        int
    appointment_date: datetime
    appointment_type: str = "General Checkup"
    duration_minutes: int = 30
    notes:            Optional[str] = None
    symptoms:         List[str]     = []


class AppointmentUpdate(BaseModel):
    appointment_date: Optional[datetime] = None
    appointment_type: Optional[str]     = None
    status:           Optional[AppointmentStatus] = None
    doctor_notes:     Optional[str]               = None


class AppointmentResponse(BaseModel):
    id:               int
    patient_id:       int
    doctor_id:        int
    appointment_date: datetime
    duration_minutes: int
    appointment_type: str
    status:           str
    notes:            Optional[str]
    doctor_notes:     Optional[str]
    symptoms:         List[str]
    created_at:       datetime

    class Config:
        from_attributes = True


# ── Vital Records schemas ─────────────────────────────────────
class VitalCreate(BaseModel):
    heart_rate:   Optional[float] = Field(None, ge=0, le=300)
    systolic_bp:  Optional[float] = Field(None, ge=0, le=300)
    diastolic_bp: Optional[float] = Field(None, ge=0, le=200)
    temperature:  Optional[float] = Field(None, ge=90, le=115)
    spo2:         Optional[float] = Field(None, ge=0, le=100)
    resp_rate:    Optional[float] = Field(None, ge=0, le=60)


class VitalResponse(BaseModel):
    id:               int
    heart_rate:       Optional[float]
    systolic_bp:      Optional[float]
    diastolic_bp:     Optional[float]
    temperature:      Optional[float]
    spo2:             Optional[float]
    resp_rate:        Optional[float]
    is_abnormal:      bool
    alert_triggered:  bool
    recorded_at:      datetime

    class Config:
        from_attributes = True


# ── Health Record schemas ─────────────────────────────────────
class HealthRecordCreate(BaseModel):
    record_type: str
    title:       str = Field(..., min_length=2, max_length=255)
    summary:     Optional[str] = None
    tags:        List[str]     = []


class HealthRecordResponse(BaseModel):
    id:          int
    record_type: str
    title:       str
    summary:     Optional[str]
    tags:        List[str]
    created_at:  datetime

    class Config:
        from_attributes = True


# ── Triage schemas ────────────────────────────────────────────
class TriageRequest(BaseModel):
    symptoms:    List[str]       = Field(..., min_length=1)
    patient_age: Optional[int]   = None
    duration_days: Optional[int] = None
    existing_conditions: List[str] = []


class TriageResponse(BaseModel):
    severity:       SeverityLevel
    severity_score: float
    analysis:       str
    recommendation: str
    should_visit_emergency: bool
    estimated_wait_category: str


# ── Analytics schemas ─────────────────────────────────────────
class AnalyticsOverview(BaseModel):
    total_patients:      int
    today_admissions:    int
    emergency_cases:     int
    avg_wait_time:       float
    bed_occupancy:       float
    appointments_today:  int
    discharged_today:    int
    doctors_on_duty:     int


# ── Chatbot schemas ───────────────────────────────────────────
class ChatMessage(BaseModel):
    role:    str   # "user" | "assistant"
    content: str


class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    language: str = "en"


class ChatResponse(BaseModel):
    reply:    str
    severity: Optional[str] = None
    action:   Optional[str] = None
