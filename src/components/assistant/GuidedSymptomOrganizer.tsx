"use client";

import React, { useState } from "react";
import { ChevronRight, ChevronLeft, Check, Clipboard, AlertCircle, RotateCcw, Printer } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import {
  SymptomOrganizerData,
  DEFAULT_ORGANIZER_DATA,
  QUALITY_OPTIONS,
  CONTEXT_PROMPTS,
  generateSymptomSummaryText,
} from "@/lib/symptomOrganizer";
import { checkSafetySignal } from "@/lib/safetySignals";

const STEPS = ["Main Concern", "Timeline & Severity", "Qualities & Location", "Context", "Questions", "Review"];

export function GuidedSymptomOrganizer() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<SymptomOrganizerData>(DEFAULT_ORGANIZER_DATA);
  const [safetyAlert, setSafetyAlert] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");

  const update = (partial: Partial<SymptomOrganizerData>) =>
    setData(prev => ({ ...prev, ...partial }));

  const handleConcernChange = (value: string) => {
    update({ mainConcern: value });
    const signal = checkSafetySignal(value);
    setSafetyAlert(signal.hasEmergencySignal ? signal.escalationNotice : null);
  };

  const toggleQuality = (q: string) => {
    const qs = data.qualities.includes(q)
      ? data.qualities.filter(x => x !== q)
      : [...data.qualities, q];
    update({ qualities: qs });
  };

  const addQuestion = () => {
    if (newQuestion.trim()) {
      update({ questionsForDoctor: [...data.questionsForDoctor, newQuestion.trim()] });
      setNewQuestion("");
    }
  };

  const removeQuestion = (i: number) =>
    update({ questionsForDoctor: data.questionsForDoctor.filter((_, idx) => idx !== i) });

  const summaryText = generateSymptomSummaryText(data);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const canAdvance = (): boolean => {
    if (step === 0) return data.mainConcern.trim().length > 0;
    return true;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl font-bold text-[#172554]">Guided Symptom Organizer</h2>
            <StatusBadge status="On your device" />
          </div>
          <p className="text-sm text-[#64748B]">Step-by-step symptom organization to help you prepare for a healthcare visit. Does not diagnose conditions.</p>
        </div>
        <button onClick={() => { setData(DEFAULT_ORGANIZER_DATA); setStep(0); setSafetyAlert(null); }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#64748B] border border-[#E2E8F0] hover:bg-[#E8F6F4]">
          <RotateCcw className="w-3.5 h-3.5" /> Start Over
        </button>
      </div>

      {/* Emergency alert */}
      {safetyAlert && (
        <div className="bg-red-50 border-2 border-red-300 rounded-2xl p-4 flex gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-red-800 mb-1">⚠ Emergency Warning</div>
            <p className="text-sm text-red-800">{safetyAlert}</p>
            <p className="text-sm font-bold text-red-900 mt-2">Please call emergency services immediately. Do not continue filling this form if you need urgent care.</p>
          </div>
        </div>
      )}

      {/* Progress steps */}
      <div className="flex items-center gap-1 overflow-x-auto">
        {STEPS.map((s, i) => (
          <React.Fragment key={s}>
            <button
              onClick={() => i < step || (i === step) ? setStep(i) : undefined}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${i === step ? "bg-[#0D817C] text-white" : i < step ? "bg-[#E8F6F4] text-[#0D817C]" : "bg-[#F8FAFC] text-[#64748B]"}`}
            >
              {i < step && <Check className="w-3 h-3" />}
              {s}
            </button>
            {i < STEPS.length - 1 && <ChevronRight className="w-3 h-3 text-[#E2E8F0] shrink-0" />}
          </React.Fragment>
        ))}
      </div>

      {/* Step content */}
      <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] space-y-5">

        {/* Step 0 — Main Concern */}
        {step === 0 && (
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-[#172554] mb-1">What is your main health concern?</h3>
              <p className="text-sm text-[#64748B] mb-3">Describe it in your own words. You can add more detail in the next steps.</p>
              <textarea
                value={data.mainConcern}
                onChange={e => handleConcernChange(e.target.value)}
                placeholder="e.g. I have had a persistent headache for the past three days, mostly on the left side..."
                rows={4}
                className="w-full p-3 rounded-xl border border-[#E2E8F0] focus:border-[#0D817C] text-sm outline-none resize-none"
              />
            </div>
            <div className="bg-[#E8F6F4] rounded-xl p-4 text-sm text-[#334155]">
              <strong>Not for emergencies:</strong> If you are experiencing sudden, severe, or life-threatening symptoms, call emergency services immediately instead of using this tool.
            </div>
          </div>
        )}

        {/* Step 1 — Timeline & Severity */}
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="font-bold text-[#172554] mb-1">Timeline & Severity</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#334155] mb-1">When did it start?</label>
                <input type="date" value={data.onsetDate} onChange={e => update({ onsetDate: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-[#E2E8F0] text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#334155] mb-1">Pattern / Duration</label>
                <input value={data.durationDescription} onChange={e => update({ durationDescription: e.target.value })}
                  placeholder="e.g. Comes and goes, constant for 3 days"
                  className="w-full p-2.5 rounded-xl border border-[#E2E8F0] focus:border-[#0D817C] text-sm outline-none" />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <label className="font-semibold text-[#334155]">Your subjective severity rating (0 = none, 10 = worst imaginable)</label>
                <span className="font-bold text-[#0D817C] bg-[#E8F6F4] px-2.5 py-0.5 rounded-lg">{data.severityRating} / 10</span>
              </div>
              <input type="range" min={0} max={10} value={data.severityRating}
                onChange={e => update({ severityRating: Number(e.target.value) })}
                className="w-full accent-[#0D817C]" />
              <p className="text-xs text-[#64748B] mt-1">This is your own estimate. It is not a clinical measurement.</p>
            </div>
          </div>
        )}

        {/* Step 2 — Qualities & Location */}
        {step === 2 && (
          <div className="space-y-4">
            <h3 className="font-bold text-[#172554] mb-1">Qualities & Location</h3>
            <div>
              <label className="block text-xs font-semibold text-[#334155] mb-2">Where on your body? (describe in your words)</label>
              <input value={data.location} onChange={e => update({ location: e.target.value })}
                placeholder="e.g. Left side of head, behind the eye; lower back"
                className="w-full p-2.5 rounded-xl border border-[#E2E8F0] focus:border-[#0D817C] text-sm outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#334155] mb-2">How does it feel? (select all that apply)</label>
              <div className="flex flex-wrap gap-2">
                {QUALITY_OPTIONS.map(q => (
                  <button key={q} type="button" onClick={() => toggleQuality(q)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${data.qualities.includes(q) ? "bg-[#0D817C] text-white border-[#0D817C]" : "bg-white text-[#334155] border-[#E2E8F0] hover:border-[#0D817C]"}`}>
                    {data.qualities.includes(q) && <Check className="w-3 h-3 inline mr-1" />}{q}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#334155] mb-1">Any associated symptoms?</label>
              <textarea value={data.associatedSymptoms} onChange={e => update({ associatedSymptoms: e.target.value })}
                placeholder="e.g. Nausea, light sensitivity, fatigue"
                rows={2} className="w-full p-2.5 rounded-xl border border-[#E2E8F0] focus:border-[#0D817C] text-sm outline-none resize-none" />
            </div>
          </div>
        )}

        {/* Step 3 — Context */}
        {step === 3 && (
          <div className="space-y-4">
            <h3 className="font-bold text-[#172554] mb-1">Context & Factors</h3>
            <div>
              <label className="block text-xs font-semibold text-[#334155] mb-1">What makes it worse? (triggers)</label>
              <input value={data.triggers} onChange={e => update({ triggers: e.target.value })}
                placeholder="e.g. Screen time, bright light, stress, certain foods"
                className="w-full p-2.5 rounded-xl border border-[#E2E8F0] focus:border-[#0D817C] text-sm outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#334155] mb-1">What helps or relieves it?</label>
              <input value={data.relievingFactors} onChange={e => update({ relievingFactors: e.target.value })}
                placeholder="e.g. Rest, cold compress, pain reliever, sleep"
                className="w-full p-2.5 rounded-xl border border-[#E2E8F0] focus:border-[#0D817C] text-sm outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#334155] mb-2">Relevant context — check any that apply and add notes</label>
              <div className="bg-[#F8FAFC] rounded-xl p-3 space-y-2">
                {CONTEXT_PROMPTS.map(p => (
                  <div key={p} className="text-sm text-[#334155]">● {p}</div>
                ))}
              </div>
              <textarea value={data.relevantContext} onChange={e => update({ relevantContext: e.target.value })}
                placeholder="Add any relevant context here..."
                rows={3} className="w-full mt-2 p-2.5 rounded-xl border border-[#E2E8F0] focus:border-[#0D817C] text-sm outline-none resize-none" />
            </div>
          </div>
        )}

        {/* Step 4 — Questions */}
        {step === 4 && (
          <div className="space-y-4">
            <h3 className="font-bold text-[#172554] mb-1">Questions for my healthcare professional</h3>
            <p className="text-sm text-[#64748B]">Review and edit the suggested questions, or add your own.</p>
            {data.questionsForDoctor.map((q, i) => (
              <div key={i} className="flex gap-2">
                <input value={q} onChange={e => {
                  const qs = [...data.questionsForDoctor];
                  qs[i] = e.target.value;
                  update({ questionsForDoctor: qs });
                }}
                  className="flex-1 p-2.5 rounded-xl border border-[#E2E8F0] focus:border-[#0D817C] text-sm outline-none" />
                <button type="button" onClick={() => removeQuestion(i)} className="p-2 text-[#64748B] hover:text-red-600">
                  ✕
                </button>
              </div>
            ))}
            <div className="flex gap-2">
              <input value={newQuestion} onChange={e => setNewQuestion(e.target.value)}
                onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addQuestion())}
                placeholder="Add a question and press Enter or click Add"
                className="flex-1 p-2.5 rounded-xl border border-[#E2E8F0] focus:border-[#0D817C] text-sm outline-none" />
              <button type="button" onClick={addQuestion}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-[#0D817C] hover:bg-[#086B67]">
                Add
              </button>
            </div>
          </div>
        )}

        {/* Step 5 — Review */}
        {step === 5 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-[#172554]">Your Symptom Summary</h3>
              <div className="flex gap-2">
                <button onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#334155] border border-[#E2E8F0] hover:bg-[#E8F6F4]">
                  <Clipboard className="w-3.5 h-3.5" /> {copied ? "Copied!" : "Copy"}
                </button>
                <button onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#334155] border border-[#E2E8F0] hover:bg-[#E8F6F4]">
                  <Printer className="w-3.5 h-3.5" /> Print
                </button>
              </div>
            </div>
            <pre className="bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] p-4 text-xs font-mono text-[#334155] whitespace-pre-wrap overflow-x-auto">
              {summaryText}
            </pre>
            <div className="bg-[#E8F6F4] rounded-xl p-4 text-sm text-[#334155]">
              <strong>Next step:</strong> Share this summary with your healthcare provider. It does not constitute a diagnosis and should be reviewed by a qualified clinician.
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setStep(s => Math.max(0, s - 1))}
          disabled={step === 0}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-[#334155] border border-[#E2E8F0] hover:bg-[#E8F6F4] disabled:opacity-40 disabled:cursor-not-allowed">
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
        <span className="text-xs text-[#64748B]">Step {step + 1} of {STEPS.length}</span>
        {step < STEPS.length - 1 ? (
          <button
            onClick={() => setStep(s => Math.min(STEPS.length - 1, s + 1))}
            disabled={!canAdvance()}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold text-white bg-[#0D817C] hover:bg-[#086B67] disabled:opacity-40 disabled:cursor-not-allowed">
            Next <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button onClick={() => { setData(DEFAULT_ORGANIZER_DATA); setStep(0); setSafetyAlert(null); }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold text-[#0D817C] border border-[#0D817C] hover:bg-[#E8F6F4]">
            <RotateCcw className="w-4 h-4" /> Start New
          </button>
        )}
      </div>
    </div>
  );
}
