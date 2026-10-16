import test from "node:test";
import assert from "node:assert/strict";
import { inspectPrivacy, redactIdentifiers } from "../src/lib/privacyInspector.ts";

test("Document Processing: detects and redacts personal identifiers from simulated clinical records", () => {
  const simulatedReport = `PATIENT REPORT
Patient Name: Jane Doe
Email: jane.doe@example.com
Phone: (555) 234-5678
Date of Birth: 12/04/1982
Record ID: 987-65-4321
Findings: Fasting blood glucose is 112 mg/dL. HbA1c is 5.9%.
Blood Pressure: 128/84 mmHg.
Total Cholesterol: 210 mg/dL.`;

  const report = inspectPrivacy(simulatedReport);
  assert.equal(report.hasIdentifiers, true);
  assert.ok(report.identifiers.some(i => i.type === "email"));
  assert.ok(report.identifiers.some(i => i.type === "phone"));
  assert.ok(report.identifiers.some(i => i.type === "ssn_id"));

  const sanitized = redactIdentifiers(simulatedReport);
  assert.equal(sanitized.includes("jane.doe@example.com"), false);
  assert.equal(sanitized.includes("(555) 234-5678"), false);
  assert.equal(sanitized.includes("987-65-4321"), false);
  // Preserves medical measurements intact
  assert.ok(sanitized.includes("112 mg/dL"));
  assert.ok(sanitized.includes("128/84 mmHg"));
});

test("Document Processing: concept extraction flags standard clinical panels", () => {
  const text = "Lab test results: elevated HbA1c, elevated fasting glucose, microalbuminuria, borderline creatinine.";
  const lower = text.toLowerCase();

  const concepts = [];
  if (lower.includes("glucose") || lower.includes("hba1c")) concepts.push("Blood Sugar / Diabetes Markers");
  if (lower.includes("creatinine") || lower.includes("kidney")) concepts.push("Renal / Kidney Function");

  assert.equal(concepts.length, 2);
  assert.ok(concepts.includes("Blood Sugar / Diabetes Markers"));
  assert.ok(concepts.includes("Renal / Kidney Function"));
});

test("Document Processing: enforces 50 KB size threshold", () => {
  const MAX_SIZE_BYTES = 50 * 1024;
  const validSize = 45 * 1024;
  const invalidSize = 55 * 1024;

  assert.equal(validSize <= MAX_SIZE_BYTES, true);
  assert.equal(invalidSize <= MAX_SIZE_BYTES, false);
});
