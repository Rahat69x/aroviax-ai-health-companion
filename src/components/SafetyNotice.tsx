import React from "react";
import { AlertOctagon, ShieldAlert, AlertTriangle } from "lucide-react";

interface SafetyNoticeProps {
  variant?: "banner" | "emergency-box" | "card";
  onDismiss?: () => void;
  className?: string;
}

export function SafetyNotice({
  variant = "emergency-box",
  className = "",
}: SafetyNoticeProps) {
  if (variant === "banner") {
    return (
      <div
        role="region"
        aria-label="Emergency disclaimer"
        className={`bg-amber-50 border-b border-amber-200/80 px-4 py-2 text-xs md:text-sm text-amber-900 flex items-center justify-between ${className}`}
      >
        <div className="max-w-7xl mx-auto flex items-center gap-2 font-medium">
          <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" aria-hidden="true" />
          <span>
            <strong>Not for emergencies:</strong> If you are experiencing a medical emergency,
            contact local emergency services or seek urgent medical care immediately.
          </span>
        </div>
      </div>
    );
  }

  if (variant === "card") {
    return (
      <div
        className={`flex items-start gap-2.5 p-3.5 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-900 text-xs leading-relaxed ${className}`}
      >
        <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" aria-hidden="true" />
        <p className="font-medium">
          “Seek urgent medical care for sudden, severe symptoms or other emergency warning signs.”
        </p>
      </div>
    );
  }

  return (
    <div
      role="alert"
      className={`p-6 sm:p-8 rounded-2xl bg-amber-50/90 border-2 border-amber-300 shadow-sm ${className}`}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-amber-700 text-white flex items-center justify-center shrink-0 shadow-xs">
          <AlertOctagon className="w-7 h-7" aria-hidden="true" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-amber-950 mb-1">
            Emergency Medical Notice
          </h3>
          <p className="text-sm font-semibold text-amber-900 leading-relaxed">
            “If you may be experiencing a medical emergency, contact local emergency services or seek urgent medical care immediately.”
          </p>
          <p className="text-xs text-amber-800 mt-2">
            Do not wait for or interact with AI conversational software when experiencing acute,
            severe, or life-threatening symptoms.
          </p>
        </div>
      </div>
    </div>
  );
}
