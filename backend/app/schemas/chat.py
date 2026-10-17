"""
Aroviax — Chat Schemas
"""

from __future__ import annotations

from typing import Literal
from pydantic import BaseModel, Field


ChatMode = Literal["chat", "translate", "afterVisit", "symptomPrep"]


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=4000, description="User health query or symptom notes")
    mode: ChatMode = Field(default="chat", description="Conversation mode")
    locale: Literal["en", "bn"] = Field(default="en", description="User preferred language")


class ChatResponse(BaseModel):
    request_id: str
    timestamp: str
    mode: str
    is_emergency_alert: bool
    provider: str
    model_used: str
    reply: str
    general_information: str | None = None
    what_im_unsure_about: str | None = None
    when_to_seek_care: str | None = None
    suggested_doctor_questions: list[str] = Field(default_factory=list)
    organized_items: list[str] = Field(default_factory=list)
    safety_notice: str
    confidence_note: str
