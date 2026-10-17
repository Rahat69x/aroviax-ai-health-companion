"""
Aroviax — Symptom Triage & Organization Engine

Synthesizes user symptoms into an organized dossier for clinical visits.
Enforces non-diagnostic guidelines:
- Never names a disease diagnosis
- Clearly stratifies urgency (emergency, prompt-care, routine-consultation, self-monitoring)
- Suggests appropriate clinical specialties
- Formulates doctor questions
- Explicitly enumerates physical exams/tests that cannot be done online
"""

from __future__ import annotations

import uuid
from backend.app.schemas.triage import SymptomTriageRequest, SymptomTriageResponse
from backend.app.services.emergency_detector import detect_emergency


def organize_symptoms(request: SymptomTriageRequest) -> SymptomTriageResponse:
    request_id = f"trg_{uuid.uuid4().hex[:10]}"
    combined_text = f"{request.main_concern} {' '.join(request.associated_symptoms)} {request.body_location or ''}"

    is_emergency, triggers = detect_emergency(combined_text)

    # Urgency stratification
    if is_emergency:
        urgency_tier = "emergency"
        emergency_warning = (
            f"HIGH-ACUITY WARNING: Your symptoms mention potentially urgent signs ({', '.join(triggers)}). "
            "Please call local emergency services (911/999) or visit the nearest emergency room immediately."
        )
    elif request.severity_rating >= 8:
        urgency_tier = "prompt-care"
        emergency_warning = (
            "High severity reported. If severe pain or impairment persists, "
            "seek urgent care or prompt clinical evaluation today."
        )
    elif request.severity_rating >= 4:
        urgency_tier = "routine-consultation"
        emergency_warning = None
    else:
        urgency_tier = "self-monitoring"
        emergency_warning = None

    # Suggested specialty routing
    concern_lower = request.main_concern.lower()
    location_lower = (request.body_location or "").lower()

    if any(k in concern_lower or k in location_lower for k in ["skin", "rash", "itching", "mole", "acne", "eczema"]):
        specialty = "Dermatologist or Primary Care Physician"
    elif any(k in concern_lower or k in location_lower for k in ["joint", "knee", "back", "bone", "spine", "muscle"]):
        specialty = "Orthopedist, Physical Therapist, or Primary Care Physician"
    elif any(k in concern_lower or k in location_lower for k in ["ear", "throat", "nose", "sinus", "tonsil"]):
        specialty = "Otolaryngologist (ENT) or Primary Care Physician"
    elif any(k in concern_lower or k in location_lower for k in ["eye", "vision", "blur", "floaters"]):
        specialty = "Ophthalmologist or Optometrist"
    elif any(k in concern_lower or k in location_lower for k in ["stomach", "acid", "nausea", "abdomen", "bowel", "diarrhea"]):
        specialty = "Gastroenterologist or Primary Care Physician"
    else:
        specialty = "Primary Care Physician (Internal Medicine or Family Medicine)"

    # Formulate visit questions
    questions = [
        f"What are the most likely causes for this {request.main_concern} based on my medical history?",
        "Are there any specific diagnostic tests (blood work, imaging) you recommend?",
        "What warning signs should prompt me to seek urgent attention before my next appointment?",
        "What daily lifestyle, ergonomic, or dietary adjustments might help alleviate discomfort?",
    ]

    # Red flag warnings
    red_flags = [
        "Sudden, excruciating, or rapidly worsening pain",
        "High persistent fever unresponsive to over-the-counter fever reducers",
        "New or unexplained neurological deficits (numbness, weakness, loss of coordination)",
        "Inability to keep liquids down for more than 24 hours",
    ]

    # Explicit clinical limitations
    limitations = [
        "In-person physical palpation and stethoscope auscultation",
        "Vital signs measurement (blood pressure, oxygen saturation, temperature)",
        "Laboratory blood chemistry or microbiological cultures",
        "Diagnostic imaging (X-ray, ultrasound, MRI, or CT scans)",
    ]

    # Summary
    onset_str = f"Onset: {request.onset_description}" if request.onset_description else "Onset: unstated"
    location_str = f"Location: {request.body_location}" if request.body_location else "Location: generalized"
    assoc_str = f"Associated: {', '.join(request.associated_symptoms)}" if request.associated_symptoms else "None reported"

    summary = (
        f"Chief Concern: {request.main_concern} (Severity {request.severity_rating}/10). "
        f"{location_str}. {onset_str}. Associated symptoms: {assoc_str}."
    )

    return SymptomTriageResponse(
        request_id=request_id,
        is_emergency=is_emergency,
        emergency_warning=emergency_warning,
        urgency_tier=urgency_tier,
        organized_summary=summary,
        suggested_specialty=specialty,
        questions_for_doctor=questions,
        red_flag_warnings=red_flags,
        what_cannot_be_assessed_online=limitations,
        disclaimer=(
            "Organized for Clinician Review: Aroviax does not diagnose disease or replace professional medical care. "
            "Share this summary with your doctor during your consultation."
        ),
    )
