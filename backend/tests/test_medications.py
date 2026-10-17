"""
Tests for Medication Safety Validation
"""

from __future__ import annotations

import unittest
from fastapi.testclient import TestClient
from backend.app.main import app


class TestMedicationEndpoints(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)

    def test_single_routine_medication(self):
        payload = {
            "medications": [
                {
                    "name": "Metformin 500mg",
                    "instructions": "Take 1 tablet twice daily with meals",
                    "purpose": "Blood sugar regulation",
                    "is_active": True,
                }
            ]
        }
        res = self.client.post("/api/v1/medications/validate", json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["total_medications"], 1)
        self.assertEqual(data["active_count"], 1)
        self.assertGreater(len(data["questions_for_pharmacist"]), 0)

    def test_duplicate_and_nsaid_alert(self):
        payload = {
            "medications": [
                {
                    "name": "Ibuprofen 400mg",
                    "instructions": "Take as needed for headache",
                    "is_active": True,
                },
                {
                    "name": "Naproxen 220mg",
                    "instructions": "Take once daily for joint pain",
                    "is_active": True,
                },
            ]
        }
        res = self.client.post("/api/v1/medications/validate", json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        warnings = data["warnings"]
        self.assertTrue(any("NSAID" in w["title"] for w in warnings))


if __name__ == "__main__":
    unittest.main()
