"""
Aroviax — Chat & Health Schemas
"""

from __future__ import annotations

from typing import Literal
from pydantic import BaseModel, Field, field_validator


ChatMode = Literal["chat", "translate", "afterVisit", "symptomPrep"]
ChatRole = Literal["user", "assistant", "system"]


class ChatHistoryItem(BaseModel):
    role: ChatRole = Field(..., description="Role of the message author")
    content: str = Field(..., min_length=1, max_length=2000, description="Message text")

    @field_validator("content")
    @classmethod
    def validate_content_not_empty(cls, v: str) -> str:
        stripped = v.strip()
        if not stripped:
            raise ValueError("Message content cannot be blank or whitespace only")
        return stripped


class ChatRequest(BaseModel):
    message: str = Field(
        ...,
        min_length=1,
        max_length=2000,
        description="User health-related question or symptom description",
    )
    history: list[ChatHistoryItem] = Field(
        default_factory=list,
        max_length=20,
        description="Recent conversation context (max 20 messages)",
    )
    mode: ChatMode = Field(default="chat", description="Conversation mode")
    locale: Literal["en", "bn"] = Field(default="en", description="User preferred language")

    @field_validator("message")
    @classmethod
    def validate_message(cls, v: str) -> str:
        stripped = v.strip()
        if not stripped:
            raise ValueError("A non-empty message string is required.")
        return stripped


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

    # CamelCase compatibility for frontend direct consumption
    @property
    def isEmergencyAlert(self) -> bool:
        return self.is_emergency_alert

    @property
    def generalInformation(self) -> str | None:
        return self.general_information

    @property
    def whatImUnsureAbout(self) -> str | None:
        return self.what_im_unsure_about

    @property
    def whenToSeekCare(self) -> str | None:
        return self.when_to_seek_care

    @property
    def suggestedDoctorQuestions(self) -> list[str]:
        return self.suggested_doctor_questions

    @property
    def organizedItems(self) -> list[str]:
        return self.organized_items

    @property
    def safetyNotice(self) -> str:
        return self.safety_notice

    @property
    def confidenceNote(self) -> str:
        return self.confidence_note

    @property
    def requestId(self) -> str:
        return self.request_id

    @property
    def modelUsed(self) -> str:
        return self.model_used


class HealthResponse(BaseModel):
    status: str = Field(default="ok", description="Service operational status")
    service: str = Field(default="aroviax-api", description="Service identifier")
    ai_configured: bool = Field(default=False, description="Whether live AI provider credentials are loaded")
    ai_model: str | None = Field(default=None, description="Active AI model identifier")
    version: str = Field(default="1.0.0", description="Backend version")
    emergency_interceptor_active: bool = Field(default=True, description="Safety guard status")
    disclaimer: str = Field(..., description="Mandatory medical safety disclaimer")
