/**
 * @file medicationOrganizer.ts
 * @description Client-side medication information organizer for MediSupport AI.
 *
 * GOVERNANCE RULES:
 * 1. Stores only what the USER enters — never generates dosages or recommendations.
 * 2. Labels all entries as "user-entered" and "not verified."
 * 3. Does NOT resolve medication conflicts or interpret interactions.
 * 4. Medication names and measurements stored exactly as the user typed them.
 */

export interface MedicationEntry {
  id: string;
  name: string;
  instructions: string;
  startDate: string;
  endDate?: string;
  purpose: string;
  reminders?: string;
  pharmacistQuestions: string[];
  isActive: boolean;
  addedAt: string;
}

const STORAGE_KEY = "medisupport_medications";

export function loadMedications(): MedicationEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as MedicationEntry[];
  } catch {
    return [];
  }
}

export function saveMedications(entries: MedicationEntry[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch (e) {
    console.warn("Could not save medication entries:", e);
  }
}

export function createMedicationEntry(
  partial: Omit<MedicationEntry, "id" | "addedAt">
): MedicationEntry {
  return {
    ...partial,
    id: `med_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    addedAt: new Date().toISOString(),
  };
}

export const SAMPLE_MEDICATIONS: MedicationEntry[] = [
  {
    id: "sample_med_1",
    name: "Metformin 500 mg",
    instructions: "Take one tablet twice daily with meals (morning and evening) as directed by doctor.",
    startDate: "2026-09-15",
    purpose: "Blood sugar management — as told by my doctor",
    reminders: "Store away from heat and moisture. Take with food to reduce stomach upset.",
    pharmacistQuestions: [
      "What should I do if I miss a dose?",
      "Are there any foods I should avoid while taking this?",
    ],
    isActive: true,
    addedAt: "2026-09-15T10:00:00Z",
  },
  {
    id: "sample_med_2",
    name: "Folic Acid 5 mg",
    instructions: "One tablet daily in the morning before breakfast.",
    startDate: "2026-09-15",
    purpose: "As prescribed alongside primary medication",
    pharmacistQuestions: ["Is this dose appropriate with my other medications?"],
    isActive: true,
    addedAt: "2026-09-15T10:01:00Z",
  },
];

export const PHARMACIST_QUESTION_TEMPLATES: Record<string, string[]> = {
  newMedication: [
    "What is the main goal of this medication?",
    "What common side effects should I watch for?",
    "Does this interact with any vitamins, supplements, or foods?",
    "What should I do if I miss a dose?",
    "How and where should I store this medication?",
  ],
  sideEffects: [
    "I have noticed a symptom — is this a known side effect?",
    "At what point should I call your office about a side effect?",
    "Is there a different formulation that may cause fewer side effects?",
  ],
  stopping: [
    "Can I stop this medication on my own, or do I need to taper?",
    "What might happen if I abruptly discontinue this medication?",
  ],
};

