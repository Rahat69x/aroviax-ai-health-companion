"""
Aroviax — AI Health Companion Backend Configuration
"""

from __future__ import annotations

import os
from pydantic import BaseModel


class Settings(BaseModel):
    app_name: str = "Aroviax AI Health Companion Backend"
    app_version: str = "1.0.0"
    api_prefix: str = "/api/v1"
    host: str = os.getenv("HOST", "0.0.0.0")
    port: int = int(os.getenv("PORT", "8000"))
    environment: str = os.getenv("ENVIRONMENT", "development")
    cors_origins: list[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
    ]
    openai_api_key: str | None = os.getenv("OPENAI_API_KEY")
    gemini_api_key: str | None = os.getenv("GEMINI_API_KEY")
    governance_disclaimer: str = (
        "Informational Support Only: Aroviax is not a licensed physician and does not "
        "provide medical diagnoses, prescriptions, or clinical treatments. Always consult "
        "a qualified healthcare provider for personalized medical evaluation."
    )


settings = Settings()
