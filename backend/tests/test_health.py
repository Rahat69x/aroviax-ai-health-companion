"""
Tests for Health & Status Endpoints
"""

from __future__ import annotations

import unittest
from fastapi.testclient import TestClient
from backend.app.main import app


class TestHealthEndpoints(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)

    def test_root_endpoint(self):
        response = self.client.get("/")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("project", data)
        self.assertEqual(data["project"], "Aroviax — AI Health Companion")
        self.assertIn("api_v1", data)

    def test_health_endpoint(self):
        response = self.client.get("/health")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["status"], "healthy")
        self.assertTrue(data["emergency_interceptor_active"])
        self.assertIn("disclaimer", data)

    def test_api_health_core_endpoint(self):
        response = self.client.get("/api/health")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["status"], "ok")
        self.assertEqual(data["service"], "aroviax-api")
        self.assertIn("version", data)
        self.assertIn("disclaimer", data)
        # Ensure no secrets or API keys are leaked
        self.assertNotIn("ai_api_key", data)
        self.assertNotIn("openai_api_key", data)
        self.assertNotIn("api_key", data)
        self.assertNotIn("secret", data)

    def test_api_v1_health_endpoint(self):
        response = self.client.get("/api/v1/health")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["status"], "healthy")


if __name__ == "__main__":
    unittest.main()
