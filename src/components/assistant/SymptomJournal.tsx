"use client";

import React, { useState } from "react";
import { Plus, Download, Printer, Trash2, Table, BarChart3 } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";

interface JournalEntry {
  id: string;
  date: string;
  rating: number; // 0-10 user rating
  notes: string;
}

const DEFAULT_SAMPLE_ENTRIES: JournalEntry[] = [
  { id: "e1", date: "2026-10-12", rating: 6, notes: "Afternoon headache after 6 hours of spreadsheet screen time." },
  { id: "e2", date: "2026-10-13", rating: 4, notes: "Took regular breaks and walked at lunch. Mild dull ache." },
  { id: "e3", date: "2026-10-14", rating: 3, notes: "Good sleep, pain remained mild around forehead." },
  { id: "e4", date: "2026-10-15", rating: 5, notes: "Missed afternoon water intake; stiffness in neck." },
  { id: "e5", date: "2026-10-16", rating: 2, notes: "Rest day, pain barely noticeable." },
];

export function SymptomJournal() {
  const [entries, setEntries] = useState<JournalEntry[]>(DEFAULT_SAMPLE_ENTRIES);
  const [viewMode, setViewMode] = useState<"chart" | "table">("chart");
  const [newDate, setNewDate] = useState("2026-10-17");
  const [newRating, setNewRating] = useState(4);
  const [newNotes, setNewNotes] = useState("");

  const handleAddEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNotes.trim()) return;

    const entry: JournalEntry = {
      id: `j_${Date.now()}`,
      date: newDate,
      rating: newRating,
      notes: newNotes.trim(),
    };

    setEntries((prev) => [entry, ...prev]);
    setNewNotes("");
  };

  const handleDelete = (id: string) => {
    setEntries((prev) => prev.filter((item) => item.id !== id));
  };

  const handleExportCSV = () => {
    let csv = "Date,User Rating (0-10),Patient Notes\n";
    entries.forEach((e) => {
      csv += `"${e.date}","${e.rating}","${e.notes.replace(/"/g, '""')}"\n`;
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `medisupport_symptom_journal.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Honest Status Badge */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <h2 className="text-xl font-bold text-[#172554]">
              Symptom Journal
            </h2>
            <StatusBadge status="On your device" />
          </div>
          <p className="text-xs sm:text-sm text-slate-600">
            Log your daily observations and ratings. Data remains on your device and is never automatically evaluated for trends.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Journal</span>
          </button>
        </div>
      </div>

      {/* Add New Entry Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-[#172554] uppercase tracking-wider flex items-center gap-2">
          <Plus className="w-4 h-4 text-blue-600" />
          <span>Add Daily Entry</span>
        </h3>

        <form onSubmit={handleAddEntry} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Date:
              </label>
              <input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm"
              />
            </div>

            <div className="sm:col-span-2">
              <div className="flex items-center justify-between text-xs mb-1">
                <label className="font-semibold text-slate-700">
                  Your Own Subjective Rating (0–10):
                </label>
                <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                  {newRating} / 10
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={10}
                value={newRating}
                onChange={(e) => setNewRating(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer mt-1"
                aria-label="Daily subjective rating from 0 to 10"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Observations / Notes:
            </label>
            <input
              type="text"
              value={newNotes}
              onChange={(e) => setNewNotes(e.target.value)}
              placeholder="What did you feel today? Note activities, sleep, or stress factors..."
              className="w-full p-3 rounded-xl border border-slate-300 text-sm"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-400 italic">
              Non-diagnostic: Ratings are strictly displayed back to you and are not analyzed.
            </span>
            <button
              type="submit"
              disabled={!newNotes.trim()}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-xl text-xs font-semibold"
            >
              Add Entry
            </button>
          </div>
        </form>
      </div>

      {/* Chart vs Table View Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex rounded-xl bg-slate-100 p-1 gap-1">
          <button
            type="button"
            onClick={() => setViewMode("chart")}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === "chart"
                ? "bg-white text-blue-700 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Visual Chart</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode("table")}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === "table"
                ? "bg-white text-blue-700 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            <span>Accessible Data Table</span>
          </button>
        </div>

        <span className="text-xs text-slate-500">
          Showing {entries.length} logged entries
        </span>
      </div>

      {/* Visual Chart View */}
      {viewMode === "chart" && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
              User-Reported Daily Ratings (0–10)
            </span>
            <span className="text-[11px] text-slate-400">
              Raw log display (No clinical trend interpretation)
            </span>
          </div>

          <div className="space-y-3 pt-2">
            {entries.map((entry) => {
              const percentage = (entry.rating / 10) * 100;
              return (
                <div key={entry.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">{entry.date}</span>
                    <span className="font-bold text-blue-600">{entry.rating} / 10</span>
                  </div>
                  <div className="w-full bg-slate-100 h-3.5 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-600 h-full rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 truncate">{entry.notes}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Accessible Data Table View */}
      {viewMode === "table" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700">
              <tr>
                <th className="py-3 px-4 font-bold">Date</th>
                <th className="py-3 px-4 font-bold">Self-Rating</th>
                <th className="py-3 px-4 font-bold">Notes</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              {entries.map((entry) => (
                <tr key={entry.id} className="hover:bg-slate-50/50">
                  <td className="py-3 px-4 font-medium text-slate-800">{entry.date}</td>
                  <td className="py-3 px-4 font-semibold text-blue-700">{entry.rating} / 10</td>
                  <td className="py-3 px-4 text-slate-700">{entry.notes}</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => handleDelete(entry.id)}
                      className="text-slate-400 hover:text-red-600 p-1"
                      aria-label={`Delete entry for ${entry.date}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
