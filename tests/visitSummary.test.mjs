import test from "node:test";
import assert from "node:assert/strict";
import {
  generateFormattedVisitText,
  DEFAULT_VISIT_PREP_DATA,
  SAMPLE_FICTIONAL_VISIT_DATA,
} from "../src/lib/visitSummary.ts";

test("Visit Summary: generates structured 1-page printable text with disclaimer", () => {
  const summary = generateFormattedVisitText(SAMPLE_FICTIONAL_VISIT_DATA);
  assert.ok(summary.includes("PATIENT VISIT APPOINTMENT SUMMARY"));
  assert.ok(summary.includes("NOTICE FOR CLINICIAN"));
  assert.ok(summary.includes("All entries are self-reported. No automated diagnosis"));
  assert.ok(summary.includes("Intermittent tension headaches and neck stiffness over the past 3 weeks"));
  assert.ok(summary.includes("User Subjective Severity Rating: 5/10 (Patient's own rating)"));
  assert.ok(summary.includes("PRIORITY QUESTIONS FOR THE CLINICIAN"));
  assert.ok(summary.includes("WHAT TO BRING CHECKLIST"));
});

test("Visit Summary: strictly non-diagnostic invariant", () => {
  const summary = generateFormattedVisitText(DEFAULT_VISIT_PREP_DATA);
  // Ensure the summary never inserts diagnostic scores or probability claims
  assert.equal(summary.includes("Diagnosis:"), false);
  assert.equal(summary.includes("Likely condition"), false);
  assert.equal(summary.includes("Risk score:"), false);
  assert.ok(summary.includes("(Patient's own rating)"));
});

test("Visit Summary: includes caregiver attribution when enabled", () => {
  const caregiverData = {
    ...DEFAULT_VISIT_PREP_DATA,
    isCaregiverMode: true,
    caregiverRelationship: "Daughter supporting elderly parent",
  };
  const summary = generateFormattedVisitText(caregiverData);
  assert.ok(summary.includes("[PREPARED BY CAREGIVER: Daughter supporting elderly parent]"));
});

test("Visit Summary: handles empty fields gracefully without breaking", () => {
  const minimalData = {
    mainConcern: "Sore ankle",
    onset: "",
    progression: "",
    symptomRating: 2,
    qualities: [],
    triggers: "",
    triedSoFar: "",
    currentMedications: "",
    allergies: "",
    questionsForClinician: [],
    whatToBring: [],
  };
  const summary = generateFormattedVisitText(minimalData);
  assert.ok(summary.includes("1. PRIMARY CONCERN"));
  assert.ok(summary.includes("Sore ankle"));
  assert.ok(summary.includes("User Subjective Severity Rating: 2/10"));
  assert.ok(summary.includes("REMINDER: Remove any sensitive personal identity details"));
});
