"use client";

import React, { useState } from "react";
import { StickyNote, Plus, Trash2, Edit3, Save, X, Search, Download, Tag, Clock } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import {
  HealthNote,
  loadHealthNotes,
  saveHealthNotes,
  createHealthNote,
  updateHealthNote,
  deleteHealthNote,
  searchHealthNotes,
  SAMPLE_HEALTH_NOTES,
} from "@/lib/healthNotes";

function useHealthNotes() {
  const [notes, setNotes] = React.useState<HealthNote[]>(() => {
    const loaded = loadHealthNotes();
    return loaded.length > 0 ? loaded : SAMPLE_HEALTH_NOTES;
  });
  const save = (updated: HealthNote[]) => { setNotes(updated); saveHealthNotes(updated); };
  return { notes, save };
}

const EMPTY_FORM = { date: new Date().toISOString().slice(0, 10), title: "", body: "", tags: [] as string[], tagInput: "" };

export function PersonalHealthNotes() {
  const { notes, save } = useHealthNotes();
  const [query, setQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const filtered = searchHealthNotes(notes, query).sort((a, b) => b.date.localeCompare(a.date));

  const resetForm = () => { setForm(EMPTY_FORM); setEditId(null); setShowForm(false); };

  const handleEdit = (note: HealthNote) => {
    setForm({ date: note.date, title: note.title, body: note.body, tags: note.tags, tagInput: "" });
    setEditId(note.id);
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.body.trim()) return;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { tagInput: _, ...noteData } = form;
    if (editId) {
      save(updateHealthNote(notes, editId, noteData));
    } else {
      save([createHealthNote(noteData), ...notes]);
    }
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this note?")) save(deleteHealthNote(notes, id));
  };

  const addTag = () => {
    const t = form.tagInput.trim().toLowerCase();
    if (t && !form.tags.includes(t)) setForm(f => ({ ...f, tags: [...f.tags, t], tagInput: "" }));
  };

  const removeTag = (tag: string) => setForm(f => ({ ...f, tags: f.tags.filter(t => t !== tag) }));

  const handleExport = () => {
    const text = notes.map(n =>
      `=== ${n.date}: ${n.title} ===\n${n.body}\nTags: ${n.tags.join(", ") || "none"}\n`
    ).join("\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "health_notes.txt";
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl font-bold text-[#172554]">Personal Health Notes & Timeline</h2>
            <StatusBadge status="On your device" />
          </div>
          <p className="text-sm text-[#64748B]">Private notes and observations stored only on this device. Organize by date. Never transmitted or analyzed by AI.</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button onClick={handleExport} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#334155] bg-white hover:bg-[#E8F6F4] border border-[#E2E8F0]">
            <Download className="w-3.5 h-3.5" /> Export
          </button>
          <button onClick={() => { setShowForm(true); setEditId(null); setForm(EMPTY_FORM); }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-[#0D817C] hover:bg-[#086B67]">
            <Plus className="w-4 h-4" /> New Note
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#64748B]" />
        <input
          type="search"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search notes by title, content, or tag..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E2E8F0] text-sm outline-none focus:border-[#0D817C] bg-white"
        />
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-2xl border border-[#0D817C]/30 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-[#172554]">{editId ? "Edit Note" : "New Note"}</h3>
            <button onClick={resetForm} className="p-1.5 rounded-lg hover:bg-[#E8F6F4] text-[#64748B]"><X className="w-4 h-4" /></button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#334155] mb-1">Date</label>
                <input type="date" value={form.date} onChange={e => setForm(f => ({...f, date: e.target.value}))}
                  className="w-full p-2.5 rounded-xl border border-[#E2E8F0] text-sm" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#334155] mb-1">Title <span className="text-red-500">*</span></label>
                <input required value={form.title} onChange={e => setForm(f => ({...f, title: e.target.value}))}
                  placeholder="Brief title for this note"
                  className="w-full p-2.5 rounded-xl border border-[#E2E8F0] focus:border-[#0D817C] text-sm outline-none" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#334155] mb-1">Note Content <span className="text-red-500">*</span></label>
              <textarea required value={form.body} onChange={e => setForm(f => ({...f, body: e.target.value}))}
                placeholder="Write your health observation, appointment notes, or reminder here..."
                rows={5} className="w-full p-3 rounded-xl border border-[#E2E8F0] focus:border-[#0D817C] text-sm outline-none resize-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#334155] mb-2">Tags</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {form.tags.map(tag => (
                  <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-[#E8F6F4] text-[#0D817C] border border-[#0D817C]/20">
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)}><X className="w-3 h-3" /></button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input value={form.tagInput} onChange={e => setForm(f => ({...f, tagInput: e.target.value}))}
                  onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addTag())}
                  placeholder="Add tag and press Enter"
                  className="flex-1 p-2 rounded-xl border border-[#E2E8F0] text-sm outline-none focus:border-[#0D817C]" />
                <button type="button" onClick={addTag}
                  className="px-3 py-2 rounded-xl text-xs font-semibold text-white bg-[#0D817C] hover:bg-[#086B67]">
                  Add
                </button>
              </div>
            </div>
            <div className="flex gap-3 pt-2 border-t border-[#E2E8F0]">
              <button type="button" onClick={resetForm}
                className="px-4 py-2 rounded-xl text-sm text-[#64748B] border border-[#E2E8F0]">Cancel</button>
              <button type="submit"
                className="px-6 py-2 rounded-xl text-sm font-semibold text-white bg-[#0D817C] hover:bg-[#086B67] flex items-center gap-2">
                <Save className="w-4 h-4" /> {editId ? "Save Changes" : "Save Note"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Notes timeline */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-12 text-center text-[#64748B]">
          <StickyNote className="w-10 h-10 text-[#E2E8F0] mx-auto mb-3" />
          <p className="font-semibold text-[#334155]">{query ? "No notes match your search" : "No notes yet"}</p>
          <p className="text-sm mt-1">{query ? "Try a different search term." : "Create your first note using the button above."}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(note => (
            <div key={note.id} className="bg-white rounded-2xl border border-[#E2E8F0] p-5 hover:border-[#0D817C]/30 transition-colors">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-3.5 h-3.5 text-[#0D817C] shrink-0" />
                    <span className="text-xs font-semibold text-[#0D817C]">{note.date}</span>
                  </div>
                  <h4 className="font-bold text-[#172554] mb-2">{note.title}</h4>
                  <p className="text-sm text-[#334155] leading-relaxed whitespace-pre-wrap">{note.body}</p>
                  {note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {note.tags.map(tag => (
                        <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#E8F6F4] text-[#0D817C]">
                          <Tag className="w-2.5 h-2.5" />{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => handleEdit(note)} className="p-2 rounded-lg hover:bg-[#E8F6F4] text-[#64748B]">
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(note.id)} className="p-2 rounded-lg hover:bg-red-50 text-[#64748B] hover:text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
