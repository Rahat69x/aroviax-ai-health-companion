"""
Aroviax — AI Health Companion
Python FastAPI Backend Application Entrypoint

Clinical Governance:
- Non-diagnostic & non-prescriptive
- Emergency red flags screened proactively
- Privacy-first communication architecture
"""

from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.config import settings
from backend.app.routers import health, triage, terms, medications, chat

app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description=(
        "Aroviax AI Health Companion API — Provides symptom triage structuring, "
        "medical terminology plain-language translations, medication safety validation, "
        "and emergency safety screening."
    ),
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS setup for Next.js frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(health.router)
app.include_router(triage.router)
app.include_router(terms.router)
app.include_router(medications.router)
app.include_router(chat.router)


@app.get("/")
async def root():
    return {
        "project": "Aroviax — AI Health Companion",
        "description": "Python FastAPI Clinical Communication & AI Triage Engine",
        "documentation": "/docs",
        "api_v1": {
            "health": "/api/v1/health",
            "triage": "/api/v1/triage",
            "terms": "/api/v1/terms",
            "medications": "/api/v1/medications/validate",
            "chat": "/api/v1/chat",
        },
        "governance": settings.governance_disclaimer,
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("backend.app.main:app", host=settings.host, port=settings.port, reload=True)
