import test from "node:test";
import assert from "node:assert/strict";
import {
  createHealthNote,
  updateHealthNote,
  deleteHealthNote,
  searchHealthNotes,
  SAMPLE_HEALTH_NOTES,
} from "../src/lib/healthNotes.ts";

test("Health Notes: creates dated note with unique ID and timestamps", () => {
  const note = createHealthNote({
    date: "2026-10-15",
    title: "Post-workout hydration note",
    body: "Drank 500 mL water. Felt dizzy for 5 minutes after sprint.",
    tags: ["workout", "dizziness"],
  });

  assert.ok(note.id.startsWith("note_"));
  assert.equal(note.title, "Post-workout hydration note");
  assert.equal(note.tags.length, 2);
  assert.ok(note.createdAt.length > 0);
  assert.ok(note.updatedAt.length > 0);
});

test("Health Notes: updates note fields accurately and updates timestamp", () => {
  const note = createHealthNote({
    date: "2026-10-10",
    title: "Baseline note",
    body: "Initial text",
    tags: ["general"],
  });

  const updatedList = updateHealthNote([note], note.id, {
    title: "Updated Title",
    body: "Updated body text",
  });

  assert.equal(updatedList[0].title, "Updated Title");
  assert.equal(updatedList[0].body, "Updated body text");
  assert.equal(updatedList[0].tags[0], "general");
});

test("Health Notes: deletes note by ID correctly", () => {
  const note1 = createHealthNote({ date: "2026-10-01", title: "Note 1", body: "Text 1", tags: [] });
  const note2 = createHealthNote({ date: "2026-10-02", title: "Note 2", body: "Text 2", tags: [] });

  const remaining = deleteHealthNote([note1, note2], note1.id);
  assert.equal(remaining.length, 1);
  assert.equal(remaining[0].id, note2.id);
});

test("Health Notes: search finds matches across title, body, and tags case-insensitively", () => {
  const notes = [
    ...SAMPLE_HEALTH_NOTES,
    createHealthNote({
      date: "2026-10-16",
      title: "Migraine log",
      body: "Pain rated 6/10 on right side behind eye",
      tags: ["headache", "migraine", "pain"],
    }),
  ];

  const searchResults1 = searchHealthNotes(notes, "migraine");
  assert.ok(searchResults1.length >= 1);
  assert.ok(searchResults1.some(n => n.tags.includes("migraine")));

  const searchResults2 = searchHealthNotes(notes, "blood pressure");
  assert.ok(searchResults2.length >= 1);

  const emptySearch = searchHealthNotes(notes, "");
  assert.equal(emptySearch.length, notes.length);
});
