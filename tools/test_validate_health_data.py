#!/usr/bin/env python3
"""
Tests for the Aroviax health data validation utilities.

Run:  python -m pytest tools/test_validate_health_data.py -v
  or: python tools/test_validate_health_data.py
"""

from __future__ import annotations

import sys
from pathlib import Path

# Ensure tools directory is on sys.path for direct or module execution
tools_dir = Path(__file__).resolve().parent
if str(tools_dir) not in sys.path:
    sys.path.insert(0, str(tools_dir))

import unittest
from validate_health_data import (
    ValidationResult,
    validate_export,
    validate_health_note,
    validate_medication,
    validate_symptom_report,
    _is_iso_date,
    _is_iso_datetime,
    _scan_pii,
)


class TestDateHelpers(unittest.TestCase):
    """Date and datetime format validators."""

    def test_valid_iso_date(self):
        self.assertTrue(_is_iso_date("2026-10-14"))
        self.assertTrue(_is_iso_date("2000-01-01"))

    def test_invalid_iso_date(self):
        self.assertFalse(_is_iso_date("10-14-2026"))
        self.assertFalse(_is_iso_date("2026/10/14"))
        self.assertFalse(_is_iso_date(""))
        self.assertFalse(_is_iso_date("not-a-date"))

    def test_valid_iso_datetime(self):
        self.assertTrue(_is_iso_datetime("2026-10-14T14:30:00Z"))
        self.assertTrue(_is_iso_datetime("2026-10-14T14:30:00.000Z"))

    def test_invalid_iso_datetime(self):
        self.assertFalse(_is_iso_datetime("2026-10-14"))
        self.assertFalse(_is_iso_datetime(""))


class TestPiiScanner(unittest.TestCase):
    """PII pattern detection — mirrors privacyInspector.ts tests."""

    def test_detects_email(self):
        pii = _scan_pii("Contact me at user@example.com for details.")
        self.assertIn("email", pii)

    def test_detects_phone(self):
        pii = _scan_pii("Call 555-123-4567 if needed.")
        self.assertIn("phone", pii)

    def test_detects_ssn(self):
        pii = _scan_pii("SSN: 123-45-6789")
        self.assertIn("ssn", pii)

    def test_detects_dob(self):
        pii = _scan_pii("Date of Birth: 1990-05-20")
        self.assertIn("date_of_birth", pii)

    def test_clean_text_returns_empty(self):
        pii = _scan_pii("Blood pressure was 128/82 today.")
        self.assertEqual(pii, [])


class TestHealthNoteValidation(unittest.TestCase):
    """Health note record validation."""

    def _make_note(self, **overrides):
        base = {
            "id": "note_001",
            "title": "Test note",
            "body": "Some health observation.",
            "date": "2026-10-14",
            "tags": ["test"],
            "createdAt": "2026-10-14T09:00:00Z",
            "updatedAt": "2026-10-14T09:00:00Z",
        }
        base.update(overrides)
        return base

    def test_valid_note_passes(self):
        result = ValidationResult()
        validate_health_note(self._make_note(), 0, result)
        self.assertTrue(result.is_valid)
        self.assertEqual(len(result.warnings), 0)

    def test_missing_title_fails(self):
        result = ValidationResult()
        validate_health_note(self._make_note(title=""), 0, result)
        self.assertFalse(result.is_valid)

    def test_bad_date_format_fails(self):
        result = ValidationResult()
        validate_health_note(self._make_note(date="14/10/2026"), 0, result)
        self.assertFalse(result.is_valid)

    def test_pii_in_body_warns(self):
        result = ValidationResult()
        validate_health_note(
            self._make_note(body="Email me at test@example.com"), 0, result
        )
        self.assertTrue(result.is_valid)  # PII is a warning, not an error
        self.assertTrue(len(result.warnings) > 0)


class TestMedicationValidation(unittest.TestCase):
    """Medication record validation."""

    def _make_med(self, **overrides):
        base = {
            "id": "med_001",
            "name": "Metformin 500 mg",
            "instructions": "Take twice daily with meals.",
            "purpose": "Blood sugar management",
            "startDate": "2026-09-15",
            "pharmacistQuestions": ["What if I miss a dose?"],
            "isActive": True,
        }
        base.update(overrides)
        return base

    def test_valid_medication_passes(self):
        result = ValidationResult()
        validate_medication(self._make_med(), 0, result)
        self.assertTrue(result.is_valid)

    def test_missing_name_fails(self):
        result = ValidationResult()
        validate_medication(self._make_med(name=""), 0, result)
        self.assertFalse(result.is_valid)

    def test_bad_start_date_fails(self):
        result = ValidationResult()
        validate_medication(self._make_med(startDate="Sept 15"), 0, result)
        self.assertFalse(result.is_valid)


class TestSymptomReportValidation(unittest.TestCase):
    """Symptom organizer report validation."""

    def _make_report(self, **overrides):
        base = {
            "mainConcern": "Headache",
            "onsetDate": "2026-10-10",
            "severityRating": 6,
            "qualities": ["Throbbing"],
            "questionsForDoctor": ["Is this a migraine?"],
        }
        base.update(overrides)
        return base

    def test_valid_report_passes(self):
        result = ValidationResult()
        validate_symptom_report(self._make_report(), 0, result)
        self.assertTrue(result.is_valid)

    def test_missing_concern_fails(self):
        result = ValidationResult()
        validate_symptom_report(self._make_report(mainConcern=""), 0, result)
        self.assertFalse(result.is_valid)

    def test_severity_out_of_range_fails(self):
        result = ValidationResult()
        validate_symptom_report(self._make_report(severityRating=15), 0, result)
        self.assertFalse(result.is_valid)

    def test_severity_zero_fails(self):
        result = ValidationResult()
        validate_symptom_report(self._make_report(severityRating=0), 0, result)
        self.assertFalse(result.is_valid)


class TestFullExportValidation(unittest.TestCase):
    """Full export file validation."""

    def test_valid_full_export(self):
        data = {
            "version": "1.0",
            "exported_at": "2026-10-14T15:00:00Z",
            "health_notes": [
                {
                    "id": "n1", "title": "Note", "body": "Content",
                    "date": "2026-10-14", "tags": [],
                }
            ],
            "medications": [
                {
                    "id": "m1", "name": "Aspirin", "instructions": "Daily",
                    "pharmacistQuestions": [],
                }
            ],
            "symptom_reports": [],
        }
        result = validate_export(data)
        self.assertTrue(result.is_valid)

    def test_empty_export_warns(self):
        result = validate_export({"version": "1.0"})
        self.assertTrue(result.is_valid)
        self.assertTrue(any("no records" in w for w in result.warnings))

    def test_non_dict_top_level_fails(self):
        result = validate_export([])  # type: ignore
        self.assertFalse(result.is_valid)


if __name__ == "__main__":
    unittest.main()
