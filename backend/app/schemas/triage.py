"""
Aroviax — Symptom Triage & Organization Schemas
"""

from __future__ import annotations

from pydantic import BaseModel, Field


class SymptomTriageRequest(BaseModel):
    main_concern: str = Field(..., min_length=2, max_length=500, description="Primary symptom or chief health concern")
    onset_description: str | None = Field(default=None, max_length=200, description="When the symptom started")
    severity_rating: int = Field(default=5, ge=1, le=10, description="Subjective severity rating (1=mild, 10=severe)")
    body_location: str | None = Field(default=None, max_length=150, description="Affected anatomical area")
    associated_symptoms: list[str] = Field(default_factory=list, description="Other symptoms occurring alongside")
    known_triggers: list[str] = Field(default_factory=list, description="Factors that aggravate the symptom")
    relieving_factors: list[str] = Field(default_factory=list, description="Factors that provide relief")


class SymptomTriageResponse(BaseModel):
    request_id: str
    is_emergency: bool
    emergency_warning: str | None = None
    urgency_tier: str  # "emergency", "prompt-care", "routine-consultation", "self-monitoring"
    organized_summary: str
    suggested_specialty: str
    questions_for_doctor: list[str]
    red_flag_warnings: list[str]
    what_cannot_be_assessed_online: list[str]
    disclaimer: str
