from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Optional
from datetime import datetime
from app.core.database import get_db
from app.core.security import get_current_user, require_role
from app.models.models import Appointment, AppointmentStatus, User, UserRole
from app.schemas.schemas import AppointmentCreate, AppointmentUpdate, AppointmentResponse

router = APIRouter(prefix="/appointments", tags=["Appointments"])


@router.get("", response_model=list)
async def list_appointments(
    skip:   int = Query(0, ge=0),
    limit:  int = Query(20, ge=1, le=100),
    status: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """
    List appointments.
    - Patient: their own appointments only
    - Doctor:  appointments where they are the doctor
    - Admin:   all appointments
    """
    query = select(Appointment)

    if current_user.role == UserRole.patient:
        query = query.where(Appointment.patient_id == current_user.id)
    elif current_user.role == UserRole.doctor:
        query = query.where(Appointment.doctor_id == current_user.id)

    if status:
        query = query.where(Appointment.status == status)

    query = query.order_by(Appointment.appointment_date.desc()).offset(skip).limit(limit)
    result = await db.execute(query)
    appts = result.scalars().all()
    return [AppointmentResponse.model_validate(a) for a in appts]


@router.post("", response_model=AppointmentResponse, status_code=201)
async def create_appointment(
    data: AppointmentCreate,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """Book a new appointment."""
    # Verify doctor exists
    doc_result = await db.execute(
        select(User).where(User.id == data.doctor_id, User.role == UserRole.doctor)
    )
    if not doc_result.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="Doctor not found")

    appt = Appointment(
        patient_id=current_user.id,
        doctor_id=data.doctor_id,
        appointment_date=data.appointment_date,
        appointment_type=data.appointment_type,
        duration_minutes=data.duration_minutes,
        notes=data.notes,
        symptoms=data.symptoms,
        status=AppointmentStatus.pending,
    )
    db.add(appt)
    await db.commit()
    await db.refresh(appt)
    return AppointmentResponse.model_validate(appt)


@router.get("/{appt_id}", response_model=AppointmentResponse)
async def get_appointment(
    appt_id: int,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    result = await db.execute(select(Appointment).where(Appointment.id == appt_id))
    appt = result.scalar_one_or_none()
    if not appt:
        raise HTTPException(status_code=404, detail="Appointment not found")

    # Access control
    if current_user.role == UserRole.patient and appt.patient_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")
    if current_user.role == UserRole.doctor and appt.doctor_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")

    return AppointmentResponse.model_validate(appt)


@router.put("/{appt_id}", response_model=AppointmentResponse)
async def update_appointment(
    appt_id: int,
    data: AppointmentUpdate,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    result = await db.execute(select(Appointment).where(Appointment.id == appt_id))
    appt = result.scalar_one_or_none()
    if not appt:
        raise HTTPException(status_code=404, detail="Appointment not found")

    for field, value in data.model_dump(exclude_none=True).items():
        setattr(appt, field, value)

    await db.commit()
    await db.refresh(appt)
    return AppointmentResponse.model_validate(appt)


@router.patch("/{appt_id}/cancel", response_model=AppointmentResponse)
async def cancel_appointment(
    appt_id: int,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    result = await db.execute(select(Appointment).where(Appointment.id == appt_id))
    appt = result.scalar_one_or_none()
    if not appt:
        raise HTTPException(status_code=404, detail="Appointment not found")

    if current_user.role == UserRole.patient and appt.patient_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")

    appt.status = AppointmentStatus.cancelled
    await db.commit()
    await db.refresh(appt)
    return AppointmentResponse.model_validate(appt)
