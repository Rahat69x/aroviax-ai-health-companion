"""
Aroviax — Medical Term Explanation Router
"""

from __future__ import annotations

from typing import Literal
from fastapi import APIRouter, Query
from backend.app.schemas.terms import TermLookupRequest, TermLookupResponse
from backend.app.services.term_engine import explain_medical_term
from backend.app.config import settings

router = APIRouter(prefix="/api/v1/terms", tags=["Medical Terms"])


@router.get("", response_model=TermLookupResponse)
async def lookup_term_get(
    query: str = Query(..., min_length=2, max_length=200, description="Medical jargon to translate"),
    locale: Literal["en", "bn"] = Query(default="en", description="Output language"),
):
    """
    Look up a medical term and receive an accessible explanation, analogy, and clinician questions.
    """
    res = explain_medical_term(query, locale=locale)
    return TermLookupResponse(
        term=str(res["term"]),
        simple_explanation=str(res["simple_explanation"]),
        everyday_analogy=str(res["everyday_analogy"]),
        why_doctors_use_it=str(res["why_doctors_use_it"]),
        questions_to_ask_clinician=list(res["questions_to_ask_clinician"]),  # type: ignore
        locale=str(res["locale"]),
        disclaimer=settings.governance_disclaimer,
    )


@router.post("/explain", response_model=TermLookupResponse)
async def lookup_term_post(request: TermLookupRequest):
    """
    POST variant for term lookup.
    """
    res = explain_medical_term(request.query, locale=request.locale)
    return TermLookupResponse(
        term=str(res["term"]),
        simple_explanation=str(res["simple_explanation"]),
        everyday_analogy=str(res["everyday_analogy"]),
        why_doctors_use_it=str(res["why_doctors_use_it"]),
        questions_to_ask_clinician=list(res["questions_to_ask_clinician"]),  # type: ignore
        locale=str(res["locale"]),
        disclaimer=settings.governance_disclaimer,
    )
