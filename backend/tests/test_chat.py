"""
Tests for Conversational Chat Endpoint
"""

from __future__ import annotations

import unittest
from fastapi.testclient import TestClient
from backend.app.main import app


class TestChatEndpoints(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)

    def test_emergency_interception(self):
        payload = {"message": "I'm having a sudden heart attack and can't breathe", "mode": "chat"}
        res = self.client.post("/api/v1/chat", json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertTrue(data["is_emergency_alert"])
        self.assertEqual(data["model_used"], "emergency-interceptor-v1")
        self.assertIn("EMERGENCY", data["safety_notice"])

    def test_term_translation_mode(self):
        payload = {"message": "hypertension", "mode": "translate", "locale": "en"}
        res = self.client.post("/api/v1/chat", json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertFalse(data["is_emergency_alert"])
        self.assertIn("blood pressure", data["reply"].lower())

    def test_standard_health_chat(self):
        payload = {"message": "I want to prepare questions for my annual checkup next Monday", "mode": "chat"}
        res = self.client.post("/api/v1/chat", json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertFalse(data["is_emergency_alert"])
        self.assertIn("Aroviax", data["confidence_note"])
        self.assertGreater(len(data["suggested_doctor_questions"]), 0)


if __name__ == "__main__":
    unittest.main()
