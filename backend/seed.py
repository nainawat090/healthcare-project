"""
Seed Script — populate the database with realistic demo data.
Run: python seed.py
"""
import asyncio
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from app.core.config import settings
from app.core.security import hash_password
from app.models.models import (
    User, DoctorProfile, PatientProfile, Appointment,
    HealthRecord, VitalRecord, Notification,
    UserRole, SeverityLevel, AppointmentStatus, PatientStatus
)
from app.core.database import Base
from datetime import datetime, timedelta

engine = create_async_engine(settings.DATABASE_URL, echo=False)
SessionLocal = async_sessionmaker(engine, expire_on_commit=False)


USERS = [
    # Admin
    {"email": "admin@hospital.com",      "password": "Admin@123",   "name": "Admin User",      "role": UserRole.admin,   "phone": "9876500001"},
    # Doctors
    {"email": "dr.sharma@hospital.com",  "password": "Doctor@123",  "name": "Dr. Raj Sharma",  "role": UserRole.doctor,  "phone": "9876500002"},
    {"email": "dr.gupta@hospital.com",   "password": "Doctor@123",  "name": "Dr. Priya Gupta", "role": UserRole.doctor,  "phone": "9876500003"},
    {"email": "dr.verma@hospital.com",   "password": "Doctor@123",  "name": "Dr. Anil Verma",  "role": UserRole.doctor,  "phone": "9876500004"},
    {"email": "dr.rao@hospital.com",     "password": "Doctor@123",  "name": "Dr. Sunita Rao",  "role": UserRole.doctor,  "phone": "9876500005"},
    # Patients
    {"email": "patient@demo.com",        "password": "Patient@123", "name": "Arjun Mehta",     "role": UserRole.patient, "phone": "9876500010"},
    {"email": "priya.s@demo.com",        "password": "Patient@123", "name": "Priya Singh",     "role": UserRole.patient, "phone": "9876500011"},
    {"email": "ravi.k@demo.com",         "password": "Patient@123", "name": "Ravi Kumar",      "role": UserRole.patient, "phone": "9876500012"},
    {"email": "anita.s@demo.com",        "password": "Patient@123", "name": "Anita Sharma",    "role": UserRole.patient, "phone": "9876500013"},
]

DOCTOR_PROFILES = [
    {"specialty": "Cardiology",       "experience_years": 12, "rating": 4.9, "consultation_fee": 800,  "available_today": True,  "bio": "Senior cardiologist with 12+ years experience in interventional cardiology."},
    {"specialty": "General Medicine", "experience_years": 8,  "rating": 4.7, "consultation_fee": 500,  "available_today": True,  "bio": "General physician specializing in preventive medicine and chronic disease management."},
    {"specialty": "Neurology",        "experience_years": 15, "rating": 4.8, "consultation_fee": 1000, "available_today": False, "bio": "Neurologist with expertise in epilepsy, stroke, and movement disorders."},
    {"specialty": "Pediatrics",       "experience_years": 10, "rating": 4.9, "consultation_fee": 600,  "available_today": True,  "bio": "Dedicated pediatrician providing compassionate care for children 0-18."},
]

PATIENT_PROFILES = [
    {"age": 32, "gender": "M", "blood_group": "O+",  "severity": SeverityLevel.low,      "status": PatientStatus.waiting, "queue_position": 4},
    {"age": 45, "gender": "F", "blood_group": "A+",  "severity": SeverityLevel.high,     "status": PatientStatus.in_care,  "queue_position": 1},
    {"age": 68, "gender": "M", "blood_group": "B-",  "severity": SeverityLevel.critical, "status": PatientStatus.emergency,"queue_position": 0},
    {"age": 27, "gender": "F", "blood_group": "AB+", "severity": SeverityLevel.medium,   "status": PatientStatus.waiting, "queue_position": 5},
]


async def seed():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("✅ Tables created")

    async with SessionLocal() as db:
        # Create users
        created_users = []
        for u in USERS:
            user = User(
                email=u["email"],
                hashed_password=hash_password(u["password"]),
                name=u["name"],
                role=u["role"],
                phone=u["phone"],
                is_active=True,
            )
            db.add(user)
            created_users.append(user)

        await db.flush()
        print(f"✅ Created {len(created_users)} users")

        # Doctor profiles (users index 1-4)
        doctor_users = [u for u in created_users if u.role == UserRole.doctor]
        for i, (doc_user, profile_data) in enumerate(zip(doctor_users, DOCTOR_PROFILES)):
            profile = DoctorProfile(user_id=doc_user.id, **profile_data)
            db.add(profile)

        # Patient profiles (users index 5-8)
        patient_users = [u for u in created_users if u.role == UserRole.patient]
        for i, (pat_user, profile_data) in enumerate(zip(patient_users, PATIENT_PROFILES)):
            profile = PatientProfile(user_id=pat_user.id, **profile_data)
            db.add(profile)

        await db.flush()
        print("✅ Created doctor and patient profiles")

        # Sample appointments
        if len(patient_users) >= 2 and len(doctor_users) >= 2:
            for i, (pat, doc) in enumerate(zip(patient_users[:3], doctor_users[:3])):
                appt = Appointment(
                    patient_id=pat.id,
                    doctor_id=doc.id,
                    appointment_date=datetime.now() + timedelta(days=i+1, hours=10),
                    appointment_type="General Checkup",
                    status=AppointmentStatus.confirmed,
                    symptoms=["Fatigue", "Headache"],
                    notes="Routine follow-up",
                )
                db.add(appt)

        # Sample notifications
        if created_users:
            db.add(Notification(
                user_id=created_users[0].id,
                type="emergency",
                title="Critical Alert",
                message="Patient Ravi Kumar — vitals critical, ICU required.",
                is_read=False,
            ))

        await db.commit()
        print("✅ Appointments and notifications seeded")
        print("\n🎉 Seed complete! Demo credentials:")
        print("   Admin:   admin@hospital.com / Admin@123")
        print("   Doctor:  dr.sharma@hospital.com / Doctor@123")
        print("   Patient: patient@demo.com / Patient@123")


if __name__ == "__main__":
    asyncio.run(seed())
