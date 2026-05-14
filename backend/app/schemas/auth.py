from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import Optional
from datetime import datetime
from app.models.models import UserRole


# ── Auth schemas ──────────────────────────────────────────────
class LoginRequest(BaseModel):
    email:    EmailStr
    password: str = Field(..., min_length=6)


class RegisterRequest(BaseModel):
    email:      EmailStr
    password:   str       = Field(..., min_length=6)
    name:       str       = Field(..., min_length=2, max_length=100)
    phone:      Optional[str] = None
    role:       UserRole  = UserRole.patient
    # patient fields
    age:        Optional[int] = None
    gender:     Optional[str] = None
    blood_group: Optional[str] = None
    # doctor fields
    specialty:      Optional[str] = None
    experience_years: Optional[int] = None

    @field_validator("password")
    @classmethod
    def validate_password(cls, v):
        if len(v) < 6:
            raise ValueError("Password must be at least 6 characters")
        return v


class TokenResponse(BaseModel):
    access_token:  str
    refresh_token: str
    token_type:    str = "bearer"
    user:          "UserResponse"


class RefreshRequest(BaseModel):
    refresh_token: str


# ── User schemas ──────────────────────────────────────────────
class UserBase(BaseModel):
    email:    EmailStr
    name:     str
    phone:    Optional[str] = None
    role:     UserRole


class UserResponse(BaseModel):
    id:         int
    email:      str
    name:       str
    phone:      Optional[str]
    role:       UserRole
    is_active:  bool
    created_at: Optional[datetime]

    class Config:
        from_attributes = True


class UserUpdate(BaseModel):
    name:  Optional[str]  = None
    phone: Optional[str]  = None


# ── Doctor Profile schemas ────────────────────────────────────
class DoctorProfileResponse(BaseModel):
    id:               int
    specialty:        Optional[str]
    experience_years: Optional[int]
    qualification:    Optional[str]
    department:       Optional[str]
    consultation_fee: Optional[float]
    rating:           Optional[float]
    bio:              Optional[str]
    available_today:  bool
    user:             UserResponse

    class Config:
        from_attributes = True


# ── Patient Profile schemas ───────────────────────────────────
class PatientProfileResponse(BaseModel):
    id:                 int
    age:                Optional[int]
    gender:             Optional[str]
    blood_group:        Optional[str]
    allergies:          Optional[list]
    chronic_conditions: Optional[list]
    severity:           str
    status:             str
    queue_position:     int
    risk_score:         float
    user:               UserResponse

    class Config:
        from_attributes = True


# Forward reference update
TokenResponse.model_rebuild()
