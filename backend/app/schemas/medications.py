"""
Aroviax — Medication Safety Validation Schemas
"""

from __future__ import annotations

from pydantic import BaseModel, Field


class MedicationItem(BaseModel):
    name: str = Field(..., min_length=1, max_length=150)
    instructions: str = Field(..., min_length=1, max_length=300)
    purpose: str | None = Field(default=None, max_length=200)
    is_active: bool = Field(default=True)


class MedicationSafetyRequest(BaseModel):
    medications: list[MedicationItem] = Field(..., min_length=1, max_length=20)


class MedicationSafetyWarning(BaseModel):
    severity: str  # "caution", "informative"
    title: str
    description: str
    suggested_pharmacist_question: str


class MedicationSafetyResponse(BaseModel):
    total_medications: int
    active_count: int
    warnings: list[MedicationSafetyWarning]
    general_guidance: list[str]
    questions_for_pharmacist: list[str]
    disclaimer: str
