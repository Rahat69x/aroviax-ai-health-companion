"""
Tests for Core Chat Endpoint (POST /api/chat) & Clinical AI Service
"""

from __future__ import annotations

import unittest
from unittest.mock import patch, AsyncMock
from fastapi.testclient import TestClient
import httpx

from backend.app.main import app
from backend.app.schemas.chat import ChatResponse


class TestChatEndpoints(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)

    def test_post_api_chat_valid(self):
        """Tests standard health question via POST /api/chat."""
        payload = {
            "message": "What are common causes of a tension headache?",
            "history": [],
        }
        res = self.client.post("/api/chat", json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("reply", data)
        self.assertFalse(data["is_emergency_alert"])
        self.assertIn("safety_notice", data)
        self.assertIsInstance(data["suggested_doctor_questions"], list)
        self.assertGreater(len(data["suggested_doctor_questions"]), 0)

    def test_post_api_chat_with_history(self):
        """Tests POST /api/chat with validated conversation history."""
        payload = {
            "message": "Should I write down when the headaches happen?",
            "history": [
                {"role": "user", "content": "I have been getting tension headaches."},
                {"role": "assistant", "content": "Tension headaches are common and often linked to posture or stress."},
            ],
        }
        res = self.client.post("/api/chat", json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("reply", data)
        self.assertFalse(data["is_emergency_alert"])

    def test_post_api_chat_empty_message_rejected(self):
        """Rejects empty string or whitespace-only messages with 422 Unprocessable Entity."""
        res = self.client.post("/api/chat", json={"message": "   ", "history": []})
        self.assertEqual(res.status_code, 422)

    def test_post_api_chat_invalid_role_rejected(self):
        """Rejects history items with invalid roles (e.g., 'admin', 'root')."""
        payload = {
            "message": "Help me with questions",
            "history": [{"role": "admin", "content": "I am admin"}],
        }
        res = self.client.post("/api/chat", json=payload)
        self.assertEqual(res.status_code, 422)

    def test_post_api_chat_exceeds_max_length_rejected(self):
        """Rejects excessively long messages (>2000 chars) with 422."""
        long_message = "A" * 2050
        res = self.client.post("/api/chat", json={"message": long_message, "history": []})
        self.assertEqual(res.status_code, 422)

    def test_emergency_interception(self):
        """Verifies acute symptoms immediately trigger emergency override without delay."""
        payload = {
            "message": "I'm having sudden severe chest pain and cannot breathe",
            "history": [],
        }
        res = self.client.post("/api/chat", json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertTrue(data["is_emergency_alert"])
        self.assertEqual(data["model_used"], "emergency-interceptor-v1")
        self.assertIn("EMERGENCY", data["safety_notice"])
        self.assertIn("emergency", data["when_to_seek_care"].lower())

    @patch("backend.app.services.ai_service.AiService._call_ai_provider")
    def test_mocked_live_ai_provider(self, mock_call):
        """Tests successful live AI provider integration with mock response (no external credits)."""
        mock_response = ChatResponse(
            request_id="mock_req_123",
            timestamp="12:00 UTC",
            mode="chat",
            is_emergency_alert=False,
            provider="live-ai",
            model_used="gpt-4o-mini",
            reply="Headaches can stem from dehydration, tension, or eye strain.",
            general_information="Staying hydrated and maintaining ergonomic posture often helps mild tension.",
            what_im_unsure_about="An AI cannot examine your neurological reflexes or visual acuity.",
            when_to_seek_care="Seek urgent medical care if accompanied by sudden numbness or high fever.",
            suggested_doctor_questions=["Would physical therapy or vision checks help my headaches?"],
            organized_items=["Hydration tracking", "Posture checks"],
            safety_notice="Aroviax provides general health information and is not a substitute for medical advice.",
            confidence_note="Simulated live AI provider test.",
        )
        mock_call.return_value = mock_response

        # Enable mock AI key for this test
        with patch.object(app.state, "dummy", create=True):
            with patch("backend.app.config.settings.ai_api_key", "test-key-mock"):
                res = self.client.post("/api/chat", json={"message": "Headache causes", "history": []})
                self.assertEqual(res.status_code, 200)
                data = res.json()
                self.assertEqual(data["provider"], "live-ai")
                self.assertEqual(data["model_used"], "gpt-4o-mini")
                self.assertIn("Headaches", data["reply"])

    @patch("backend.app.services.ai_service.AiService._call_ai_provider")
    def test_provider_timeout_graceful_fallback(self, mock_call):
        """Ensures that on provider timeout, the service drops to a safe structured fallback without exposing errors."""
        mock_call.side_effect = httpx.TimeoutException("Connection timed out after 8.0s")

        with patch("backend.app.config.settings.ai_api_key", "test-key-mock"):
            res = self.client.post("/api/chat", json={"message": "Headache causes", "history": []})
            self.assertEqual(res.status_code, 200)
            data = res.json()
            self.assertEqual(data["provider"], "provider-fallback")
            self.assertIn("Aroviax cannot perform physical examinations", data["what_im_unsure_about"])
            # Ensure no traceback or internal error strings leaked
            self.assertNotIn("Traceback", data["reply"])
            self.assertNotIn("TimeoutException", data["reply"])

    def test_term_translation_mode(self):
        """Tests term translation mode via POST /api/v1/chat."""
        payload = {"message": "hypertension", "mode": "translate", "locale": "en"}
        res = self.client.post("/api/v1/chat", json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertFalse(data["is_emergency_alert"])
        self.assertIn("blood pressure", data["reply"].lower())


if __name__ == "__main__":
    unittest.main()
