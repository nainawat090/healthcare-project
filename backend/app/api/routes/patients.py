from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import Optional
from app.core.database import get_db
from app.core.security import get_current_user, require_role
from app.models.models import User, PatientProfile, VitalRecord, UserRole
from app.schemas.schemas import VitalCreate, VitalResponse
from app.schemas.auth import PatientProfileResponse
from app.utils.vitals import check_vitals_abnormal

router = APIRouter(prefix="/patients", tags=["Patients"])


@router.get("", response_model=list)
async def list_patients(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    search: Optional[str] = None,
    severity: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(require_role("admin", "doctor")),
):
    """List all patients (admin/doctor only)."""
    query = select(User, PatientProfile).join(
        PatientProfile, PatientProfile.user_id == User.id, isouter=True
    ).where(User.role == UserRole.patient)

    if search:
        query = query.where(User.name.ilike(f"%{search}%"))
    if severity:
        query = query.where(PatientProfile.severity == severity.lower())

    query = query.offset(skip).limit(limit)
    result = await db.execute(query)
    rows = result.all()

    patients = []
    for user, profile in rows:
        patients.append({
            "id":        user.id,
            "name":      user.name,
            "email":     user.email,
            "phone":     user.phone,
            "age":       profile.age if profile else None,
            "blood_group": profile.blood_group if profile else None,
            "severity":  profile.severity.value if profile else "low",
            "status":    profile.status.value if profile else "waiting",
            "queue_position": profile.queue_position if profile else 0,
            "risk_score": profile.risk_score if profile else 0.0,
        })
    return patients


@router.get("/{patient_id}")
async def get_patient(
    patient_id: int,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """Get a single patient. Patients can only view themselves."""
    if current_user.role == UserRole.patient and current_user.id != patient_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")

    result = await db.execute(
        select(User, PatientProfile)
        .join(PatientProfile, PatientProfile.user_id == User.id, isouter=True)
        .where(User.id == patient_id)
    )
    row = result.first()
    if not row:
        raise HTTPException(status_code=404, detail="Patient not found")

    user, profile = row
    return {
        "id":    user.id,
        "name":  user.name,
        "email": user.email,
        "phone": user.phone,
        "age":   profile.age if profile else None,
        "gender": profile.gender if profile else None,
        "blood_group":  profile.blood_group if profile else None,
        "allergies":    profile.allergies if profile else [],
        "chronic_conditions": profile.chronic_conditions if profile else [],
        "severity":     profile.severity.value if profile else "low",
        "status":       profile.status.value if profile else "waiting",
        "risk_score":   profile.risk_score if profile else 0.0,
    }


@router.get("/{patient_id}/vitals", response_model=list)
async def get_patient_vitals(
    patient_id: int,
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """Get recent vitals for a patient."""
    if current_user.role == UserRole.patient and current_user.id != patient_id:
        raise HTTPException(status_code=403, detail="Access denied")

    # Get patient profile id
    profile_result = await db.execute(
        select(PatientProfile).where(PatientProfile.user_id == patient_id)
    )
    profile = profile_result.scalar_one_or_none()
    if not profile:
        raise HTTPException(status_code=404, detail="Patient profile not found")

    result = await db.execute(
        select(VitalRecord)
        .where(VitalRecord.patient_id == profile.id)
        .order_by(VitalRecord.recorded_at.desc())
        .limit(limit)
    )
    vitals = result.scalars().all()
    return [VitalResponse.model_validate(v) for v in vitals]


@router.post("/{patient_id}/vitals", response_model=VitalResponse, status_code=201)
async def record_vitals(
    patient_id: int,
    data: VitalCreate,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """Record new vitals for a patient (IoT / manual entry)."""
    profile_result = await db.execute(
        select(PatientProfile).where(PatientProfile.user_id == patient_id)
    )
    profile = profile_result.scalar_one_or_none()
    if not profile:
        raise HTTPException(status_code=404, detail="Patient profile not found")

    is_abnormal, alert = check_vitals_abnormal(data)

    vital = VitalRecord(
        patient_id=profile.id,
        heart_rate=data.heart_rate,
        systolic_bp=data.systolic_bp,
        diastolic_bp=data.diastolic_bp,
        temperature=data.temperature,
        spo2=data.spo2,
        resp_rate=data.resp_rate,
        is_abnormal=is_abnormal,
        alert_triggered=alert,
    )
    db.add(vital)
    await db.commit()
    await db.refresh(vital)
    return VitalResponse.model_validate(vital)
