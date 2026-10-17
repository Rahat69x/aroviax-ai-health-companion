"""
Aroviax — AI Health Companion Backend Configuration
"""

from __future__ import annotations

import os
from pydantic import BaseModel, Field


class Settings(BaseModel):
    app_name: str = "Aroviax AI Health Companion Backend"
    service_name: str = "aroviax-api"
    app_version: str = "1.0.0"
    environment: str = os.getenv("ENVIRONMENT", "development")
    host: str = os.getenv("HOST", "127.0.0.1")
    port: int = int(os.getenv("PORT", "8000"))

    # CORS configuration
    frontend_origin: str = os.getenv("FRONTEND_ORIGIN", "http://localhost:3000")
    cors_origins: list[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
    ]

    # AI Provider configuration
    # Can be set via AI_API_KEY, OPENAI_API_KEY, or GEMINI_API_KEY
    ai_api_key: str | None = (
        os.getenv("AI_API_KEY")
        or os.getenv("OPENAI_API_KEY")
        or os.getenv("GEMINI_API_KEY")
    )
    ai_model: str = os.getenv("AI_MODEL", "gpt-4o-mini")
    ai_provider_type: str = os.getenv("AI_PROVIDER", "openai")  # openai, gemini, mock
    ai_timeout_seconds: float = float(os.getenv("AI_TIMEOUT_SECONDS", "8.0"))

    # Medical Governance Disclaimer
    governance_disclaimer: str = (
        "Aroviax provides general health information and is not a substitute for "
        "professional medical advice, diagnosis, or treatment. In an emergency, "
        "contact local emergency services."
    )

    def is_ai_configured(self) -> bool:
        return bool(self.ai_api_key and self.ai_api_key.strip())


settings = Settings()
