from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import HTTPException, status
from app.models.models import User, DoctorProfile, PatientProfile, UserRole
from app.schemas.auth import RegisterRequest, LoginRequest, TokenResponse
from app.core.security import hash_password, verify_password, create_access_token, create_refresh_token


async def register_user(db: AsyncSession, data: RegisterRequest) -> User:
    """Create a new user with role-specific profile."""
    # Check duplicate email
    result = await db.execute(select(User).where(User.email == data.email.lower()))
    if result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Create user
    user = User(
        email=data.email.lower(),
        hashed_password=hash_password(data.password),
        name=data.name,
        phone=data.phone,
        role=data.role,
    )
    db.add(user)
    await db.flush()  # get user.id without committing

    # Create role-specific profile
    if data.role == UserRole.doctor:
        profile = DoctorProfile(
            user_id=user.id,
            specialty=data.specialty,
            experience_years=data.experience_years or 0,
        )
        db.add(profile)

    elif data.role == UserRole.patient:
        profile = PatientProfile(
            user_id=user.id,
            age=data.age,
            gender=data.gender,
            blood_group=data.blood_group,
        )
        db.add(profile)

    await db.commit()
    await db.refresh(user)
    return user


async def authenticate_user(db: AsyncSession, data: LoginRequest) -> TokenResponse:
    """Validate credentials and return JWT tokens."""
    result = await db.execute(select(User).where(User.email == data.email.lower()))
    user = result.scalar_one_or_none()

    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Account is inactive")

    token_data = {"sub": str(user.id), "role": user.role.value, "email": user.email}
    access_token  = create_access_token(token_data)
    refresh_token = create_refresh_token(token_data)

    from app.schemas.auth import UserResponse
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        user=UserResponse.model_validate(user),
    )
