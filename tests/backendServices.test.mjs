import test from "node:test";
import assert from "node:assert/strict";
import { checkSafetySignal } from "../src/lib/safetySignals.ts";
import {
  generateSymptomSummaryText,
  DEFAULT_ORGANIZER_DATA,
} from "../src/lib/symptomOrganizer.ts";
import { lookupTerm } from "../src/lib/termTranslator.ts";
import { searchTrustedSources, TRUSTED_SOURCE_LIST } from "../src/lib/trustedSources.ts";
import {
  getServerHealthNotes,
  addServerHealthNote,
  updateServerHealthNote,
  deleteServerHealthNote,
  resetServerHealthNotes,
} from "../src/lib/healthNotesStore.ts";
import {
  getServerMedications,
  addServerMedication,
  resetServerMedications,
} from "../src/lib/medicationStore.ts";

test("Backend Service: symptom-summary generation with safety verification", () => {
  const data = {
    ...DEFAULT_ORGANIZER_DATA,
    mainConcern: "Persistent tension headache across temples",
    duration: "4 days",
    severityRating: 4,
    qualities: ["Dull ache", "Pressure"],
    questionsForDoctor: ["Is this related to screen time or stress?"],
  };

  const summary = generateSymptomSummaryText(data);
  assert.ok(summary.includes("Persistent tension headache across temples"));
  assert.ok(summary.includes("User Subjective Severity (0–10): 4/10"));

  const safety = checkSafetySignal(data.mainConcern);
  assert.equal(safety.hasEmergencySignal, false);
});

test("Backend Service: emergency signal interception", () => {
  const acuteConcern = "Sudden severe chest pain radiating to left jaw";
  const safety = checkSafetySignal(acuteConcern);
  assert.equal(safety.hasEmergencySignal, true);
  assert.ok(safety.detectedPhrases.includes("chest pain"));
});

test("Backend Service: medical terms lookup with educational breakdown", () => {
  const term = lookupTerm("Hypertension");
  assert.ok(term);
  assert.equal(term.term, "Hypertension");
  assert.ok(term.simple.length > 0);
  assert.ok(term.standard.length > 0);
  assert.ok(term.detailed.length > 0);
  assert.ok(term.whatItDoesNotTellYou.length > 0);

  // Unknown term returns null for safe fallback handling
  assert.equal(lookupTerm("NonExistentTermXYZ"), null);
});

test("Backend Service: trusted sources search and categorization", () => {
  assert.ok(TRUSTED_SOURCE_LIST.length >= 5);
  const result = searchTrustedSources("mental");
  assert.ok(result.sources.length >= 1);
  assert.ok(result.sources.some(s => s.id === "nimh_mental"));
  assert.ok(result.disclaimer.includes("publicly available"));
});

test("Backend Service: health notes store CRUD operations", () => {
  resetServerHealthNotes();
  const initial = getServerHealthNotes();
  assert.ok(initial.length >= 1);

  // Add note
  const newNote = addServerHealthNote({
    date: "2026-10-16",
    title: "Post-lunch blood glucose check",
    body: "Reading 108 mg/dL 2 hours post-meal.",
    tags: ["glucose", "routine"],
  });
  assert.ok(newNote.id.startsWith("note_"));

  // Verify added
  const updatedList = getServerHealthNotes();
  assert.equal(updatedList[0].id, newNote.id);

  // Update note
  const updatedNote = updateServerHealthNote(newNote.id, {
    body: "Reading revised: 104 mg/dL.",
  });
  assert.ok(updatedNote);
  assert.equal(updatedNote.body, "Reading revised: 104 mg/dL.");

  // Delete note
  const deleted = deleteServerHealthNote(newNote.id);
  assert.equal(deleted, true);
  const afterDelete = getServerHealthNotes();
  assert.equal(afterDelete.some(n => n.id === newNote.id), false);
});

test("Backend Service: medication store management with non-diagnostic safeguards", () => {
  resetServerMedications();
  const meds = getServerMedications();
  assert.ok(meds.length >= 1);

  const newMed = addServerMedication({
    name: "Lisinopril 10 mg",
    instructions: "One tablet daily in the morning",
    purpose: "Blood pressure support — per physician instructions",
    startDate: "2026-10-01",
    pharmacistQuestions: ["What are common interactions with over-the-counter NSAIDs?"],
    isActive: true,
  });

  assert.ok(newMed.id.startsWith("med_"));
  assert.equal(newMed.name, "Lisinopril 10 mg");
  const currentList = getServerMedications();
  assert.equal(currentList[0].name, "Lisinopril 10 mg");
});
