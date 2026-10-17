"""
Aroviax — Medical Term Translator Schemas
"""

from __future__ import annotations

from typing import Literal
from pydantic import BaseModel, Field


class TermLookupRequest(BaseModel):
    query: str = Field(..., min_length=2, max_length=200, description="Medical jargon or clinical term to simplify")
    locale: Literal["en", "bn"] = Field(default="en", description="Output language")


class TermLookupResponse(BaseModel):
    term: str
    simple_explanation: str
    everyday_analogy: str
    why_doctors_use_it: str
    questions_to_ask_clinician: list[str]
    locale: str
    disclaimer: str
