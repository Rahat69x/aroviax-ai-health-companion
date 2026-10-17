"""
Aroviax — Medication Safety Router
"""

from __future__ import annotations

from fastapi import APIRouter
from backend.app.schemas.medications import (
    MedicationSafetyRequest,
    MedicationSafetyResponse,
)
from backend.app.services.medication_guard import inspect_medications

router = APIRouter(prefix="/api/v1/medications", tags=["Medications"])


@router.post("/validate", response_model=MedicationSafetyResponse)
async def validate_medications(request: MedicationSafetyRequest):
    """
    Validates a list of medications for duplicates, NSAID layering, and generates pharmacist questions.
    """
    return inspect_medications(request.medications)
