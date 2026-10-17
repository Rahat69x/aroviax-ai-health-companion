"""
Aroviax — Health & Status Router
"""

from __future__ import annotations

import time
from fastapi import APIRouter
from backend.app.config import settings

router = APIRouter(tags=["Health"])
START_TIME = time.time()


@router.get("/health")
@router.get("/api/v1/health")
async def health_check():
    """
    Service health check endpoint with governance disclaimer and uptime.
    """
    uptime_seconds = int(time.time() - START_TIME)
    return {
        "status": "healthy",
        "service": settings.app_name,
        "version": settings.app_version,
        "environment": settings.environment,
        "uptime_seconds": uptime_seconds,
        "governance_mode": "non-diagnostic",
        "emergency_interceptor_active": True,
        "disclaimer": settings.governance_disclaimer,
    }
