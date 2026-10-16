import type { HealthNote } from "./healthNotes.ts";
import { SAMPLE_HEALTH_NOTES, createHealthNote } from "./healthNotes.ts";

// Server-side in-memory health notes collection for API integration
let serverNotes: HealthNote[] = [...SAMPLE_HEALTH_NOTES];

export function getServerHealthNotes(): HealthNote[] {
  return [...serverNotes];
}

export function addServerHealthNote(noteData: Omit<HealthNote, "id" | "createdAt" | "updatedAt">): HealthNote {
  const newNote = createHealthNote(noteData);
  serverNotes = [newNote, ...serverNotes];
  return newNote;
}

export function updateServerHealthNote(id: string, updates: Partial<Pick<HealthNote, "title" | "body" | "tags" | "date">>): HealthNote | null {
  const index = serverNotes.findIndex((n) => n.id === id);
  if (index === -1) return null;
  serverNotes[index] = {
    ...serverNotes[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  return serverNotes[index];
}

export function deleteServerHealthNote(id: string): boolean {
  const initialLen = serverNotes.length;
  serverNotes = serverNotes.filter((n) => n.id !== id);
  return serverNotes.length < initialLen;
}

export function resetServerHealthNotes(): void {
  serverNotes = [...SAMPLE_HEALTH_NOTES];
}
