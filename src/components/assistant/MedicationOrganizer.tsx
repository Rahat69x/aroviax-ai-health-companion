"use client";

import React, { useState } from "react";
import { Pill, Plus, Trash2, Edit3, Save, X, AlertCircle, Printer, ChevronDown, ChevronUp, Download } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import {
  MedicationEntry,
  loadMedications,
  saveMedications,
  createMedicationEntry,
  SAMPLE_MEDICATIONS,
  PHARMACIST_QUESTION_TEMPLATES,
} from "@/lib/medicationOrganizer";

function useMedications() {
  const [entries, setEntries] = React.useState<MedicationEntry[]>(() => {
    const loaded = loadMedications();
    return loaded.length > 0 ? loaded : SAMPLE_MEDICATIONS;
  });

  const save = (updated: MedicationEntry[]) => {
    setEntries(updated);
    saveMedications(updated);
  };

  return { entries, save };
}

const EMPTY_FORM = {
  name: "", instructions: "", startDate: "", endDate: "", purpose: "",
  reminders: "", pharmacistQuestions: [""], isActive: true,
};

export function MedicationOrganizer() {
  const { entries, save } = useMedications();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [showTemplates, setShowTemplates] = useState(false);

  const resetForm = () => { setForm(EMPTY_FORM); setEditId(null); setShowForm(false); };

  const handleEdit = (entry: MedicationEntry) => {
    setForm({
      name: entry.name, instructions: entry.instructions,
      startDate: entry.startDate, endDate: entry.endDate || "",
      purpose: entry.purpose, reminders: entry.reminders || "",
      pharmacistQuestions: entry.pharmacistQuestions.length > 0 ? entry.pharmacistQuestions : [""],
      isActive: entry.isActive,
    });
    setEditId(entry.id);
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    const questions = form.pharmacistQuestions.filter(q => q.trim());
    if (editId) {
      const updated = entries.map(en =>
        en.id === editId ? { ...en, ...form, pharmacistQuestions: questions, endDate: form.endDate || undefined } : en
      );
      save(updated);
    } else {
      const entry = createMedicationEntry({ ...form, pharmacistQuestions: questions, endDate: form.endDate || undefined });
      save([entry, ...entries]);
    }
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (confirm("Remove this medication entry?")) save(entries.filter(e => e.id !== id));
  };

  const addQuestion = () => setForm(f => ({ ...f, pharmacistQuestions: [...f.pharmacistQuestions, ""] }));
  const updateQuestion = (i: number, val: string) =>
    setForm(f => ({ ...f, pharmacistQuestions: f.pharmacistQuestions.map((q, idx) => idx === i ? val : q) }));
  const removeQuestion = (i: number) =>
    setForm(f => ({ ...f, pharmacistQuestions: f.pharmacistQuestions.filter((_, idx) => idx !== i) }));

  const addTemplateQuestion = (q: string) => {
    if (!form.pharmacistQuestions.includes(q))
      setForm(f => ({ ...f, pharmacistQuestions: [...f.pharmacistQuestions.filter(x => x.trim()), q] }));
  };

  const handleExport = () => {
    const lines = ["Name,Instructions,Start Date,End Date,Purpose,Active,Pharmacist Questions"];
    entries.forEach(e => {
      lines.push(`"${e.name}","${e.instructions}","${e.startDate}","${e.endDate||""}","${e.purpose}","${e.isActive}","${e.pharmacistQuestions.join("; ")}"`);
    });
    const blob = new Blob([lines.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "medications.csv";
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl font-bold text-[#172554]">Medication Information Organizer</h2>
            <StatusBadge status="On your device" />
          </div>
          <p className="text-sm text-[#64748B]">Record medications exactly as given by your doctor or pharmacist. This tool never recommends doses or changes prescriptions.</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button onClick={handleExport} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#334155] bg-white hover:bg-[#E8F6F4] border border-[#E2E8F0] transition-colors">
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>
          <button onClick={() => window.print()} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#334155] bg-white hover:bg-[#E8F6F4] border border-[#E2E8F0] transition-colors">
            <Printer className="w-3.5 h-3.5" /> Print
          </button>
          <button onClick={() => { setShowForm(true); setEditId(null); setForm(EMPTY_FORM); }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-[#0D817C] hover:bg-[#086B67] transition-colors">
            <Plus className="w-4 h-4" /> Add Medication
          </button>
        </div>
      </div>

      {/* Safety notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
        <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="text-sm text-amber-900">
          <strong>Important:</strong> This organizer records only information you enter. It does not verify dosages, check interactions, or provide prescriptions. Always consult your doctor or pharmacist before making any changes to your medications.
        </div>
      </div>

      {/* Add / Edit Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-2xl border border-[#0D817C]/30 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-[#172554]">{editId ? "Edit Medication" : "Add Medication"}</h3>
            <button onClick={resetForm} className="p-1.5 rounded-lg hover:bg-[#E8F6F4] text-[#64748B]"><X className="w-4 h-4" /></button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#334155] mb-1">Medication Name & Strength <span className="text-red-500">*</span></label>
                <input required value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))}
                  placeholder="e.g. Metformin 500 mg"
                  className="w-full p-2.5 rounded-xl border border-[#E2E8F0] focus:border-[#0D817C] text-sm outline-none" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#334155] mb-1">Instructions (as given by doctor/pharmacist)</label>
                <textarea value={form.instructions} onChange={e => setForm(f => ({...f, instructions: e.target.value}))}
                  placeholder="e.g. Take one tablet twice daily with meals"
                  rows={2} className="w-full p-2.5 rounded-xl border border-[#E2E8F0] focus:border-[#0D817C] text-sm outline-none resize-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#334155] mb-1">Start Date</label>
                <input type="date" value={form.startDate} onChange={e => setForm(f => ({...f, startDate: e.target.value}))}
                  className="w-full p-2.5 rounded-xl border border-[#E2E8F0] text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#334155] mb-1">End Date (if applicable)</label>
                <input type="date" value={form.endDate} onChange={e => setForm(f => ({...f, endDate: e.target.value}))}
                  className="w-full p-2.5 rounded-xl border border-[#E2E8F0] text-sm" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#334155] mb-1">Purpose (your words)</label>
                <input value={form.purpose} onChange={e => setForm(f => ({...f, purpose: e.target.value}))}
                  placeholder="e.g. As prescribed for blood pressure"
                  className="w-full p-2.5 rounded-xl border border-[#E2E8F0] focus:border-[#0D817C] text-sm outline-none" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#334155] mb-1">Storage / Reminder Notes</label>
                <input value={form.reminders} onChange={e => setForm(f => ({...f, reminders: e.target.value}))}
                  placeholder="e.g. Store in cool, dry place. Take with food."
                  className="w-full p-2.5 rounded-xl border border-[#E2E8F0] focus:border-[#0D817C] text-sm outline-none" />
              </div>
            </div>

            {/* Pharmacist questions */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-[#334155]">Questions for my pharmacist / doctor</label>
                <button type="button" onClick={() => setShowTemplates(s => !s)}
                  className="text-xs text-[#0D817C] font-semibold hover:underline">
                  {showTemplates ? "Hide" : "Show"} templates
                </button>
              </div>
              {showTemplates && (
                <div className="bg-[#E8F6F4] rounded-xl p-3 mb-3 space-y-2">
                  {Object.entries(PHARMACIST_QUESTION_TEMPLATES).map(([cat, qs]) => (
                    <div key={cat}>
                      <div className="text-[10px] font-bold uppercase text-[#0D817C] mb-1 capitalize">{cat.replace(/([A-Z])/g, ' $1')}</div>
                      {qs.map(q => (
                        <button key={q} type="button" onClick={() => addTemplateQuestion(q)}
                          className="block text-left text-xs text-[#334155] hover:text-[#0D817C] py-0.5 w-full">
                          + {q}
                        </button>
                      ))}
                    </div>
                  ))}
                </div>
              )}
              {form.pharmacistQuestions.map((q, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <input value={q} onChange={e => updateQuestion(i, e.target.value)} placeholder={`Question ${i + 1}`}
                    className="flex-1 p-2 rounded-xl border border-[#E2E8F0] text-sm outline-none focus:border-[#0D817C]" />
                  <button type="button" onClick={() => removeQuestion(i)} className="p-2 text-[#64748B] hover:text-red-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button type="button" onClick={addQuestion}
                className="text-xs text-[#0D817C] font-semibold hover:underline flex items-center gap-1">
                <Plus className="w-3.5 h-3.5" /> Add question
              </button>
            </div>

            <div className="flex items-center gap-3 pt-2 border-t border-[#E2E8F0]">
              <button type="button" onClick={resetForm}
                className="px-4 py-2 rounded-xl text-sm text-[#64748B] border border-[#E2E8F0] hover:bg-[#F8FAFC]">Cancel</button>
              <button type="submit"
                className="px-6 py-2 rounded-xl text-sm font-semibold text-white bg-[#0D817C] hover:bg-[#086B67] flex items-center gap-2">
                <Save className="w-4 h-4" /> {editId ? "Save Changes" : "Add Medication"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Entries list */}
      {entries.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-12 text-center text-[#64748B]">
          <Pill className="w-10 h-10 text-[#E2E8F0] mx-auto mb-3" />
          <p className="font-semibold text-[#334155]">No medications added yet</p>
          <p className="text-sm mt-1">Add a medication using the button above to get started.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map(entry => (
            <div key={entry.id} className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden">
              <div className="p-4 flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-[#E8F6F4] flex items-center justify-center shrink-0">
                    <Pill className="w-5 h-5 text-[#0D817C]" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-[#172554]">{entry.name}</span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${entry.isActive ? "bg-[#E8F6F4] text-[#0D817C] border-[#0D817C]/20" : "bg-slate-100 text-slate-500 border-slate-200"}`}>
                        {entry.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <p className="text-sm text-[#64748B] mt-0.5 truncate">{entry.purpose}</p>
                    <p className="text-xs text-[#64748B] mt-0.5">Started: {entry.startDate}{entry.endDate ? ` → ${entry.endDate}` : ""}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => setExpandedId(expandedId === entry.id ? null : entry.id)}
                    className="p-2 rounded-lg hover:bg-[#E8F6F4] text-[#64748B]">
                    {expandedId === entry.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  <button onClick={() => handleEdit(entry)} className="p-2 rounded-lg hover:bg-[#E8F6F4] text-[#64748B]">
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(entry.id)} className="p-2 rounded-lg hover:bg-red-50 text-[#64748B] hover:text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              {expandedId === entry.id && (
                <div className="border-t border-[#E2E8F0] p-4 space-y-3 bg-[#F8FAFC]">
                  {entry.instructions && (
                    <div>
                      <div className="text-xs font-bold text-[#334155] uppercase tracking-wider mb-1">Instructions (as given)</div>
                      <p className="text-sm text-[#334155]">{entry.instructions}</p>
                    </div>
                  )}
                  {entry.reminders && (
                    <div>
                      <div className="text-xs font-bold text-[#334155] uppercase tracking-wider mb-1">Reminders / Storage</div>
                      <p className="text-sm text-[#334155]">{entry.reminders}</p>
                    </div>
                  )}
                  {entry.pharmacistQuestions.length > 0 && (
                    <div>
                      <div className="text-xs font-bold text-[#334155] uppercase tracking-wider mb-1">Questions for pharmacist / doctor</div>
                      <ul className="space-y-1">
                        {entry.pharmacistQuestions.map((q, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-[#334155]">
                            <span className="text-[#0D817C] font-bold mt-0.5">□</span> {q}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      <p className="text-xs text-[#64748B] text-center">All medication data is stored on your device only. Clear it any time using the Clear Data button above.</p>
    </div>
  );
}
