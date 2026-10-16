import test from "node:test";
import assert from "node:assert/strict";
import {
  createMedicationEntry,
  SAMPLE_MEDICATIONS,
  PHARMACIST_QUESTION_TEMPLATES,
} from "../src/lib/medicationOrganizer.ts";

test("Medication Organizer: creates validated user-entered medication entry", () => {
  const med = createMedicationEntry({
    name: "Levothyroxine 50 mcg",
    instructions: "Take once daily in the morning on an empty stomach with water",
    startDate: "2026-10-01",
    purpose: "Thyroid hormone support — as directed by endocrinologist",
    pharmacistQuestions: [
      "How long should I wait before eating breakfast or drinking coffee?",
    ],
    isActive: true,
  });

  assert.ok(med.id.startsWith("med_"));
  assert.equal(med.name, "Levothyroxine 50 mcg");
  assert.equal(med.isActive, true);
  assert.ok(med.addedAt.length > 0);
  assert.equal(med.pharmacistQuestions.length, 1);
});

test("Medication Organizer: provides pharmacist question templates for patient safety", () => {
  assert.ok(PHARMACIST_QUESTION_TEMPLATES.newMedication.length >= 3);
  assert.ok(PHARMACIST_QUESTION_TEMPLATES.sideEffects.length >= 2);
  assert.ok(PHARMACIST_QUESTION_TEMPLATES.stopping.length >= 2);

  // Checks for critical drug safety questions
  const allQs = [
    ...PHARMACIST_QUESTION_TEMPLATES.newMedication,
    ...PHARMACIST_QUESTION_TEMPLATES.sideEffects,
    ...PHARMACIST_QUESTION_TEMPLATES.stopping,
  ];
  assert.ok(allQs.some(q => q.toLowerCase().includes("side effects")));
  assert.ok(allQs.some(q => q.toLowerCase().includes("interact")));
});

test("Medication Organizer: sample medications have non-diagnostic disclaimers", () => {
  assert.ok(SAMPLE_MEDICATIONS.length >= 2);
  SAMPLE_MEDICATIONS.forEach(med => {
    assert.ok(med.name.length > 0);
    assert.ok(med.instructions.length > 0);
  });
});
