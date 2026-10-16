"use client";

import React from "react";
import {
  ShieldAlert,
  HeartPulse,
  UserCheck,
  HelpCircle,
  FileCheck2,
  XCircle,
  CheckCircle2,
} from "lucide-react";
import { SafetyNotice } from "./SafetyNotice";

interface SafetySectionProps {
  onOpenSafetyModal: () => void;
}

export function SafetySection({ onOpenSafetyModal }: SafetySectionProps) {
  return (
    <section
      id="safety"
      aria-labelledby="safety-heading"
      className="py-16 md:py-24 bg-white border-t border-[#E2E8F0]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-[#B45309] border border-amber-200 mb-4">
            <ShieldAlert className="w-3.5 h-3.5 text-[#B45309]" />
            <span>Safety & Clinical Boundaries</span>
          </div>
          <h2
            id="safety-heading"
            className="text-3xl sm:text-4xl font-extrabold text-[#172554] tracking-tight mb-4"
          >
            AI support can help you prepare. Medical professionals provide care.
          </h2>
          <p className="text-base sm:text-lg text-[#334155] leading-relaxed">
            Understanding health information requires clear boundaries. MediSupport AI is strictly
            engineered to augment your preparation, never to displace clinical judgment.
          </p>
        </div>

        {/* Clear Emergency Notice Box */}
        <SafetyNotice variant="emergency-box" className="max-w-4xl mx-auto mb-16" />

        {/* Core Safety Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0]">
            <div className="w-10 h-10 rounded-lg bg-[#E8F6F4] border border-[#0D817C]/20 flex items-center justify-center text-[#0D817C] mb-4">
              <HeartPulse className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-[#172554] mb-2">
              General Informational Support Only
            </h4>
            <p className="text-sm text-[#334155] leading-relaxed">
              The assistant explains standard health literacy concepts, common symptoms, and
              appointment workflows. It does not replace a qualified healthcare professional.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0]">
            <div className="w-10 h-10 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-[#B45309] mb-4">
              <HelpCircle className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-[#172554] mb-2">
              Acknowledges Potential Mistakes
            </h4>
            <p className="text-sm text-[#334155] leading-relaxed">
              Large language models can misinterpret symptoms, omit subtle nuances, or make
              factual errors. All outputs must be verified by a human clinician.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0]">
            <div className="w-10 h-10 rounded-lg bg-[#E8F6F4] border border-[#0D817C]/20 flex items-center justify-center text-[#0D817C] mb-4">
              <UserCheck className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-[#172554] mb-2">
              Cannot Confirm Diagnoses
            </h4>
            <p className="text-sm text-[#334155] leading-relaxed">
              The assistant cannot confirm a diagnosis. Only a licensed clinician who examines you
              in person or via certified telehealth can formulate a clinical diagnosis.
            </p>
          </div>
        </div>

        {/* What We Do vs What We Never Do Comparison Grid */}
        <div className="max-w-4xl mx-auto rounded-2xl border border-[#E2E8F0] overflow-hidden bg-white shadow-xs mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#E2E8F0]">
            {/* What MediSupport AI Does */}
            <div className="p-6 sm:p-8 bg-[#F8FAFC]/60">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-5 h-5 text-[#0D817C]" />
                <h4 className="font-bold text-[#172554] text-base">
                  What MediSupport AI Does
                </h4>
              </div>
              <ul className="space-y-3 text-xs sm:text-sm text-[#334155]">
                <li className="flex items-start gap-2">
                  <span className="text-[#0D817C] font-bold">&#10003;</span>
                  <span>Helps organize confusing symptoms into a chronological summary</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#0D817C] font-bold">&#10003;</span>
                  <span>Formulates clear questions to ask your healthcare provider</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#0D817C] font-bold">&#10003;</span>
                  <span>Explains complex health terms in plain, accessible language</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#0D817C] font-bold">&#10003;</span>
                  <span>Reminds users of necessary medical records and test history to bring</span>
                </li>
              </ul>
            </div>

            {/* What MediSupport AI Never Does */}
            <div className="p-6 sm:p-8 bg-[#F8FAFC]/30">
              <div className="flex items-center gap-2 mb-4">
                <XCircle className="w-5 h-5 text-[#B91C1C]" />
                <h4 className="font-bold text-[#172554] text-base">
                  What MediSupport AI Never Does
                </h4>
              </div>
              <ul className="space-y-3 text-xs sm:text-sm text-[#334155]">
                <li className="flex items-start gap-2">
                  <span className="text-[#B91C1C] font-bold">&#10005;</span>
                  <span>Never diagnoses illnesses or classifies medical conditions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#B91C1C] font-bold">&#10005;</span>
                  <span>Never prescribes medications or adjusts dosages</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#B91C1C] font-bold">&#10005;</span>
                  <span>Never advises delaying emergency or urgent medical care</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#B91C1C] font-bold">&#10005;</span>
                  <span>Never claims FDA approval, clinical certification, or physician parity</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Link to Full Safety Framework */}
        <div className="text-center">
          <button
            type="button"
            onClick={onOpenSafetyModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-[#0D817C] bg-[#E8F6F4] hover:bg-[#d5eee9] border border-[#0D817C]/20 transition-colors focus-visible:ring-2 focus-visible:ring-[#0D817C]"
          >
            <FileCheck2 className="w-4 h-4" />
            <span>Read Complete Safety Framework & Ethics Policy</span>
          </button>
        </div>
      </div>
    </section>
  );
}
