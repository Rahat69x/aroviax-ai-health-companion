"""
Tests for Symptom Triage & Organization Engine
"""

from __future__ import annotations

import unittest
from fastapi.testclient import TestClient
from backend.app.main import app


class TestTriageEndpoints(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)

    def test_routine_symptom_triage(self):
        payload = {
            "main_concern": "Mild persistent knee stiffness",
            "onset_description": "2 weeks ago after running",
            "severity_rating": 3,
            "body_location": "Right knee",
            "associated_symptoms": ["Mild swelling"],
            "known_triggers": ["Climbing stairs"],
            "relieving_factors": ["Rest and ice"],
        }
        res = self.client.post("/api/v1/triage", json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertFalse(data["is_emergency"])
        self.assertEqual(data["urgency_tier"], "self-monitoring")
        self.assertIn("Orthopedist", data["suggested_specialty"])
        self.assertGreater(len(data["questions_for_doctor"]), 0)
        self.assertGreater(len(data["what_cannot_be_assessed_online"]), 0)

    def test_emergency_triage_interception(self):
        payload = {
            "main_concern": "Crushing chest pain radiating to left arm",
            "severity_rating": 9,
        }
        res = self.client.post("/api/v1/triage", json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertTrue(data["is_emergency"])
        self.assertEqual(data["urgency_tier"], "emergency")
        self.assertIsNotNone(data["emergency_warning"])


if __name__ == "__main__":
    unittest.main()
