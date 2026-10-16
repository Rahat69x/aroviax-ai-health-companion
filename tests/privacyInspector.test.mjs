import test from "node:test";
import assert from "node:assert/strict";
import { inspectPrivacy, redactIdentifiers } from "../src/lib/privacyInspector.ts";

test("Privacy Inspector: detects and flags email addresses", () => {
  const result = inspectPrivacy("Contact my primary care physician at doctor.smith@hospital-health.org for records.");
  assert.equal(result.hasIdentifiers, true);
  assert.equal(result.identifiers.length, 1);
  assert.equal(result.identifiers[0].type, "email");
  assert.equal(result.identifiers[0].match, "doctor.smith@hospital-health.org");
  assert.ok(result.redactedText.includes("[REDACTED_EMAIL]"));
});

test("Privacy Inspector: detects and flags standard phone numbers", () => {
  const result = inspectPrivacy("My home phone is (555) 234-5678 and mobile is 555-890-1234");
  assert.equal(result.hasIdentifiers, true);
  assert.ok(result.identifiers.some((i) => i.type === "phone"));
  assert.ok(result.redactedText.includes("[REDACTED_PHONE]"));
});

test("Privacy Inspector: detects SSN and long patient record numbers", () => {
  const result = inspectPrivacy("Patient SSN on file is 123-45-6789 and clinic MRN is 98765432101");
  assert.equal(result.hasIdentifiers, true);
  assert.ok(result.identifiers.some((i) => i.type === "ssn_id"));
  assert.ok(result.redactedText.includes("[REDACTED_ID]"));
});

test("Privacy Inspector: detects birth dates", () => {
  const result = inspectPrivacy("Patient DOB: 04/12/1985 reported today");
  assert.equal(result.hasIdentifiers, true);
  assert.ok(result.identifiers.some((i) => i.type === "date_of_birth"));
});

test("Privacy Inspector: clean text without identifiers passes cleanly", () => {
  const cleanInput = "I have had mild headaches after working late at my desk for three days.";
  const result = inspectPrivacy(cleanInput);
  assert.equal(result.hasIdentifiers, false);
  assert.equal(result.identifiers.length, 0);
  assert.equal(result.redactedText, cleanInput);
});

test("Privacy Inspector: redactIdentifiers replaces multiple mixed PII cleanly", () => {
  const input = "Reach out to patient jane.doe@example.com at 555-432-1098 regarding SSN 000-11-2222.";
  const redacted = redactIdentifiers(input);
  assert.ok(!redacted.includes("jane.doe@example.com"));
  assert.ok(!redacted.includes("555-432-1098"));
  assert.ok(!redacted.includes("000-11-2222"));
  assert.ok(redacted.includes("[REDACTED_EMAIL]"));
  assert.ok(redacted.includes("[REDACTED_PHONE]"));
  assert.ok(redacted.includes("[REDACTED_ID]"));
});
