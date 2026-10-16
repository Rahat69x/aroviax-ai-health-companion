import type { MedicationEntry } from "./medicationOrganizer.ts";
import {
  SAMPLE_MEDICATIONS,
  createMedicationEntry,
} from "./medicationOrganizer.ts";

let serverMedications: MedicationEntry[] = [...SAMPLE_MEDICATIONS];

export function getServerMedications(): MedicationEntry[] {
  return [...serverMedications];
}

export function addServerMedication(
  partial: Omit<MedicationEntry, "id" | "addedAt">
): MedicationEntry {
  const newEntry = createMedicationEntry(partial);
  serverMedications = [newEntry, ...serverMedications];
  return newEntry;
}

export function resetServerMedications(): void {
  serverMedications = [...SAMPLE_MEDICATIONS];
}
