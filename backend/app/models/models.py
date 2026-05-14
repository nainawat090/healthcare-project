from sqlalchemy import (
    Column, Integer, String, Text, Boolean, Float,
    DateTime, ForeignKey, Enum as SAEnum, JSON
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base
import enum


# ── Enums ─────────────────────────────────────────────────────
class UserRole(str, enum.Enum):
    admin   = "admin"
    doctor  = "doctor"
    patient = "patient"


class SeverityLevel(str, enum.Enum):
    low      = "LOW"
    medium   = "MEDIUM"
    high     = "HIGH"
    critical = "CRITICAL"


class AppointmentStatus(str, enum.Enum):
    pending    = "pending"
    confirmed  = "confirmed"
    completed  = "completed"
    cancelled  = "cancelled"
    no_show    = "no_show"


class PatientStatus(str, enum.Enum):
    waiting    = "waiting"
    in_care    = "in_care"
    admitted   = "admitted"
    discharged = "discharged"
    emergency  = "emergency"


# ── User ──────────────────────────────────────────────────────
class User(Base):
    __tablename__ = "users"

    id              = Column(Integer, primary_key=True, index=True)
    email           = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    name            = Column(String(255), nullable=False)
    phone           = Column(String(20))
    role            = Column(SAEnum(UserRole), default=UserRole.patient, nullable=False)
    is_active       = Column(Boolean, default=True)
    created_at      = Column(DateTime(timezone=True), server_default=func.now())
    updated_at      = Column(DateTime(timezone=True), onupdate=func.now())

    doctor_profile       = relationship("DoctorProfile",  back_populates="user", uselist=False, cascade="all, delete-orphan")
    patient_profile      = relationship("PatientProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    patient_appointments = relationship("Appointment", back_populates="patient", foreign_keys="Appointment.patient_id")
    doctor_appointments  = relationship("Appointment", back_populates="doctor",  foreign_keys="Appointment.doctor_id")
    notifications        = relationship("Notification", back_populates="user", cascade="all, delete-orphan")


# ── Doctor Profile ─────────────────────────────────────────────
class DoctorProfile(Base):
    __tablename__ = "doctor_profiles"

    id               = Column(Integer, primary_key=True, index=True)
    user_id          = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    specialty        = Column(String(100))
    experience_years = Column(Integer, default=0)
    qualification    = Column(String(255))
    license_number   = Column(String(100))
    department       = Column(String(100))
    consultation_fee = Column(Float, default=500.0)
    rating           = Column(Float, default=4.5)
    bio              = Column(Text)
    available_today  = Column(Boolean, default=True)

    user           = relationship("User", back_populates="doctor_profile")
    availabilities = relationship("DoctorAvailability", back_populates="doctor", cascade="all, delete-orphan")


# ── Patient Profile ────────────────────────────────────────────
class PatientProfile(Base):
    __tablename__ = "patient_profiles"

    id                 = Column(Integer, primary_key=True, index=True)
    user_id            = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    age                = Column(Integer)
    gender             = Column(String(10))
    blood_group        = Column(String(5))
    address            = Column(Text)
    emergency_contact  = Column(String(20))
    allergies          = Column(JSON, default=list)
    chronic_conditions = Column(JSON, default=list)
    severity           = Column(SAEnum(SeverityLevel), default=SeverityLevel.low)
    status             = Column(SAEnum(PatientStatus), default=PatientStatus.waiting)
    queue_position     = Column(Integer, default=0)
    risk_score         = Column(Float, default=0.0)

    user               = relationship("User", back_populates="patient_profile")
    vitals             = relationship("VitalRecord",      back_populates="patient", cascade="all, delete-orphan")
    health_records     = relationship("HealthRecord",     back_populates="patient", cascade="all, delete-orphan")
    triage_assessments = relationship("TriageAssessment", back_populates="patient", cascade="all, delete-orphan")


# ── Appointment ────────────────────────────────────────────────
class Appointment(Base):
    __tablename__ = "appointments"

    id               = Column(Integer, primary_key=True, index=True)
    patient_id       = Column(Integer, ForeignKey("users.id"), nullable=False)
    doctor_id        = Column(Integer, ForeignKey("users.id"), nullable=False)
    appointment_date = Column(DateTime(timezone=True), nullable=False)
    duration_minutes = Column(Integer, default=30)
    appointment_type = Column(String(100), default="General Checkup")
    status           = Column(SAEnum(AppointmentStatus), default=AppointmentStatus.pending)
    notes            = Column(Text)
    doctor_notes     = Column(Text)
    symptoms         = Column(JSON, default=list)
    created_at       = Column(DateTime(timezone=True), server_default=func.now())
    updated_at       = Column(DateTime(timezone=True), onupdate=func.now())

    patient = relationship("User", back_populates="patient_appointments", foreign_keys=[patient_id])
    doctor  = relationship("User", back_populates="doctor_appointments",  foreign_keys=[doctor_id])


# ── Vital Records ──────────────────────────────────────────────
class VitalRecord(Base):
    __tablename__ = "vital_records"

    id              = Column(Integer, primary_key=True, index=True)
    patient_id      = Column(Integer, ForeignKey("patient_profiles.id", ondelete="CASCADE"), nullable=False)
    heart_rate      = Column(Float)
    systolic_bp     = Column(Float)
    diastolic_bp    = Column(Float)
    temperature     = Column(Float)
    spo2            = Column(Float)
    resp_rate       = Column(Float)
    is_abnormal     = Column(Boolean, default=False)
    alert_triggered = Column(Boolean, default=False)
    recorded_at     = Column(DateTime(timezone=True), server_default=func.now())

    patient = relationship("PatientProfile", back_populates="vitals")


# ── Health Records ─────────────────────────────────────────────
class HealthRecord(Base):
    __tablename__ = "health_records"

    id          = Column(Integer, primary_key=True, index=True)
    patient_id  = Column(Integer, ForeignKey("patient_profiles.id", ondelete="CASCADE"), nullable=False)
    doctor_id   = Column(Integer, ForeignKey("users.id"), nullable=True)
    record_type = Column(String(50))
    title       = Column(String(255), nullable=False)
    summary     = Column(Text)
    file_path   = Column(String(500))
    tags        = Column(JSON, default=list)
    created_at  = Column(DateTime(timezone=True), server_default=func.now())

    patient = relationship("PatientProfile", back_populates="health_records")


# ── Triage Assessment ──────────────────────────────────────────
class TriageAssessment(Base):
    __tablename__ = "triage_assessments"

    id             = Column(Integer, primary_key=True, index=True)
    patient_id     = Column(Integer, ForeignKey("patient_profiles.id", ondelete="CASCADE"), nullable=False)
    symptoms       = Column(JSON, nullable=False)
    severity       = Column(SAEnum(SeverityLevel), nullable=False)
    severity_score = Column(Float, default=0.0)
    ai_analysis    = Column(Text)
    recommendation = Column(Text)
    assessed_by    = Column(String(20), default="AI")
    created_at     = Column(DateTime(timezone=True), server_default=func.now())

    patient = relationship("PatientProfile", back_populates="triage_assessments")


# ── Doctor Availability ────────────────────────────────────────
class DoctorAvailability(Base):
    __tablename__ = "doctor_availability"

    id                    = Column(Integer, primary_key=True, index=True)
    doctor_id             = Column(Integer, ForeignKey("doctor_profiles.id", ondelete="CASCADE"), nullable=False)
    day_of_week           = Column(Integer)
    start_time            = Column(String(5))
    end_time              = Column(String(5))
    slot_duration_minutes = Column(Integer, default=30)
    is_available          = Column(Boolean, default=True)

    doctor = relationship("DoctorProfile", back_populates="availabilities")


# ── Notification ──────────────────────────────────────────────
class Notification(Base):
    __tablename__ = "notifications"

    id         = Column(Integer, primary_key=True, index=True)
    user_id    = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    type       = Column(String(50))
    title      = Column(String(255), nullable=False)
    message    = Column(Text, nullable=False)
    is_read    = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="notifications")
