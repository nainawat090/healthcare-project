from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Optional
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.models import User, DoctorProfile, UserRole

router = APIRouter(prefix="/doctors", tags=["Doctors"])


@router.get("")
async def list_doctors(
    specialty: Optional[str] = None,
    available: Optional[bool] = None,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """List all doctors with optional filters."""
    query = (
        select(User, DoctorProfile)
        .join(DoctorProfile, DoctorProfile.user_id == User.id, isouter=True)
        .where(User.role == UserRole.doctor, User.is_active == True)
    )
    if specialty:
        query = query.where(DoctorProfile.specialty.ilike(f"%{specialty}%"))
    if available is not None:
        query = query.where(DoctorProfile.available_today == available)

    result = await db.execute(query)
    rows = result.all()

    return [
        {
            "id":               user.id,
            "name":             user.name,
            "email":            user.email,
            "specialty":        profile.specialty if profile else None,
            "experience_years": profile.experience_years if profile else 0,
            "rating":           profile.rating if profile else 4.5,
            "available_today":  profile.available_today if profile else False,
            "consultation_fee": profile.consultation_fee if profile else 500,
            "bio":              profile.bio if profile else None,
        }
        for user, profile in rows
    ]


@router.get("/{doctor_id}")
async def get_doctor(
    doctor_id: int,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    result = await db.execute(
        select(User, DoctorProfile)
        .join(DoctorProfile, DoctorProfile.user_id == User.id, isouter=True)
        .where(User.id == doctor_id, User.role == UserRole.doctor)
    )
    row = result.first()
    if not row:
        raise HTTPException(status_code=404, detail="Doctor not found")

    user, profile = row
    return {
        "id":               user.id,
        "name":             user.name,
        "email":            user.email,
        "phone":            user.phone,
        "specialty":        profile.specialty if profile else None,
        "experience_years": profile.experience_years if profile else 0,
        "rating":           profile.rating if profile else 4.5,
        "available_today":  profile.available_today if profile else False,
        "consultation_fee": profile.consultation_fee if profile else 500,
        "bio":              profile.bio if profile else None,
    }


@router.get("/{doctor_id}/patients")
async def get_doctor_patients(
    doctor_id: int,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """Get all patients assigned to a doctor (via appointments)."""
    from app.models.models import Appointment, PatientProfile
    result = await db.execute(
        select(User, PatientProfile)
        .join(PatientProfile, PatientProfile.user_id == User.id, isouter=True)
        .join(Appointment, Appointment.patient_id == User.id)
        .where(Appointment.doctor_id == doctor_id)
        .distinct()
    )
    rows = result.all()
    return [
        {
            "id":          user.id,
            "name":        user.name,
            "age":         profile.age if profile else None,
            "blood_group": profile.blood_group if profile else None,
            "severity":    profile.severity.value if profile else "low",
            "status":      profile.status.value if profile else "waiting",
        }
        for user, profile in rows
    ]
