"use client";

import React, { useState } from "react";
import {
  Printer,
  Copy,
  Check,
  RotateCcw,
  Plus,
  Trash2,
  AlertTriangle,
  HelpCircle,
  FileText,
  Sliders,
  Calendar,
  Sparkles,
} from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import {
  VisitPrepData,
  DEFAULT_VISIT_PREP_DATA,
  SAMPLE_FICTIONAL_VISIT_DATA,
  generateFormattedVisitText,
} from "@/lib/visitSummary";
import { QUESTION_BANK } from "@/lib/questionBank";

interface VisitPrepKitProps {
  isCaregiverMode: boolean;
}

export function VisitPrepKit({ isCaregiverMode }: VisitPrepKitProps) {
  const [data, setData] = useState<VisitPrepData>({
    ...DEFAULT_VISIT_PREP_DATA,
    isCaregiverMode,
  });

  const [activeStep, setActiveStep] = useState(1);
  const [copied, setCopied] = useState(false);
  const [customQuestion, setCustomQuestion] = useState("");

  const qualityOptions = [
    "Dull ache",
    "Sharp pain",
    "Throbbing",
    "Stiffness",
    "Burning sensation",
    "Tingling / numbness",
    "Fatigue",
    "Pressure / tightness",
    "Fluctuating intensity",
  ];

  const handlePrint = () => {
    window.print();
  };

  const handleCopyText = () => {
    const text = generateFormattedVisitText({ ...data, isCaregiverMode });
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleLoadSample = () => {
    setData({
      ...SAMPLE_FICTIONAL_VISIT_DATA,
      isCaregiverMode,
    });
  };

  const handleReset = () => {
    setData({
      ...DEFAULT_VISIT_PREP_DATA,
      isCaregiverMode,
    });
    setActiveStep(1);
  };

  const toggleQuality = (quality: string) => {
    setData((prev) => {
      const exists = prev.qualities.includes(quality);
      return {
        ...prev,
        qualities: exists
          ? prev.qualities.filter((q) => q !== quality)
          : [...prev.qualities, quality],
      };
    });
  };

  const addCustomQuestion = () => {
    if (!customQuestion.trim()) return;
    setData((prev) => ({
      ...prev,
      questionsForClinician: [...prev.questionsForClinician, customQuestion.trim()],
    }));
    setCustomQuestion("");
  };

  const removeQuestion = (index: number) => {
    setData((prev) => ({
      ...prev,
      questionsForClinician: prev.questionsForClinician.filter((_, i) => i !== index),
    }));
  };

  const addQuestionFromBank = (q: string) => {
    if (data.questionsForClinician.includes(q)) return;
    setData((prev) => ({
      ...prev,
      questionsForClinician: [...prev.questionsForClinician, q],
    }));
  };

  return (
    <div className="space-y-8">
      {/* Top Banner with Honest Status Badge */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <h2 className="text-xl font-bold text-[#172554]">
              Visit Prep Kit
            </h2>
            <StatusBadge status="On your device" />
          </div>
          <p className="text-xs sm:text-sm text-slate-600">
            A guided wizard to build a clean, 1-page printable summary for your healthcare appointment.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleLoadSample}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Load Sample (Fictional Data)</span>
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 bg-white hover:bg-slate-100 border border-slate-200 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Main Layout: Wizard on Left, Live 1-Page Summary on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Step-by-Step Inputs */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          {/* Step Indicators */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Step {activeStep} of 5
            </span>
            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setActiveStep(s)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                    activeStep === s
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                  aria-label={`Go to step ${s}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* STEP 1: Main Concern */}
          {activeStep === 1 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
                <FileText className="w-5 h-5 text-blue-600" />
                <h3>What is your primary health concern?</h3>
              </div>
              <p className="text-xs text-slate-500">
                Describe in your own ordinary words what prompted this visit. No clinical jargon needed.
              </p>
              <textarea
                value={data.mainConcern}
                onChange={(e) => setData({ ...data, mainConcern: e.target.value })}
                placeholder="Example: I've been having tension headaches in the afternoon after working at my computer..."
                rows={4}
                className="w-full p-3.5 rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-sm outline-none"
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setActiveStep(2)}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700"
                >
                  Next: Timeline & Details &rarr;
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Timeline & Character */}
          {activeStep === 2 && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
                <Calendar className="w-5 h-5 text-blue-600" />
                <h3>Timeline & How It Has Changed</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    When did this symptom start?
                  </label>
                  <input
                    type="text"
                    value={data.onset}
                    onChange={(e) => setData({ ...data, onset: e.target.value })}
                    placeholder="e.g., 2 weeks ago, or since Tuesday"
                    className="w-full p-3 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Pattern / Progression
                  </label>
                  <select
                    value={data.progression}
                    onChange={(e) => setData({ ...data, progression: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-300 text-sm bg-white"
                  >
                    <option value="Constant">Constant throughout the day</option>
                    <option value="Comes and goes">Comes and goes in waves</option>
                    <option value="Gradually worsening">Gradually worsening over time</option>
                    <option value="Improving slowly">Improving slowly</option>
                    <option value="Unpredictable flares">Unpredictable flare-ups</option>
                  </select>
                </div>
              </div>

              {/* Subjective 0-10 Slider */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800">
                    Your Own Subjective Severity Rating:
                  </span>
                  <span className="font-bold text-sm text-blue-700 bg-blue-100 px-2.5 py-0.5 rounded-md">
                    {data.symptomRating} / 10
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={10}
                  step={1}
                  value={data.symptomRating}
                  onChange={(e) => setData({ ...data, symptomRating: Number(e.target.value) })}
                  className="w-full accent-blue-600 cursor-pointer"
                  aria-label="Your subjective symptom severity rating from 0 to 10"
                />
                <p className="text-[11px] text-slate-500 italic">
                  Note: This slider is purely your self-reported personal estimate. It is never used to compute clinical urgency or risk.
                </p>
              </div>

              {/* Chips for Qualities */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-2">
                  Characteristics / Qualities (select all that match):
                </label>
                <div className="flex flex-wrap gap-2">
                  {qualityOptions.map((q) => {
                    const isSelected = data.qualities.includes(q);
                    return (
                      <button
                        key={q}
                        type="button"
                        onClick={() => toggleQuality(q)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          isSelected
                            ? "bg-blue-600 text-white shadow-2xs"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        {q}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setActiveStep(1)}
                  className="text-xs text-slate-600 font-semibold"
                >
                  &larr; Back
                </button>
                <button
                  type="button"
                  onClick={() => setActiveStep(3)}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700"
                >
                  Next: Triggers & Self-Care &rarr;
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Triggers & Self-Care */}
          {activeStep === 3 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
                <Sliders className="w-5 h-5 text-teal-700" />
                <h3>Triggers & What You Have Tried</h3>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  What makes it better or worse? (Triggers / relieving factors)
                </label>
                <input
                  type="text"
                  value={data.triggers}
                  onChange={(e) => setData({ ...data, triggers: e.target.value })}
                  placeholder="e.g., Worse after computer screen work; resting in dark room helps"
                  className="w-full p-3 rounded-xl border border-slate-300 text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  What self-care or changes have you tried so far?
                </label>
                <textarea
                  value={data.triedSoFar}
                  onChange={(e) => setData({ ...data, triedSoFar: e.target.value })}
                  placeholder="e.g., Hydration, stretching, over-the-counter pain relievers..."
                  rows={3}
                  className="w-full p-3 rounded-xl border border-slate-300 text-sm"
                />
              </div>

              <div className="flex justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setActiveStep(2)}
                  className="text-xs text-slate-600 font-semibold"
                >
                  &larr; Back
                </button>
                <button
                  type="button"
                  onClick={() => setActiveStep(4)}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700"
                >
                  Next: Medications & Allergies &rarr;
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Medications & Allergies */}
          {activeStep === 4 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
                <AlertTriangle className="w-5 h-5 text-amber-700" />
                <h3>Medications & Allergies (User-Entered)</h3>
              </div>
              <p className="text-xs text-slate-500">
                Self-reported for your visit discussion. MediSupport AI does NOT perform drug interaction checks or give dosing advice.
              </p>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Current medications, supplements, or vitamins:
                </label>
                <input
                  type="text"
                  value={data.currentMedications}
                  onChange={(e) => setData({ ...data, currentMedications: e.target.value })}
                  placeholder="e.g., Daily vitamin D, occasional ibuprofen"
                  className="w-full p-3 rounded-xl border border-slate-300 text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Known medication or environmental allergies:
                </label>
                <input
                  type="text"
                  value={data.allergies}
                  onChange={(e) => setData({ ...data, allergies: e.target.value })}
                  placeholder="e.g., Penicillin (rash), or None known"
                  className="w-full p-3 rounded-xl border border-slate-300 text-sm"
                />
              </div>

              <div className="flex justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setActiveStep(3)}
                  className="text-xs text-slate-600 font-semibold"
                >
                  &larr; Back
                </button>
                <button
                  type="button"
                  onClick={() => setActiveStep(5)}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700"
                >
                  Next: Clinician Questions &rarr;
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: Questions & What to Bring */}
          {activeStep === 5 && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
                <HelpCircle className="w-5 h-5 text-blue-600" />
                <h3>Priority Questions for Your Doctor</h3>
              </div>

              {/* Custom question input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customQuestion}
                  onChange={(e) => setCustomQuestion(e.target.value)}
                  placeholder="Type a question you want to ask..."
                  className="flex-1 p-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addCustomQuestion();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={addCustomQuestion}
                  className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add</span>
                </button>
              </div>

              {/* Current Question List */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-700 block">
                  Questions included in your summary:
                </span>
                {data.questionsForClinician.map((q, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-xs text-slate-800"
                  >
                    <span>
                      <strong>Q{idx + 1}:</strong> {q}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeQuestion(idx)}
                      className="text-slate-400 hover:text-red-600 p-1"
                      aria-label="Remove question"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Pick from Question Bank */}
              <div className="pt-3 border-t border-slate-100">
                <span className="text-xs font-semibold text-slate-600 block mb-2">
                  Or pick one-click questions from the Question Bank:
                </span>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {QUESTION_BANK.slice(0, 3).map((cat) => (
                    <div key={cat.id} className="text-xs">
                      <span className="font-bold text-slate-700">{cat.title}:</span>
                      <ul className="mt-1 space-y-1">
                        {cat.questions.map((q, qIdx) => (
                          <li key={qIdx} className="flex items-center justify-between gap-2 text-slate-600">
                            <span className="truncate">&bull; {q}</span>
                            <button
                              type="button"
                              onClick={() => addQuestionFromBank(q)}
                              className="text-blue-600 hover:text-blue-800 font-semibold shrink-0"
                            >
                              + Add
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setActiveStep(4)}
                  className="text-xs text-slate-600 font-semibold"
                >
                  &larr; Back
                </button>
                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Final Summary</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Live Printable 1-Page Summary Card */}
        <div className="lg:col-span-5 w-full space-y-4">
          <div className="bg-white p-6 rounded-2xl border-2 border-slate-300 shadow-md printable-card">
            {/* Header */}
            <div className="border-b border-slate-200 pb-3 mb-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-[#172554]">
                  Patient Appointment Summary
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  MediSupport AI Prep Kit
                </span>
              </div>
              <p className="text-[11px] text-slate-500 italic">
                Self-reported for consultation prep. Non-diagnostic.
              </p>
            </div>

            {/* Primary Concern */}
            <div className="mb-3 text-xs">
              <span className="font-bold text-slate-900 block mb-0.5">Primary Concern:</span>
              <p className="text-slate-700 bg-slate-50 p-2 rounded-lg border border-slate-100">
                {data.mainConcern || "(No primary concern entered yet)"}
              </p>
            </div>

            {/* Timeline & Severity */}
            <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
              <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                <span className="font-semibold text-slate-700 block text-[10px]">Onset / Pattern</span>
                <span className="text-slate-800">{data.onset} &bull; {data.progression}</span>
              </div>
              <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                <span className="font-semibold text-slate-700 block text-[10px]">User Rating</span>
                <span className="text-blue-700 font-bold">{data.symptomRating} / 10</span>
              </div>
            </div>

            {/* Characteristics */}
            {data.qualities.length > 0 && (
              <div className="mb-3 text-xs">
                <span className="font-bold text-slate-900 block mb-0.5">Reported Sensations:</span>
                <p className="text-slate-600">{data.qualities.join(", ")}</p>
              </div>
            )}

            {/* Questions to Ask */}
            <div className="mb-4 text-xs">
              <span className="font-bold text-slate-900 block mb-1">Priority Questions:</span>
              <ul className="space-y-1 text-slate-700">
                {data.questionsForClinician.slice(0, 4).map((q, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-blue-600 font-bold">[ ]</span>
                    <span>{q}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* What to Bring Checklist */}
            <div className="mb-4 text-xs border-t border-slate-100 pt-2">
              <span className="font-bold text-slate-900 block mb-1">What to Bring:</span>
              <ul className="space-y-0.5 text-slate-600 text-[11px]">
                {data.whatToBring.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-1.5">
                    <span className="text-teal-700">&#10003;</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Safety Reminder */}
            <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-[10px] text-amber-900 leading-tight">
              <strong>Reminder:</strong> Remove personal details before sharing. Call local emergency services immediately for sudden, severe warning signs.
            </div>
          </div>

          {/* Action Controls for Summary */}
          <div className="flex items-center justify-between gap-3 no-print">
            <button
              type="button"
              onClick={handlePrint}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs text-white bg-blue-600 hover:bg-blue-700 shadow-xs transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              type="button"
              onClick={handleCopyText}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl font-semibold text-xs text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-teal-700" />
                  <span className="text-teal-700">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Text</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
