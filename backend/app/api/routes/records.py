from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.models import HealthRecord, PatientProfile, User, UserRole
from app.schemas.schemas import HealthRecordCreate, HealthRecordResponse

router = APIRouter(prefix="/records", tags=["Health Records"])


@router.get("/{patient_id}", response_model=list)
async def get_patient_records(
    patient_id: int,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """Get all health records for a patient."""
    if current_user.role == UserRole.patient and current_user.id != patient_id:
        raise HTTPException(status_code=403, detail="Access denied")

    profile_result = await db.execute(
        select(PatientProfile).where(PatientProfile.user_id == patient_id)
    )
    profile = profile_result.scalar_one_or_none()
    if not profile:
        raise HTTPException(status_code=404, detail="Patient not found")

    result = await db.execute(
        select(HealthRecord)
        .where(HealthRecord.patient_id == profile.id)
        .order_by(HealthRecord.created_at.desc())
    )
    records = result.scalars().all()
    return [HealthRecordResponse.model_validate(r) for r in records]


@router.post("", response_model=HealthRecordResponse, status_code=201)
async def create_record(
    patient_id: int,
    data: HealthRecordCreate,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """Create a new health record for a patient."""
    profile_result = await db.execute(
        select(PatientProfile).where(PatientProfile.user_id == patient_id)
    )
    profile = profile_result.scalar_one_or_none()
    if not profile:
        raise HTTPException(status_code=404, detail="Patient not found")

    record = HealthRecord(
        patient_id=profile.id,
        doctor_id=current_user.id if current_user.role == UserRole.doctor else None,
        record_type=data.record_type,
        title=data.title,
        summary=data.summary,
        tags=data.tags,
    )
    db.add(record)
    await db.commit()
    await db.refresh(record)
    return HealthRecordResponse.model_validate(record)


@router.get("/detail/{record_id}", response_model=HealthRecordResponse)
async def get_record(
    record_id: int,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    result = await db.execute(select(HealthRecord).where(HealthRecord.id == record_id))
    record = result.scalar_one_or_none()
    if not record:
        raise HTTPException(status_code=404, detail="Record not found")
    return HealthRecordResponse.model_validate(record)
