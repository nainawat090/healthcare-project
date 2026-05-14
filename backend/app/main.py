"""
MediAI Healthcare Platform — FastAPI Backend
============================================
Entry point: uvicorn app.main:app --reload --port 8000
API docs:    http://localhost:8000/docs
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from contextlib import asynccontextmanager
import logging

from app.core.config import settings
from app.core.database import engine, Base

# Import all models so Alembic can discover them
from app.models import models  # noqa: F401

# Import routers
from app.api.routes import (
    auth,
    patients,
    appointments,
    triage,
    chatbot,
    analytics,
    doctors,
    records,
    websocket,
)

logger = logging.getLogger(__name__)


# ── Lifespan (startup / shutdown) ─────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("🏥 MediAI Backend starting up...")
    async with engine.begin() as conn:
        # Create tables if they don't exist (dev mode)
        if settings.ENVIRONMENT == "development":
            await conn.run_sync(Base.metadata.create_all)
            logger.info("✅ Database tables created/verified")
    yield
    # Shutdown
    logger.info("🔴 MediAI Backend shutting down")
    await engine.dispose()


# ── App instance ──────────────────────────────────────────────
app = FastAPI(
    title=settings.APP_NAME,
    description="AI-Powered Healthcare Automation & Smart Patient Management System",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# ── Middleware ────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(GZipMiddleware, minimum_size=1000)

# ── API Router prefix ─────────────────────────────────────────
API_PREFIX = f"/api/{settings.API_VERSION}"

app.include_router(auth.router,         prefix=API_PREFIX)
app.include_router(patients.router,     prefix=API_PREFIX)
app.include_router(appointments.router, prefix=API_PREFIX)
app.include_router(triage.router,       prefix=API_PREFIX)
app.include_router(chatbot.router,      prefix=API_PREFIX)
app.include_router(analytics.router,    prefix=API_PREFIX)
app.include_router(doctors.router,      prefix=API_PREFIX)
app.include_router(records.router,      prefix=API_PREFIX)
app.include_router(websocket.router,    prefix=API_PREFIX)


# ── Health check ──────────────────────────────────────────────
@app.get("/health", tags=["Health"])
async def health_check():
    return {
        "status":  "healthy",
        "app":     settings.APP_NAME,
        "version": "1.0.0",
        "env":     settings.ENVIRONMENT,
    }


@app.get("/", tags=["Root"])
async def root():
    return {
        "message": "MediAI Healthcare API",
        "docs":    "/docs",
        "version": "1.0.0",
    }
