"""
Tests for Medical Term Translation
"""

from __future__ import annotations

import unittest
from fastapi.testclient import TestClient
from backend.app.main import app


class TestTermEndpoints(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)

    def test_lookup_hypertension_get(self):
        res = self.client.get("/api/v1/terms?query=hypertension&locale=en")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["term"], "Hypertension")
        self.assertIn("blood pressure", data["simple_explanation"].lower())
        self.assertIn("garden hose", data["everyday_analogy"].lower())
        self.assertGreater(len(data["questions_to_ask_clinician"]), 0)

    def test_lookup_hypertension_bangla(self):
        res = self.client.get("/api/v1/terms?query=hypertension&locale=bn")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["locale"], "bn")
        self.assertIn("রক্তচাপ", data["simple_explanation"])

    def test_lookup_term_post(self):
        res = self.client.post("/api/v1/terms/explain", json={"query": "edema", "locale": "en"})
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["term"], "Edema")
        self.assertIn("fluid", data["simple_explanation"].lower())


if __name__ == "__main__":
    unittest.main()
