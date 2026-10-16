"use client";

import React, { useState } from "react";
import { ClipboardList, Loader2, Sparkles, CheckCircle2, HelpCircle, Calendar } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";

interface StructuredNotesData {
  discussed: string;
  instructions: string[];
  followUp: string;
  unclearQuestions: string[];
}

export function AfterVisitNotes() {
  const [inputText, setInputText] = useState(
    "Dr. Martinez said my blood pressure was slightly elevated today (134/86). She wants me to log it at home for 2 weeks in the morning and evening. She suggested reducing salty takeout foods, drinking more water, and walking 20 minutes a day. Follow up with her office in one month to review the blood pressure log."
  );

  const [isLoading, setIsLoading] = useState(false);
  const [structuredNotes, setStructuredNotes] = useState<StructuredNotesData>({
    discussed: "Blood pressure was slightly elevated (134/86) during today's visit.",
    instructions: [
      "Keep a daily blood pressure log for 2 weeks (measure morning and evening)",
      "Reduce salty takeout foods and increase daily water intake",
      "Walk 20 minutes each day as tolerated",
    ],
    followUp: "Schedule a follow-up appointment with Dr. Martinez's clinic in 1 month to review your 2-week log.",
    unclearQuestions: [
      "Should I take my blood pressure reading before or after morning breakfast/coffee?",
      "What specific numbers should prompt an immediate call to your triage nurse rather than waiting for the 1-month check?",
    ],
  });

  const handleOrganize = async () => {
    if (!inputText.trim() || isLoading) return;
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: inputText, mode: "afterVisit" }),
      });

      if (!response.ok) throw new Error("Processing failed");
      const data = await response.json();

      setStructuredNotes({
        discussed: `Patient-reported summary: "${inputText.substring(0, 120)}..."`,
        instructions: data.organizedItems || ["Instructions restated verbatim from user notes."],
        followUp: "Follow up as outlined in your clinical notes or as instructed by your clinic.",
        unclearQuestions: data.suggestedDoctorQuestions || [
          "What specific threshold requires a prompt phone call to the clinic?",
        ],
      });
    } catch {
      // Local fallback
      setStructuredNotes({
        discussed: inputText,
        instructions: ["Daily monitoring and lifestyle adjustments as entered."],
        followUp: "Follow up with your healthcare provider as scheduled.",
        unclearQuestions: ["What questions remain ambiguous after reading your notes?"],
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadSample = () => {
    setInputText(
      "Saw the orthopedist for my sprained ankle. She said X-rays showed no fractures. Recommended RICE protocol (rest, ice 15 min at a time, light compression wrap, elevation) for 48 hours. Start gentle ankle circles on day 3. Call if swelling does not decrease in 5 days."
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Honest Status Badge */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <h2 className="text-xl font-bold text-[#172554]">
              After-Visit Notes Organizer
            </h2>
            <StatusBadge status="Live" />
          </div>
          <p className="text-xs sm:text-sm text-slate-600">
            Paste what your doctor told you to structure instructions, follow-up timelines, and clarification questions.
          </p>
        </div>

        <button
          type="button"
          onClick={handleLoadSample}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 shrink-0 transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Load Sample Notes</span>
        </button>
      </div>

      {/* Input Box */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
          Paste or type what your clinician told you:
        </label>
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          rows={4}
          placeholder="Paste doctor notes, instructions, or things you remember from your consultation..."
          className="w-full p-3.5 rounded-xl border border-slate-300 focus:border-blue-600 text-sm outline-none"
        />
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            Strict rule: MediSupport AI restates user-reported notes and never invents clinical dosages.
          </span>
          <button
            type="button"
            disabled={isLoading || !inputText.trim()}
            onClick={handleOrganize}
            className="px-6 py-2.5 rounded-xl font-semibold text-sm text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-40 flex items-center gap-2 transition-colors"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ClipboardList className="w-4 h-4" />}
            <span>Organize Notes</span>
          </button>
        </div>
      </div>

      {/* Structured Output Cards */}
      {structuredNotes && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-200">
          {/* Card 1: What was discussed */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>What Was Discussed:</span>
            </span>
            <p className="text-sm text-slate-700 leading-relaxed">
              {structuredNotes.discussed}
            </p>
          </div>

          {/* Card 2: Reported Instructions */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>Self-Reported Instructions:</span>
            </span>
            <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700">
              {structuredNotes.instructions.map((inst: string, i: number) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-600 mt-2 shrink-0" />
                  <span>{inst}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Card 3: Follow-Up Items */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#172554] flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span>Follow-up Timeline:</span>
            </span>
            <p className="text-sm text-slate-700 leading-relaxed">
              {structuredNotes.followUp}
            </p>
          </div>

          {/* Card 4: Still Unclear Questions */}
          <div className="bg-white p-6 rounded-2xl border border-blue-200 shadow-xs space-y-2 bg-blue-50/30">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-900 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-blue-600" />
              <span>&ldquo;Still Unclear&rdquo; Questions for Next Time:</span>
            </span>
            <ul className="space-y-1.5 text-xs sm:text-sm text-blue-950">
              {structuredNotes.unclearQuestions.map((q: string, i: number) => (
                <li key={i} className="flex items-start gap-2 font-medium">
                  <span className="text-blue-600 font-bold">&bull;</span>
                  <span>{q}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
