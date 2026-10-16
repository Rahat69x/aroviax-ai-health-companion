/**
 * @file healthNotes.ts
 * Personal Health Notes & Timeline - localStorage persistence.
 * All data stored device-side only. Never transmitted.
 */

export interface HealthNote {
  id: string;
  date: string;
  title: string;
  body: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = "medisupport_health_notes";

export function loadHealthNotes(): HealthNote[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as HealthNote[]) : [];
  } catch { return []; }
}

export function saveHealthNotes(notes: HealthNote[]): void {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(notes)); }
  catch (e) { console.warn("Could not save health notes:", e); }
}

export function createHealthNote(partial: Omit<HealthNote, "id" | "createdAt" | "updatedAt">): HealthNote {
  const now = new Date().toISOString();
  return { ...partial, id: `note_${Date.now()}_${Math.random().toString(36).slice(2,6)}`, createdAt: now, updatedAt: now };
}

export function updateHealthNote(notes: HealthNote[], id: string, updates: Partial<Pick<HealthNote, "title" | "body" | "tags" | "date">>): HealthNote[] {
  return notes.map(n => n.id === id ? { ...n, ...updates, updatedAt: new Date().toISOString() } : n);
}

export function deleteHealthNote(notes: HealthNote[], id: string): HealthNote[] {
  return notes.filter(n => n.id !== id);
}

export function searchHealthNotes(notes: HealthNote[], query: string): HealthNote[] {
  if (!query.trim()) return notes;
  const q = query.toLowerCase();
  return notes.filter(n =>
    n.title.toLowerCase().includes(q) ||
    n.body.toLowerCase().includes(q) ||
    n.tags.some(t => t.toLowerCase().includes(q))
  );
}

export const SAMPLE_HEALTH_NOTES: HealthNote[] = [
  {
    id: "sample_note_1",
    date: "2026-10-10",
    title: "Blood pressure reading at pharmacy",
    body: "Reading was 128/82. Pharmacist said to monitor and schedule a check-up if consistently above 130/85. Will track again next week.",
    tags: ["blood pressure", "pharmacy", "monitoring"],
    createdAt: "2026-10-10T09:00:00Z",
    updatedAt: "2026-10-10T09:00:00Z",
  },
  {
    id: "sample_note_2",
    date: "2026-10-14",
    title: "Post-appointment notes — Dr. Hossain",
    body: "Doctor reviewed symptoms. Recommended increasing water intake, reducing screen time. Follow-up in 4 weeks. Lab results expected in 3 days.",
    tags: ["appointment", "doctor", "follow-up"],
    createdAt: "2026-10-14T14:30:00Z",
    updatedAt: "2026-10-14T14:30:00Z",
  },
];
