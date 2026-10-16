"use client";

import React, { useEffect } from "react";
import { X, Lock, Eye, Trash2, AlertTriangle } from "lucide-react";
import { clearAllLocalData, PrivacyInspectionResult } from "@/lib/privacyInspector";

interface PrivacyInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  pendingPayload: Record<string, unknown>;
  inspectionResult?: PrivacyInspectionResult;
  onApplyRedaction?: (redacted: string) => void;
  localOnlyMode: boolean;
  onToggleLocalOnly: (enabled: boolean) => void;
}

export function PrivacyInspectorModal({
  isOpen,
  onClose,
  pendingPayload,
  inspectionResult,
  onApplyRedaction,
  localOnlyMode,
  onToggleLocalOnly,
}: PrivacyInspectorModalProps) {
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

  const handleClearData = () => {
    if (confirm("Are you sure you want to clear all locally stored data and reset this session?")) {
      clearAllLocalData();
      alert("Local session data has been cleared.");
      onClose();
      window.location.reload();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Privacy Inspector"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <div className="relative w-full max-w-2xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden z-10 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center">
              <Eye className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#172554]">
                Client-Side Privacy Inspector
              </h3>
              <p className="text-xs text-slate-500">
                Inspect exact network payloads and control on-device confidentiality
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close Privacy Inspector"
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-6 overflow-y-auto text-sm text-slate-700">
          {/* Local-Only Mode Toggle */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-indigo-600" />
                <span className="font-bold text-slate-900 text-sm">
                  Local-Only Mode
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${localOnlyMode ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-600"}`}>
                  {localOnlyMode ? "ACTIVE (0 Network Calls)" : "INACTIVE (Online Allowed)"}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Disables all server API requests. Assistant operates using purely local on-device heuristics.
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={localOnlyMode}
              onClick={() => onToggleLocalOnly(!localOnlyMode)}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors shrink-0 ${
                localOnlyMode ? "bg-indigo-600 justify-end" : "bg-slate-300 justify-start"
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-white shadow-xs" />
            </button>
          </div>

          {/* Identifier Nudge & One-Click Redaction */}
          {inspectionResult && inspectionResult.hasIdentifiers && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-3">
              <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-amber-900">
                <AlertTriangle className="w-4 h-4 text-amber-700" />
                <span>Sensitive Personal Identifiers Detected!</span>
              </div>
              <p className="text-xs text-amber-900">
                Your draft message appears to contain personal contact details or ID numbers ({inspectionResult.identifiers.map((i) => i.type).join(", ")}).
              </p>
              {onApplyRedaction && (
                <button
                  type="button"
                  onClick={() => {
                    onApplyRedaction(inspectionResult.redactedText);
                    alert("Personal identifiers replaced with anonymous placeholders.");
                  }}
                  className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white font-semibold text-xs rounded-xl transition-colors"
                >
                  Apply 1-Click Client-Side Redaction
                </button>
              )}
            </div>
          )}

          {/* Exact Payload Viewer */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
              What will be sent over the wire:
            </span>
            <div className="bg-slate-900 text-slate-200 p-4 rounded-xl font-mono text-xs overflow-x-auto">
              <pre>{JSON.stringify(pendingPayload, null, 2)}</pre>
            </div>
            <p className="text-[11px] text-slate-400">
              Only the explicitly approved fields above are sent to the Next.js API route. No background telemetry or cookies.
            </p>
          </div>

          {/* Honest Disclosure & Wipe Data */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="text-xs text-slate-500">
              <strong>Honest Disclosure:</strong> Interactions are processed in real time and not sold. Persistent audit logging and HIPAA certification have not been completed.
            </div>
            <button
              type="button"
              onClick={handleClearData}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 transition-colors shrink-0"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All Local Data</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
