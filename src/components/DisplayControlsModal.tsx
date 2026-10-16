"use client";

import React, { useEffect } from "react";
import { X, Eye, Volume2, Type, Contrast, RotateCcw } from "lucide-react";
import { useAccessibility, TextSize } from "@/context/AccessibilityContext";

interface DisplayControlsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DisplayControlsModal({ isOpen, onClose }: DisplayControlsModalProps) {
  const {
    textSize,
    highContrast,
    dyslexiaFont,
    optInPersistence,
    hasSpeechSupport,
    setTextSize,
    setHighContrast,
    setDyslexiaFont,
    setOptInPersistence,
    speakText,
    stopSpeaking,
    isSpeaking,
    resetAccessibility,
  } = useAccessibility();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Display and Accessibility Settings"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <div className="relative w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden z-10 flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-[#F8FAFC] border-b border-[#E2E8F0] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#E8F6F4] text-[#0D817C] flex items-center justify-center">
              <Eye className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#172554]">
                Display & Accessibility Suite
              </h3>
              <p className="text-xs text-[#64748B]">
                Adjust reading size, contrast, and assistive audio
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close display settings"
            className="p-1.5 rounded-lg text-[#64748B] hover:text-[#172554] hover:bg-[#E8F6F4] transition-colors focus-visible:ring-2 focus-visible:ring-[#0D817C]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 text-sm text-[#334155] max-h-[75vh] overflow-y-auto">
          {/* 1. Text Size */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#64748B] flex items-center gap-1.5 mb-2.5">
              <Type className="w-4 h-4 text-[#0D817C]" />
              <span>Reading Text Size</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  { id: "normal", label: "Normal (100%)", sample: "Aa" },
                  { id: "large", label: "Large (115%)", sample: "Aa" },
                  { id: "extra-large", label: "Extra (130%)", sample: "Aa" },
                ] as { id: TextSize; label: string; sample: string }[]
              ).map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setTextSize(opt.id)}
                  className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1 ${
                    textSize === opt.id
                      ? "border-[#0D817C] bg-[#E8F6F4] text-[#0D817C] font-bold shadow-xs ring-1 ring-[#0D817C]"
                      : "border-[#E2E8F0] hover:border-[#0D817C]/30 text-[#334155]"
                  }`}
                >
                  <span className={opt.id === "extra-large" ? "text-xl" : opt.id === "large" ? "text-lg" : "text-base"}>
                    {opt.sample}
                  </span>
                  <span className="text-[11px] leading-tight">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Visual Contrast & Font */}
          <div className="space-y-3 pt-4 border-t border-[#E2E8F0]">
            <span className="text-xs font-bold uppercase tracking-wider text-[#64748B] flex items-center gap-1.5">
              <Contrast className="w-4 h-4 text-[#0D817C]" />
              <span>Visual Adjustments</span>
            </span>

            {/* High Contrast Toggle */}
            <div className="flex items-center justify-between p-3.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC]">
              <div>
                <span className="font-semibold text-[#172554] block text-xs sm:text-sm">
                  High Contrast Mode
                </span>
                <span className="text-xs text-[#64748B]">
                  Increases border sharpness and text contrast
                </span>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={highContrast}
                onClick={() => setHighContrast(!highContrast)}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                  highContrast ? "bg-[#0D817C] justify-end" : "bg-slate-300 justify-start"
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-white shadow-xs" />
              </button>
            </div>

            {/* Dyslexia-Friendly Font Toggle */}
            <div className="flex items-center justify-between p-3.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC]">
              <div>
                <span className="font-semibold text-[#172554] block text-xs sm:text-sm">
                  Dyslexia-Friendly Typography
                </span>
                <span className="text-xs text-[#64748B]">
                  Wider letter spacing and heavier bottoms for ease of reading
                </span>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={dyslexiaFont}
                onClick={() => setDyslexiaFont(!dyslexiaFont)}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                  dyslexiaFont ? "bg-[#0D817C] justify-end" : "bg-slate-300 justify-start"
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-white shadow-xs" />
              </button>
            </div>
          </div>

          {/* 3. Audio & Read-Aloud Demonstration */}
          <div className="space-y-3 pt-4 border-t border-[#E2E8F0]">
            <span className="text-xs font-bold uppercase tracking-wider text-[#64748B] flex items-center gap-1.5">
              <Volume2 className="w-4 h-4 text-[#0D817C]" />
              <span>Text-to-Speech (Read Aloud)</span>
            </span>
            <div className="p-3.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between gap-3">
              <div className="text-xs text-[#334155]">
                {hasSpeechSupport ? (
                  <span>Browser speech synthesizer detected and ready.</span>
                ) : (
                  <span>Speech synthesis not supported in this environment.</span>
                )}
              </div>
              {hasSpeechSupport && (
                <button
                  type="button"
                  onClick={() => {
                    if (isSpeaking) stopSpeaking();
                    else speakText("MediSupport AI is an educational assistant designed to help you prepare questions for your doctor.");
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#0D817C] hover:bg-[#086B67] transition-colors shrink-0"
                >
                  {isSpeaking ? "Stop Speaking" : "Test Audio Sample"}
                </button>
              )}
            </div>
          </div>

          {/* 4. Privacy & Persistence Opt-in */}
          <div className="space-y-3 pt-4 border-t border-[#E2E8F0]">
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#E8F6F4] border border-[#0D817C]/20 text-xs">
              <input
                id="optin-storage"
                type="checkbox"
                checked={optInPersistence}
                onChange={(e) => setOptInPersistence(e.target.checked)}
                className="mt-0.5 w-4 h-4 text-[#0D817C] rounded border-[#E2E8F0] focus:ring-[#0D817C]"
              />
              <label htmlFor="optin-storage" className="text-[#334155] leading-normal cursor-pointer">
                <strong>Remember my display preferences on this device:</strong> By default, settings are session-only. Checking this saves preferences to your browser&apos;s local storage.
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#F8FAFC] border-t border-[#E2E8F0] flex items-center justify-between">
          <button
            type="button"
            onClick={resetAccessibility}
            className="inline-flex items-center gap-1.5 text-xs text-[#64748B] hover:text-[#172554] font-medium"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Defaults</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-sm font-semibold text-white bg-[#0D817C] hover:bg-[#086B67] transition-colors focus-visible:ring-2 focus-visible:ring-[#0D817C]"
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
}
