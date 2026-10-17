"""
Tests for Clinical Safety Emergency Detector
"""

from __future__ import annotations

import unittest
from backend.app.services.emergency_detector import detect_emergency


class TestEmergencyDetector(unittest.TestCase):
    def test_detects_chest_pain(self):
        is_em, triggers = detect_emergency("I'm feeling severe chest pain and pressure.")
        self.assertTrue(is_em)
        self.assertIn("chest pain", triggers)

    def test_detects_stroke_symptoms(self):
        is_em, triggers = detect_emergency("Noticed sudden facial drooping and slurred speech.")
        self.assertTrue(is_em)
        self.assertTrue(any("facial drooping" in t or "slurred speech" in t for t in triggers))

    def test_detects_respiratory_distress(self):
        is_em, triggers = detect_emergency("I have difficulty breathing right now.")
        self.assertTrue(is_em)
        self.assertIn("difficulty breathing", triggers)

    def test_clean_input_passes(self):
        is_em, triggers = detect_emergency("I have a mild runny nose and want to know home remedies.")
        self.assertFalse(is_em)
        self.assertEqual(triggers, [])

    def test_empty_input(self):
        is_em, triggers = detect_emergency("")
        self.assertFalse(is_em)
        self.assertEqual(triggers, [])


if __name__ == "__main__":
    unittest.main()
