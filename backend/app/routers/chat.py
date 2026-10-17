"""
Aroviax — Conversational AI Health Chat Router

Strictly adheres to clinical governance:
- Emergency interceptor fires first
- Never diagnoses or prescribes
- Provides questions to ask clinicians
- Explains uncertainties and when to seek care
"""

from __future__ import annotations

import datetime
import uuid
from fastapi import APIRouter
from backend.app.schemas.chat import ChatRequest, ChatResponse
from backend.app.services.emergency_detector import detect_emergency
from backend.app.services.term_engine import explain_medical_term
from backend.app.config import settings

router = APIRouter(prefix="/api/v1/chat", tags=["Chat"])


@router.post("", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    req_id = f"py_{uuid.uuid4().hex[:8]}"
    now_str = datetime.datetime.now(datetime.timezone.utc).strftime("%H:%M UTC")

    # 1. Emergency Pre-emption Check
    is_emergency, triggers = detect_emergency(request.message)
    if is_emergency:
        trigger_str = ", ".join(triggers)
        return ChatResponse(
            request_id=req_id,
            timestamp=now_str,
            mode=request.mode,
            is_emergency_alert=True,
            provider="aroviax-fastapi-safety-guard",
            model_used="emergency-interceptor-v1",
            reply=(
                "CRITICAL SAFETY ALERT: The symptoms or words you entered may represent an acute medical emergency. "
                f"Immediate clinical evaluation is required ({trigger_str})."
            ),
            general_information="High-acuity medical conditions require urgent evaluation by emergency medical professionals.",
            what_im_unsure_about="An AI cannot measure vital signs, examine your body, or gauge physiological stability.",
            when_to_seek_care="Seek emergency medical services (e.g. call 911, 999, or local emergency number) immediately.",
            suggested_doctor_questions=[
                "What immediate diagnostic tests (ECG, imaging, cardiac enzymes) are needed right now?",
                "What caused this acute episode?",
            ],
            organized_items=[
                "Do not wait to read or type online messages",
                "If alone, notify someone nearby and unlock your door for first responders",
                "Do not drive yourself if experiencing dizziness, chest pressure, or shortness of breath",
            ],
            safety_notice="EMERGENCY WARNING: Call local emergency services immediately. Do not rely on AI for acute medical situations.",
            confidence_note="Emergency override active. Speculation withheld.",
        )

    # 2. Mode: Term Translation
    if request.mode == "translate":
        term_res = explain_medical_term(request.message, locale=request.locale)
        return ChatResponse(
            request_id=req_id,
            timestamp=now_str,
            mode=request.mode,
            is_emergency_alert=False,
            provider="aroviax-fastapi-service",
            model_used="term-translator-v1",
            reply=f"Plain Language Translation for '{term_res['term']}':\n{term_res['simple_explanation']}",
            general_information=str(term_res["everyday_analogy"]),
            what_im_unsure_about="Individual diagnostic lab reference ranges and clinical context from your doctor.",
            when_to_seek_care="Discuss abnormal lab values or persistent symptoms directly with your ordering clinician.",
            suggested_doctor_questions=list(term_res["questions_to_ask_clinician"]),  # type: ignore
            organized_items=[
                f"Medical term: {term_res['term']}",
                f"Analogy: {term_res['everyday_analogy']}",
                f"Clinical rationale: {term_res['why_doctors_use_it']}",
            ],
            safety_notice=settings.governance_disclaimer,
            confidence_note="Plain-language educational translation.",
        )

    # 3. Default Chat / Symptom Prep Mode
    clean_msg = request.message.strip()
    return ChatResponse(
        request_id=req_id,
        timestamp=now_str,
        mode=request.mode,
        is_emergency_alert=False,
        provider="aroviax-fastapi-service",
        model_used="health-communicator-v1",
        reply=(
            f"Thank you for sharing your health concern. Let's organize this so you are well prepared to discuss it with your clinician:\n\n"
            f"Observation: {clean_msg}"
        ),
        general_information=(
            "Organizing your timeline, symptom triggers, and specific bodily sensations beforehand helps clinicians "
            "make more accurate assessments during your appointment."
        ),
        what_im_unsure_about="Physical examination findings, internal vital signs, and diagnostic test results.",
        when_to_seek_care="Schedule an appointment with your primary care clinician. If symptoms rapidly worsen, seek urgent care.",
        suggested_doctor_questions=[
            "What might be the underlying physiological cause of these symptoms?",
            "Are there specific activities or foods I should temporarily avoid?",
            "What timeframe should I expect before seeing improvement?",
        ],
        organized_items=[
            f"Noted concern: {clean_msg[:100]}...",
            "Documented onset & pattern to share with doctor",
            "Prepared visit discussion questions",
        ],
        safety_notice=settings.governance_disclaimer,
        confidence_note="Aroviax Python FastAPI AI companion engine.",
    )
