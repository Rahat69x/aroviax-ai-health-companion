"""
Aroviax — Medication Safety Validation Guard

Implements safety heuristics, drug-class duplication alerts, and questions
to ask a pharmacist. Strictly non-prescriptive and informational.
"""

from __future__ import annotations

from typing import Any
from backend.app.schemas.medications import (
    MedicationItem,
    MedicationSafetyWarning,
    MedicationSafetyResponse,
)

NSAID_NAMES = {"ibuprofen", "advil", "motrin", "naproxen", "aleve", "aspirin", "celecoxib", "diclofenac", "meloxicam"}
BLOOD_THINNERS = {"warfarin", "coumadin", "eliquis", "apixaban", "xarelto", "rivaroxaban", "plavix", "clopidogrel", "heparin"}
ANTIBIOTICS = {"amoxicillin", "azithromycin", "ciprofloxacin", "cephalexin", "doxycycline", "penicillin", "metronidazole"}


def inspect_medications(meds: list[MedicationItem]) -> MedicationSafetyResponse:
    """
    Evaluates a list of user-entered medications for common safety notes.
    """
    active_meds = [m for m in meds if m.is_active]
    warnings: list[MedicationSafetyWarning] = []
    questions_for_pharmacist: list[str] = [
        "What is the best time of day to take each of these medications?",
        "Should any of these be taken with food or on an empty stomach?",
        "Are there any over-the-counter vitamins or supplements I should avoid?",
    ]

    names_lower = [m.name.lower() for m in active_meds]

    # 1. Duplicate names check
    seen = set()
    duplicates = set()
    for name in names_lower:
        base_name = name.split()[0] if name else ""
        if base_name in seen:
            duplicates.add(base_name)
        seen.add(base_name)

    if duplicates:
        for dup in duplicates:
            warnings.append(
                MedicationSafetyWarning(
                    severity="caution",
                    title=f"Potential duplicate entry: {dup.title()}",
                    description=f"You have multiple active listings matching '{dup.title()}'. Double-check that you are not inadvertently taking duplicate doses.",
                    suggested_pharmacist_question=f"I have two entries for {dup.title()} on my list. Can you confirm my correct single prescription dose?",
                )
            )

    # 2. Multiple NSAIDs check
    nsaids_present = [name for name in names_lower if any(ns in name for ns in NSAID_NAMES)]
    if len(nsaids_present) > 1:
        warnings.append(
            MedicationSafetyWarning(
                severity="caution",
                title="Multiple NSAID medications detected",
                description="Taking more than one non-steroidal anti-inflammatory drug (NSAID) simultaneously can increase the risk of stomach irritation, bleeding, or renal strain.",
                suggested_pharmacist_question="I noticed I have multiple anti-inflammatory/NSAID medications listed. Is it safe to take these together or should they be alternated?",
            )
        )

    # 3. NSAID + Blood Thinner interaction caution
    thinners_present = [name for name in names_lower if any(bt in name for bt in BLOOD_THINNERS)]
    if nsaids_present and thinners_present:
        warnings.append(
            MedicationSafetyWarning(
                severity="caution",
                title="Concurrent NSAID and Blood Thinner alert",
                description="Combining anti-inflammatory pain relievers with blood thinners requires clinician oversight due to increased bleeding risk.",
                suggested_pharmacist_question="Which over-the-counter pain reliever is safest with my current blood thinner prescription?",
            )
        )

    # 4. Antibiotic notice
    antibiotics_present = [name for name in names_lower if any(ab in name for ab in ANTIBIOTICS)]
    if antibiotics_present:
        warnings.append(
            MedicationSafetyWarning(
                severity="informative",
                title="Antibiotic course completion reminder",
                description="Antibiotics should generally be taken for the complete prescribed duration, even if symptoms improve early, unless instructed otherwise by your doctor.",
                suggested_pharmacist_question="How many days should I continue taking this antibiotic, and what should I do if I miss a scheduled dose?",
            )
        )

    general_guidance = [
        "Store all medications in a cool, dry place away from direct sunlight and humidity (avoid bathroom medicine cabinets).",
        "Keep an up-to-date printed list of all prescription, over-the-counter, and herbal supplements in your wallet or bag.",
        "Never discontinue or adjust dosages of prescription medications without discussing with your prescribing doctor.",
    ]

    return MedicationSafetyResponse(
        total_medications=len(meds),
        active_count=len(active_meds),
        warnings=warnings,
        general_guidance=general_guidance,
        questions_for_pharmacist=questions_for_pharmacist,
        disclaimer="Informational Medication Organizer: Aroviax does not verify clinical suitability, pharmacology, or individual dosages. Always consult your prescribing physician or licensed pharmacist.",
    )
