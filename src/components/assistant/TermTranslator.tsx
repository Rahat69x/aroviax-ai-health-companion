"use client";

import React, { useState } from "react";
import { Search, BookOpen, AlertCircle, Sparkles, Loader2, Volume2 } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { SAMPLE_TERMS, TranslatedTerm } from "@/lib/termTranslator";
import { useAccessibility } from "@/context/AccessibilityContext";

export function TermTranslator() {
  const [searchTerm, setSearchTerm] = useState("Hypertension");
  const [readingLevel, setReadingLevel] = useState<"simple" | "standard" | "detailed">("simple");
  const [result, setResult] = useState<TranslatedTerm | null>(SAMPLE_TERMS["hypertension"]);
  const [isLoading, setIsLoading] = useState(false);
  const { speakText, isSpeaking, stopSpeaking } = useAccessibility();

  const handleTranslate = async (termToLookup?: string) => {
    const term = (termToLookup ?? searchTerm).trim();
    if (!term || isLoading) return;

    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: term, mode: "translate" }),
      });

      if (!response.ok) throw new Error("Translation failed");
      const data = await response.json();

      setResult({
        term: term,
        category: "Clinical Concept",
        simple: data.generalInformation || data.reply,
        standard: data.reply,
        detailed: data.generalInformation || data.reply,
        whatItDoesNotTellYou: data.whatImUnsureAbout || "A single term or lab value does not reflect your overall health prognosis without a doctor's examination.",
      });
    } catch {
      // Local fallback from dictionary
      const lower = term.toLowerCase();
      const fallback = SAMPLE_TERMS[lower] || {
        term: term,
        category: "General Terminology",
        simple: `In plain language, "${term}" represents an anatomical structure, measurement, or symptom descriptor.`,
        standard: `Clinical reference for "${term}". Medical findings require clinical context to determine whether they indicate pathology.`,
        detailed: `Anatomical and physiological classification for "${term}".`,
        whatItDoesNotTellYou: "This definition does NOT determine whether this finding is normal for you, nor does it specify whether treatment is needed.",
      };
      setResult(fallback);
    } finally {
      setIsLoading(false);
    }
  };

  const sampleButtons = ["Hypertension", "Benign", "Edema", "Acute vs Chronic", "Biopsy"];

  return (
    <div className="space-y-6">
      {/* Top Banner with Honest Status Badge */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <h2 className="text-xl font-bold text-[#172554]">
              Plain-Language Term Translator
            </h2>
            <StatusBadge status="Live" />
          </div>
          <p className="text-xs sm:text-sm text-slate-600">
            Paste a medical term or lab test name to unpack confusing jargon across three reading levels.
          </p>
        </div>
      </div>

      {/* Input Search Box */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleTranslate();
          }}
          className="flex flex-col sm:flex-row gap-2"
        >
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Enter a medical term or lab test (e.g., Edema, Benign, Neuropathy)..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:border-blue-600 text-sm outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !searchTerm.trim()}
            className="px-6 py-3 rounded-xl font-semibold text-sm text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-40 flex items-center justify-center gap-2 transition-colors"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <BookOpen className="w-4 h-4" />}
            <span>Translate</span>
          </button>
        </form>

        {/* Quick Sample Terms */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            Quick samples:
          </span>
          {sampleButtons.map((term) => (
            <button
              key={term}
              type="button"
              onClick={() => {
                setSearchTerm(term);
                handleTranslate(term);
              }}
              className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 transition-colors"
            >
              {term}
            </button>
          ))}
        </div>
      </div>

      {/* Results View */}
      {result && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider block">
                {result.category || "Health Term"}
              </span>
              <h3 className="text-2xl font-extrabold text-[#172554]">{result.term}</h3>
            </div>

            {/* Reading Level Selector Tabs */}
            <div className="flex rounded-xl bg-slate-100 p-1 gap-1">
              {(["simple", "standard", "detailed"] as const).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setReadingLevel(lvl)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                    readingLevel === lvl
                      ? "bg-white text-blue-700 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Active Explanation Content */}
          <div className="bg-slate-50/70 p-5 rounded-2xl border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                {readingLevel.toUpperCase()} EXPLANATION:
              </span>
              <button
                type="button"
                onClick={() => {
                  if (isSpeaking) stopSpeaking();
                  else speakText(result[readingLevel]);
                }}
                className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-semibold"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>{isSpeaking ? "Stop" : "Read Aloud"}</span>
              </button>
            </div>
            <p className="text-base text-slate-800 leading-relaxed font-normal">
              {result[readingLevel]}
            </p>
          </div>

          {/* Mandatory "What this does NOT tell you" Section */}
          <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200/90 text-amber-950 space-y-2">
            <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-amber-900">
              <AlertCircle className="w-4 h-4 text-amber-700" />
              <span>What this does NOT tell you (Clinical Limits):</span>
            </div>
            <p className="text-sm text-amber-900 leading-relaxed">
              {result.whatItDoesNotTellYou}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
