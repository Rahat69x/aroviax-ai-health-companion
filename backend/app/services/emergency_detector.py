"""
Aroviax — Emergency Detector Service

Implements the Clinical Safety Governance Invariant:
Emergency triage words or acute red flags are intercepted immediately
before any conversational heuristic or LLM generation.
"""

from __future__ import annotations

import re

# Red-flag keywords and emergency patterns (mirrors src/lib/safetySignals.ts)
EMERGENCY_KEYWORDS: list[str] = [
    "chest pain",
    "heart attack",
    "difficulty breathing",
    "can't breathe",
    "cannot breathe",
    "shortness of breath",
    "stroke",
    "facial drooping",
    "arm weakness",
    "slurred speech",
    "sudden numbness",
    "anaphylaxis",
    "throat swelling",
    "severe allergic reaction",
    "unconscious",
    "fainting",
    "loss of consciousness",
    "coughing up blood",
    "vomiting blood",
    "uncontrollable bleeding",
    "severe head injury",
    "worst headache of life",
    "thunderclap headache",
    "suicide",
    "kill myself",
    "overdose",
]

EMERGENCY_REGEX = re.compile(
    r"\b(" + "|".join(re.escape(k) for k in EMERGENCY_KEYWORDS) + r")\b",
    re.IGNORECASE,
)


def detect_emergency(text: str) -> tuple[bool, list[str]]:
    """
    Scans text for acute medical emergency indicators.
    Returns: (is_emergency, list_of_detected_triggers)
    """
    if not text or not text.strip():
        return False, []

    matches = EMERGENCY_REGEX.findall(text)
    unique_triggers = sorted(list(set(m.lower() for m in matches)))
    return (len(unique_triggers) > 0, unique_triggers)
