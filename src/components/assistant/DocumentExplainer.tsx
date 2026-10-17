"use client";

import React, { useState, useRef } from "react";
import {
  Upload,
  AlertCircle,
  X,
  CheckCircle,
  Info,
  Loader2,
  Lock,
  Trash2,
  Volume2,
  Tag,
} from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { inspectPrivacy, redactIdentifiers, PrivacyInspectionResult } from "@/lib/privacyInspector";
import { useAccessibility } from "@/context/AccessibilityContext";

type UploadState = "idle" | "loading" | "done" | "error";

const ALLOWED_TYPES = ["text/plain", "text/csv", "application/json", "text/markdown"];
const ALLOWED_EXT = [".txt", ".csv", ".json", ".md"];
const MAX_SIZE_BYTES = 50 * 1024; // 50 KB

function extractTextFromFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve((e.target?.result as string) || "");
    reader.onerror = () => reject(new Error("File could not be read."));
    reader.readAsText(file, "utf-8");
  });
}

function sanitizeForDisplay(text: string): string {
  return text.replace(/\0/g, "").slice(0, 4000);
}

export function DocumentExplainer() {
  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const [fileName, setFileName] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const [privacyReport, setPrivacyReport] = useState<PrivacyInspectionResult | null>(null);
  const [detectedConcepts, setDetectedConcepts] = useState<string[]>([]);
  const [questions, setQuestions] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { speakText, isSpeaking, stopSpeaking } = useAccessibility();

  const reset = () => {
    if (isSpeaking) stopSpeaking();
    setUploadState("idle");
    setFileName(null);
    setErrorMessage(null);
    setExtractedText(null);
    setPrivacyReport(null);
    setDetectedConcepts([]);
    setQuestions([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFile = async (file: File) => {
    setErrorMessage(null);

    // Validation
    const ext = file.name.toLowerCase().slice(file.name.lastIndexOf("."));
    if (!ALLOWED_TYPES.includes(file.type) && !ALLOWED_EXT.includes(ext)) {
      setErrorMessage(
        `Unsupported file type "${file.type || ext}". Only text documents (.txt, .csv, .json, .md) are supported in this demonstration.`
      );
      return;
    }
    if (file.size > MAX_SIZE_BYTES) {
      setErrorMessage(
        `File is too large (${(file.size / 1024).toFixed(0)} KB). Maximum allowed size is 50 KB for client-side processing.`
      );
      return;
    }
    if (file.size === 0) {
      setErrorMessage("The selected file appears to be empty.");
      return;
    }

    setFileName(file.name);
    setUploadState("loading");

    try {
      const rawText = await extractTextFromFile(file);

      // Device-side Privacy Inspection & PII Redaction
      const pReport = inspectPrivacy(rawText);
      setPrivacyReport(pReport);

      const redactedText = redactIdentifiers(rawText);
      const clean = sanitizeForDisplay(redactedText);
      setExtractedText(clean);

      // Extract Concepts
      const lower = clean.toLowerCase();
      const concepts: string[] = [];
      const qs: string[] = [
        "What does this document mean for my overall health plan?",
        "Are there any values or findings here that require clinical follow-up?",
      ];

      if (lower.includes("glucose") || lower.includes("hba1c") || lower.includes("insulin")) {
        concepts.push("Blood Sugar / Diabetes Markers");
        qs.push("What do these blood sugar readings mean for my dietary or treatment plan?");
      }
      if (lower.includes("blood pressure") || lower.includes("hypertension") || lower.includes("mmhg")) {
        concepts.push("Cardiovascular / Blood Pressure");
        qs.push("Are my blood pressure readings within the normal range for my age?");
      }
      if (lower.includes("cholesterol") || lower.includes("ldl") || lower.includes("hdl") || lower.includes("triglycerides")) {
        concepts.push("Lipid Profile");
        qs.push("What do the cholesterol numbers mean, and do I need lifestyle changes?");
      }
      if (lower.includes("creatinine") || lower.includes("kidney") || lower.includes("egfr") || lower.includes("bun")) {
        concepts.push("Renal / Kidney Function");
        qs.push("What do these kidney function results indicate, and is follow-up needed?");
      }
      if (lower.includes("hemoglobin") || lower.includes("rbc") || lower.includes("anemia") || lower.includes("wbc")) {
        concepts.push("Complete Blood Count (CBC)");
        qs.push("Could these blood count results explain fatigue or other symptoms?");
      }
      if (lower.includes("thyroid") || lower.includes("tsh") || lower.includes("t3") || lower.includes("t4")) {
        concepts.push("Thyroid Function");
        qs.push("What do my thyroid test numbers suggest regarding my metabolism?");
      }

      setDetectedConcepts(concepts);
      setQuestions([...new Set(qs)].slice(0, 5));
      setUploadState("done");
    } catch {
      setErrorMessage("Could not read the file. Please ensure it is a valid plain-text document.");
      setUploadState("error");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0]">
        <div className="flex items-center gap-2 mb-1">
          <h2 className="text-xl font-bold text-[#172554]">Health Document Explainer</h2>
          <StatusBadge status="Demo" />
        </div>
        <p className="text-sm text-[#64748B]">
          Upload plain-text lab reports or clinic summaries (.txt, .csv, .json, .md) for plain-language clarification. Files are processed entirely on your device with automatic PII redaction.
        </p>
      </div>

      {/* Privacy & Security notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-2">
        <div className="flex gap-2 items-start">
          <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="text-sm text-amber-900 space-y-1">
            <p>
              <strong>Device-Side Processing:</strong> Files are read and sanitized directly in your browser. No document content is transmitted to external servers.
            </p>
            <p>
              <strong>Non-Diagnostic Notice:</strong> This tool extracts and structures the information present in your document. It does not fabricate clinical interpretations or diagnosis. Always discuss lab values with your healthcare provider.
            </p>
          </div>
        </div>
      </div>

      {/* Upload area */}
      {uploadState === "idle" && (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="border-2 border-dashed border-[#0D817C]/40 hover:border-[#0D817C] rounded-2xl p-10 text-center transition-colors bg-white cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
        >
          <Upload className="w-10 h-10 text-[#0D817C] mx-auto mb-3" />
          <p className="font-semibold text-[#172554] mb-1">
            Drag and drop a document here, or click to browse
          </p>
          <p className="text-sm text-[#64748B]">
            Accepted: .txt, .csv, .json, .md — Maximum 50 KB
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.csv,.json,.md,text/plain,text/csv,application/json,text/markdown"
            onChange={handleInputChange}
            className="hidden"
            aria-label="Upload health document"
          />
        </div>
      )}

      {/* Loading */}
      {uploadState === "loading" && (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-10 text-center">
          <Loader2 className="w-8 h-8 text-[#0D817C] mx-auto mb-3 animate-spin" />
          <p className="font-semibold text-[#172554]">Reading and sanitizing document…</p>
          <p className="text-sm text-[#64748B]">Processing 100% on your device.</p>
        </div>
      )}

      {/* Error */}
      {(uploadState === "error" || errorMessage) && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-red-800 mb-1">File could not be processed</p>
              <p className="text-sm text-red-700">{errorMessage}</p>
            </div>
          </div>
          <button
            onClick={reset}
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-[#0D817C] hover:bg-[#086B67]"
          >
            <X className="w-4 h-4" /> Try Again
          </button>
        </div>
      )}

      {/* Results */}
      {uploadState === "done" && extractedText !== null && (
        <div className="space-y-4">
          {/* Privacy Redaction Banner */}
          {privacyReport?.hasIdentifiers && (
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-center justify-between gap-3 text-xs text-blue-950">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-blue-700 shrink-0" />
                <span>
                  <strong>Privacy Guard:</strong> Automatically masked {privacyReport.identifiers.length} sensitive identifier(s) ({Array.from(new Set(privacyReport.identifiers.map((i) => i.type))).join(", ")}) before display.
                </span>
              </div>
            </div>
          )}

          {/* Document Content Box */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-[#0D817C]" />
                <span className="font-semibold text-[#172554]">{fileName}</span>
                <span className="text-xs text-[#64748B]">— processed on device</span>
              </div>
              <button
                onClick={reset}
                className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-200"
                title="Immediately wipe document and clear memory"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Purge from Memory</span>
              </button>
            </div>

            {/* Detected Concepts */}
            {detectedConcepts.length > 0 && (
              <div className="mb-3 flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-semibold text-[#64748B] flex items-center gap-1 mr-1">
                  <Tag className="w-3 h-3 text-[#0D817C]" /> Identified Panels:
                </span>
                {detectedConcepts.map((c, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#E8F6F4] text-[#0D817C] border border-[#0D817C]/20"
                  >
                    {c}
                  </span>
                ))}
              </div>
            )}

            <div className="bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] p-4 max-h-60 overflow-y-auto">
              <pre className="text-xs font-mono text-[#334155] whitespace-pre-wrap">
                {extractedText}
              </pre>
            </div>
            {extractedText.length >= 3990 && (
              <p className="text-xs text-[#64748B] mt-2">
                Display truncated at 4000 characters for readability.
              </p>
            )}
          </div>

          {/* Plain-Language Context & Ambiguity Warning */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Info className="w-5 h-5 text-[#0D817C]" />
              <h4 className="font-bold text-[#172554]">Document Review & Context</h4>
            </div>
            <p className="text-sm text-[#334155]">
              This tool organizes information extracted from your document. Aroviax does not calculate diagnostic probabilities or alter medical values. Review all findings directly with your healthcare provider.
            </p>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-900">
              <strong>Ambiguity warning:</strong> Lab values, measurements, and clinical abbreviations depend heavily on context, personal history, age, and individual laboratory reference ranges. A number alone does not determine health or illness.
            </div>
          </div>

          {/* Doctor Discussion Questions */}
          {questions.length > 0 && (
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-[#172554]">
                  Suggested Questions for Your Healthcare Provider
                </h4>
                <button
                  type="button"
                  onClick={() => {
                    if (isSpeaking) stopSpeaking();
                    else speakText(questions.join(". "));
                  }}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg bg-[#E8F6F4] text-[#0D817C] hover:bg-[#0D817C] hover:text-white transition-colors"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{isSpeaking ? "Stop Audio" : "Listen to Questions"}</span>
                </button>
              </div>
              <ul className="space-y-2">
                {questions.map((q, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-[#334155]">
                    <span className="text-[#0D817C] font-bold mt-0.5 shrink-0">□</span>
                    {q}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex items-center gap-3">
            <button
              onClick={reset}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-[#0D817C] border border-[#0D817C] hover:bg-[#E8F6F4] transition-colors"
            >
              <Upload className="w-4 h-4" /> Upload Another Document
            </button>
          </div>
        </div>
      )}

      {/* Feature limitations transparency */}
      <div className="bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] p-4">
        <div className="flex gap-2 items-start">
          <Info className="w-4 h-4 text-[#64748B] shrink-0 mt-0.5" />
          <div className="text-xs text-[#64748B] space-y-1">
            <p>
              <strong>What this tool does:</strong> Reads, sanitizes, and extracts concepts from plain text documents locally on your device.
            </p>
            <p>
              <strong>Retention & Privacy:</strong> No document text is stored on external servers or retained after you click &quot;Purge from Memory&quot; or navigate away.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
