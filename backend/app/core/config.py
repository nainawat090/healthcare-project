from pydantic_settings import BaseSettings
from pydantic import AnyHttpUrl
from typing import List, Optional
import json


class Settings(BaseSettings):
    # ── App ──────────────────────────────────────────────────
    APP_NAME: str = "MediAI Healthcare Platform"
    API_VERSION: str = "v1"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True

    # ── Security ─────────────────────────────────────────────
    SECRET_KEY: str = "dev-secret-key-change-in-production-minimum-32-chars"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # ── Database ─────────────────────────────────────────────
    DATABASE_URL: str = "postgresql+asyncpg://healthcare_user:healthcare_pass@localhost:5432/healthcare_db"
    SYNC_DATABASE_URL: str = "postgresql://healthcare_user:healthcare_pass@localhost:5432/healthcare_db"

    # ── CORS ─────────────────────────────────────────────────
    CORS_ORIGINS: str = '["http://localhost:3000","http://localhost:5173"]'

    @property
    def cors_origins_list(self) -> List[str]:
        try:
            return json.loads(self.CORS_ORIGINS)
        except Exception:
            return ["http://localhost:3000"]

    # ── AI ───────────────────────────────────────────────────
    GEMINI_API_KEY: Optional[str] = None

    class Config:
        env_file = ".env"
        case_sensitive = True
        extra = "ignore"   # ignore POSTGRES_USER / POSTGRES_PASSWORD / POSTGRES_DB etc.


settings = Settings()
