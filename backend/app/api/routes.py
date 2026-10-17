"""
Aroviax — Core API Routes

Implements the standard endpoints:
- GET /api/health
- POST /api/chat
"""

from __future__ import annotations

from fastapi import APIRouter, HTTPException, status
from backend.app.config import settings
from backend.app.schemas.chat import ChatRequest, ChatResponse, HealthResponse
from backend.app.services.ai_service import ai_service

router = APIRouter(prefix="/api", tags=["Aroviax Core API"])


@router.get("/health", response_model=HealthResponse)
async def api_health():
    """
    Returns health status of the backend without exposing secrets or private configurations.
    """
    return HealthResponse(
        status="ok",
        service=settings.service_name,
        ai_configured=settings.is_ai_configured(),
        ai_model=settings.ai_model if settings.is_ai_configured() else None,
        version=settings.app_version,
        emergency_interceptor_active=True,
        disclaimer=settings.governance_disclaimer,
    )


@router.post("/chat", response_model=ChatResponse)
async def api_chat(request: ChatRequest):
    """
    Processes a user's health-related question, supports conversation history,
    enforces emergency pre-emption, and returns structured clinical communication.
    """
    try:
        response = await ai_service.process_chat(request)
        return response
    except Exception as exc:
        # Prevent stack trace leakage; return clean 500
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred while processing your request. Please try again.",
        ) from exc
