#!/usr/bin/env python3
"""
Aroviax — Health Data Validation Utilities

Standalone validation module for health data exported from the Aroviax
AI Health Companion. Can be used as:

  1. CLI tool:    python tools/validate_health_data.py export.json
  2. Library:     from tools.validate_health_data import validate_export

Validates structure, required fields, date formats, severity ranges,
and PII presence. Mirrors the governance rules enforced by the
TypeScript frontend (src/lib/healthNotes.ts, medicationOrganizer.ts,
symptomOrganizer.ts, privacyInspector.ts).

CLINICAL GOVERNANCE:
  This tool validates DATA STRUCTURE only — it never interprets,
  diagnoses, or scores medical content.
"""

from __future__ import annotations

import json
import re
import sys
from datetime import datetime
from pathlib import Path
from typing import Any

# ---------------------------------------------------------------------------
# PII Detection Patterns — mirrors src/lib/privacyInspector.ts
# ---------------------------------------------------------------------------

PII_PATTERNS: dict[str, re.Pattern[str]] = {
    "email": re.compile(
        r"[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}", re.IGNORECASE
    ),
    "phone": re.compile(
        r"(?:\+?\d{1,3}[\s\-]?)?\(?\d{2,4}\)?[\s\-]?\d{3,4}[\s\-]?\d{3,4}"
    ),
    "ssn": re.compile(r"\b\d{3}-\d{2}-\d{4}\b"),
    "date_of_birth": re.compile(
        r"\b(?:dob|date\s*of\s*birth|born)\s*[:\-]?\s*\d", re.IGNORECASE
    ),
}


# ---------------------------------------------------------------------------
# Validation Result
# ---------------------------------------------------------------------------

class ValidationResult:
    """Collects errors and warnings during validation."""

    def __init__(self) -> None:
        self.errors: list[str] = []
        self.warnings: list[str] = []

    @property
    def is_valid(self) -> bool:
        return len(self.errors) == 0

    def error(self, msg: str) -> None:
        self.errors.append(msg)

    def warn(self, msg: str) -> None:
        self.warnings.append(msg)

    def summary(self) -> str:
        lines = []
        if self.errors:
            lines.append(f"ERRORS ({len(self.errors)}):")
            for e in self.errors:
                lines.append(f"  ✗ {e}")
        if self.warnings:
            lines.append(f"WARNINGS ({len(self.warnings)}):")
            for w in self.warnings:
                lines.append(f"  ⚠ {w}")
        if self.is_valid and not self.warnings:
            lines.append("✓ All checks passed.")
        elif self.is_valid:
            lines.append("✓ Valid (with warnings).")
        else:
            lines.append("✗ Validation failed.")
        return "\n".join(lines)


# ---------------------------------------------------------------------------
# Individual Validators
# ---------------------------------------------------------------------------

def _is_iso_date(value: str) -> bool:
    """Check if string is a valid ISO 8601 date (YYYY-MM-DD)."""
    try:
        datetime.strptime(value, "%Y-%m-%d")
        return True
    except (ValueError, TypeError):
        return False


def _is_iso_datetime(value: str) -> bool:
    """Check if string is a valid ISO 8601 datetime."""
    for fmt in ("%Y-%m-%dT%H:%M:%SZ", "%Y-%m-%dT%H:%M:%S.%fZ",
                "%Y-%m-%dT%H:%M:%S%z", "%Y-%m-%dT%H:%M:%S.%f%z"):
        try:
            datetime.strptime(value, fmt)
            return True
        except (ValueError, TypeError):
            continue
    return False


def _scan_pii(text: str) -> list[str]:
    """Return list of PII types detected in text."""
    found = []
    for pii_type, pattern in PII_PATTERNS.items():
        if pattern.search(text):
            found.append(pii_type)
    return found


def validate_health_note(note: dict[str, Any], index: int,
                         result: ValidationResult) -> None:
    """Validate a single health note record."""
    prefix = f"health_notes[{index}]"

    # Required string fields
    for field in ("id", "title", "body", "date"):
        if not isinstance(note.get(field), str) or not note[field].strip():
            result.error(f"{prefix}.{field}: required non-empty string")

    # Date format
    if isinstance(note.get("date"), str) and not _is_iso_date(note["date"]):
        result.error(f"{prefix}.date: expected YYYY-MM-DD, got '{note['date']}'")

    # Tags must be list of strings
    tags = note.get("tags", [])
    if not isinstance(tags, list):
        result.error(f"{prefix}.tags: expected array")
    elif not all(isinstance(t, str) for t in tags):
        result.error(f"{prefix}.tags: all items must be strings")

    # Timestamps
    for ts_field in ("createdAt", "updatedAt"):
        val = note.get(ts_field)
        if isinstance(val, str) and not _is_iso_datetime(val):
            result.warn(f"{prefix}.{ts_field}: not a valid ISO datetime")

    # PII scan on body text
    body = note.get("body", "")
    if isinstance(body, str):
        pii = _scan_pii(body)
        if pii:
            result.warn(
                f"{prefix}.body: potential PII detected ({', '.join(pii)}). "
                "Consider redacting before export."
            )


def validate_medication(med: dict[str, Any], index: int,
                        result: ValidationResult) -> None:
    """Validate a single medication record."""
    prefix = f"medications[{index}]"

    for field in ("id", "name", "instructions"):
        if not isinstance(med.get(field), str) or not med[field].strip():
            result.error(f"{prefix}.{field}: required non-empty string")

    # Start date
    start = med.get("startDate")
    if isinstance(start, str) and start and not _is_iso_date(start):
        result.error(
            f"{prefix}.startDate: expected YYYY-MM-DD, got '{start}'"
        )

    # End date (optional, but must be valid if present)
    end = med.get("endDate")
    if isinstance(end, str) and end and not _is_iso_date(end):
        result.error(f"{prefix}.endDate: expected YYYY-MM-DD, got '{end}'")

    # Pharmacist questions
    pq = med.get("pharmacistQuestions", [])
    if not isinstance(pq, list):
        result.error(f"{prefix}.pharmacistQuestions: expected array")

    # Active flag
    if "isActive" in med and not isinstance(med["isActive"], bool):
        result.warn(f"{prefix}.isActive: expected boolean")


def validate_symptom_report(report: dict[str, Any], index: int,
                            result: ValidationResult) -> None:
    """Validate a single symptom organizer report."""
    prefix = f"symptom_reports[{index}]"

    if not isinstance(report.get("mainConcern"), str) or not report["mainConcern"].strip():
        result.error(f"{prefix}.mainConcern: required non-empty string")

    severity = report.get("severityRating")
    if severity is not None:
        if not isinstance(severity, (int, float)) or not (1 <= severity <= 10):
            result.error(
                f"{prefix}.severityRating: must be 1–10, got {severity}"
            )

    onset = report.get("onsetDate")
    if isinstance(onset, str) and onset and not _is_iso_date(onset):
        result.error(
            f"{prefix}.onsetDate: expected YYYY-MM-DD, got '{onset}'"
        )

    qualities = report.get("qualities", [])
    if not isinstance(qualities, list):
        result.error(f"{prefix}.qualities: expected array")

    questions = report.get("questionsForDoctor", [])
    if not isinstance(questions, list):
        result.error(f"{prefix}.questionsForDoctor: expected array")


# ---------------------------------------------------------------------------
# Top-Level Export Validator
# ---------------------------------------------------------------------------

def validate_export(data: dict[str, Any]) -> ValidationResult:
    """
    Validate a full Aroviax health data export.

    Expected top-level keys (all optional):
      - health_notes: list of HealthNote objects
      - medications: list of MedicationEntry objects
      - symptom_reports: list of SymptomOrganizerData objects
      - exported_at: ISO datetime string
      - version: schema version string
    """
    result = ValidationResult()

    if not isinstance(data, dict):
        result.error("Top-level structure must be a JSON object")
        return result

    # Version check
    version = data.get("version")
    if version and version not in ("1", "1.0", "1.0.0"):
        result.warn(f"Unknown export version: {version}")

    # Export timestamp
    exported_at = data.get("exported_at")
    if isinstance(exported_at, str) and not _is_iso_datetime(exported_at):
        result.warn(f"exported_at: not a valid ISO datetime")

    # Validate each section
    for i, note in enumerate(data.get("health_notes", [])):
        if not isinstance(note, dict):
            result.error(f"health_notes[{i}]: expected object")
            continue
        validate_health_note(note, i, result)

    for i, med in enumerate(data.get("medications", [])):
        if not isinstance(med, dict):
            result.error(f"medications[{i}]: expected object")
            continue
        validate_medication(med, i, result)

    for i, report in enumerate(data.get("symptom_reports", [])):
        if not isinstance(report, dict):
            result.error(f"symptom_reports[{i}]: expected object")
            continue
        validate_symptom_report(report, i, result)

    # Check for empty export
    total = (len(data.get("health_notes", []))
             + len(data.get("medications", []))
             + len(data.get("symptom_reports", [])))
    if total == 0:
        result.warn("Export contains no records")

    return result


# ---------------------------------------------------------------------------
# CLI Entry Point
# ---------------------------------------------------------------------------

def main() -> int:
    """Validate an Aroviax health data export from the command line."""
    if len(sys.argv) < 2:
        print("Usage: python validate_health_data.py <export.json>")
        print()
        print("Validates the structure and content of an Aroviax health data")
        print("export file. Checks required fields, date formats, severity")
        print("ranges, and flags potential PII.")
        return 1

    filepath = Path(sys.argv[1])
    if not filepath.exists():
        print(f"Error: file not found — {filepath}")
        return 1

    try:
        with open(filepath, "r", encoding="utf-8") as f:
            data = json.load(f)
    except json.JSONDecodeError as exc:
        print(f"Error: invalid JSON — {exc}")
        return 1

    result = validate_export(data)
    print(result.summary())
    return 0 if result.is_valid else 1


if __name__ == "__main__":
    sys.exit(main())
