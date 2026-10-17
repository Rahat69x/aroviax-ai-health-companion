/**
 * @file symptomOrganizer.ts
 * Guided Symptom Organizer — structures user-entered symptom data.
 * NEVER diagnoses or implies a diagnosis. Purely organizational.
 */

export interface SymptomOrganizerData {
  mainConcern: string;
  onsetDate: string;
  durationDescription: string;
  severityRating: number;
  location: string;
  qualities: string[];
  associatedSymptoms: string;
  triggers: string;
  relievingFactors: string;
  relevantContext: string;
  questionsForDoctor: string[];
}

export const QUALITY_OPTIONS = [
  "Sharp", "Dull ache", "Throbbing", "Burning", "Stabbing",
  "Pressure / heaviness", "Tingling / numbness", "Cramping",
  "Tightness", "Comes and goes", "Constant",
];

export const CONTEXT_PROMPTS = [
  "Have you had this before?",
  "Any recent travel, illness, or injury?",
  "Any changes to diet, sleep, or activity?",
  "Any relevant family history you know of?",
  "Any medications or supplements you take?",
];

export const DEFAULT_ORGANIZER_DATA: SymptomOrganizerData = {
  mainConcern: "",
  onsetDate: "",
  durationDescription: "",
  severityRating: 3,
  location: "",
  qualities: [],
  associatedSymptoms: "",
  triggers: "",
  relievingFactors: "",
  relevantContext: "",
  questionsForDoctor: [
    "What do you think is causing this?",
    "Are there any tests you recommend?",
    "What warning signs should prompt me to call immediately?",
  ],
};

export function generateSymptomSummaryText(data: SymptomOrganizerData): string {
  const lines: string[] = [];
  lines.push("=== SYMPTOM ORGANIZER SUMMARY ===");
  lines.push("Prepared with Aroviax — AI Health Companion (Non-Diagnostic Tool)");
  lines.push("All information is self-reported by the patient.");
  lines.push("");
  lines.push(`Main Concern: ${data.mainConcern || "Not specified"}`);
  lines.push(`When it started: ${data.onsetDate || "Not specified"}`);
  lines.push(`Duration / Pattern: ${data.durationDescription || "Not specified"}`);
  lines.push(`User Subjective Severity (0–10): ${data.severityRating}/10`);
  if (data.location) lines.push(`Location on body: ${data.location}`);
  if (data.qualities.length > 0) lines.push(`Qualities: ${data.qualities.join(", ")}`);
  if (data.associatedSymptoms) lines.push(`Associated symptoms: ${data.associatedSymptoms}`);
  if (data.triggers) lines.push(`Triggers: ${data.triggers}`);
  if (data.relievingFactors) lines.push(`What helps: ${data.relievingFactors}`);
  if (data.relevantContext) lines.push(`Relevant context: ${data.relevantContext}`);
  lines.push("");
  lines.push("Questions for my healthcare professional:");
  data.questionsForDoctor.forEach((q, i) => lines.push(`  ${i + 1}. ${q}`));
  lines.push("");
  lines.push("NOTE: This summary was created for personal organization only and does not represent a clinical assessment.");
  return lines.join("\n");
}
