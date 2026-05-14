from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.security import get_current_user
from app.schemas.schemas import TriageRequest, TriageResponse
from app.services.triage_service import analyze_triage

router = APIRouter(prefix="/triage", tags=["Triage"])


@router.post("/analyze", response_model=TriageResponse)
async def analyze_symptoms(
    data: TriageRequest,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """
    AI-powered symptom severity analysis.
    Returns severity level, score, analysis text, and recommendation.
    """
    return await analyze_triage(data)


@router.get("/queue")
async def get_queue(
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """Get the current patient queue sorted by severity."""
    from sqlalchemy import select
    from app.models.models import User, PatientProfile, PatientStatus

    result = await db.execute(
        select(User, PatientProfile)
        .join(PatientProfile, PatientProfile.user_id == User.id)
        .where(PatientProfile.status.in_([PatientStatus.waiting, PatientStatus.in_care]))
        .order_by(PatientProfile.queue_position)
    )
    rows = result.all()

    queue = []
    for user, profile in rows:
        queue.append({
            "position":   profile.queue_position,
            "patient_id": user.id,
            "name":       user.name,
            "severity":   profile.severity.value,
            "status":     profile.status.value,
            "risk_score": profile.risk_score,
        })
    return queue


@router.get("/emergency")
async def get_emergency_cases(
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """Get all CRITICAL and HIGH severity patients."""
    from sqlalchemy import select
    from app.models.models import User, PatientProfile, SeverityLevel

    result = await db.execute(
        select(User, PatientProfile)
        .join(PatientProfile, PatientProfile.user_id == User.id)
        .where(PatientProfile.severity.in_([SeverityLevel.critical, SeverityLevel.high]))
        .order_by(PatientProfile.severity.desc())
    )
    rows = result.all()

    cases = []
    for user, profile in rows:
        cases.append({
            "patient_id":  user.id,
            "name":        user.name,
            "age":         profile.age,
            "blood_group": profile.blood_group,
            "severity":    profile.severity.value,
            "status":      profile.status.value,
            "risk_score":  profile.risk_score,
        })
    return cases
