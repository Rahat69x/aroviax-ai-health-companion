"""
Aroviax — Triage Router
"""

from __future__ import annotations

from fastapi import APIRouter
from backend.app.schemas.triage import SymptomTriageRequest, SymptomTriageResponse
from backend.app.services.triage_engine import organize_symptoms

router = APIRouter(prefix="/api/v1/triage", tags=["Symptom Triage"])


@router.post("", response_model=SymptomTriageResponse)
async def triage_symptoms(request: SymptomTriageRequest):
    """
    Organizes symptoms into a structured dossier with urgency classification and doctor questions.
    """
    return organize_symptoms(request)
