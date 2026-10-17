import React from "react";
import Link from "next/link";
import {
  ShieldAlert,
  AlertOctagon,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Sparkles,
} from "lucide-react";

export const metadata = {
  title: "Safety Framework & Clinical Boundaries | Aroviax — AI Health Companion",
  description: "Comprehensive safety standards, clinical boundaries, and emergency protocols for Aroviax.",
};

export default function SafetyPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B]">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Homepage</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/safety/lab"
              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Responsible AI Lab</span>
            </Link>
            <Link
              href="/assistant"
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              Open Assistant
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Header Title */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-900 border border-amber-200">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-700" />
            <span>Clinical Boundaries & Safety Policy</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#172554] tracking-tight">
            AI support can help you prepare. Medical professionals provide care.
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
            Aroviax is an educational technology prototype. It is engineered to clarify health
            terminology and structure questions—never to replace licensed medical care.
          </p>
        </div>

        {/* Emergency Medical Notice */}
        <div
          role="alert"
          className="p-6 sm:p-8 rounded-3xl bg-amber-50/90 border-2 border-amber-300 shadow-sm space-y-4"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-700 text-white flex items-center justify-center shrink-0">
              <AlertOctagon className="w-7 h-7" />
            </div>
            <div className="space-y-2">
              <h2 className="text-lg font-bold text-amber-950">
                Emergency Medical Notice
              </h2>
              <p className="text-sm font-semibold text-amber-900 leading-relaxed">
                “If you may be experiencing a medical emergency, contact local emergency services or
                seek urgent medical care immediately.”
              </p>
              <p className="text-xs text-amber-800 leading-relaxed">
                Do not wait for or interact with AI conversational software when experiencing acute
                chest pain, shortness of breath, sudden numbness, uncontrolled bleeding, suicidal
                ideation, or other life-threatening symptoms.
              </p>
            </div>
          </div>
        </div>

        {/* Core Principles */}
        <section className="space-y-6">
          <h2 className="text-xl font-bold text-[#172554]">
            1. Fundamental Principles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
                A
              </div>
              <h3 className="font-bold text-base text-[#172554]">
                General Informational Support Only
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                The software translates clinical jargon into everyday language and organizes user-reported
                symptoms. It never offers a definitive diagnosis or medical prescription.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-sm">
                B
              </div>
              <h3 className="font-bold text-base text-[#172554]">
                Acknowledges Inherent Uncertainty
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Large language models can misinterpret nuance or produce factual errors. The assistant
                explicitly states what it cannot verify and avoids speculation.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-sm">
                C
              </div>
              <h3 className="font-bold text-base text-[#172554]">
                Cannot Confirm Diagnoses
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Only a qualified physician with direct clinical context can perform examinations,
                order appropriate imaging/labs, and establish a diagnosis.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
                D
              </div>
              <h3 className="font-bold text-base text-[#172554]">
                Do Not Delay Urgent Medical Care
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Interacting with software must never delay seeking professional care. If symptoms worsen
                or appear urgent, contact local healthcare providers immediately.
              </p>
            </div>
          </div>
        </section>

        {/* Boundary Comparison Grid */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-[#172554]">
            2. Scope & Operational Boundaries
          </h2>
          <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200">
              <div className="p-6 bg-slate-50/50 space-y-3">
                <span className="font-bold text-teal-800 flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-teal-700" />
                  What Aroviax Does
                </span>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
                  <li>&bull; Clarifies medical concepts across 3 reading levels.</li>
                  <li>&bull; Organizes symptom timelines into chronological summaries.</li>
                  <li>&bull; Curates targeted questions for doctor consultations.</li>
                  <li>&bull; Generates printable appointment checklists.</li>
                </ul>
              </div>

              <div className="p-6 bg-slate-50/20 space-y-3">
                <span className="font-bold text-red-800 flex items-center gap-2 text-sm">
                  <XCircle className="w-4 h-4 text-red-600" />
                  What Aroviax Never Does
                </span>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
                  <li>&bull; Never calculates disease likelihoods or risk scores.</li>
                  <li>&bull; Never prescribes medications or adjusts dosages.</li>
                  <li>&bull; Never claims FDA approval or clinical certification.</li>
                  <li>&bull; Never claims to replace your physician.</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Link to Responsible AI Lab */}
        <div className="p-6 rounded-2xl bg-blue-50 border border-blue-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-[#172554] text-sm">
              Inspect Our Guardrails in the Responsible AI Lab
            </h3>
            <p className="text-xs text-slate-600">
              View refusal policies, safety prompt benchmarks, and test evaluation matrices.
            </p>
          </div>
          <Link
            href="/safety/lab"
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors shrink-0 flex items-center gap-1.5"
          >
            <span>Open AI Lab</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 text-center text-xs text-slate-500 mt-16">
        <p>&copy; 2026 Aroviax Project. Hackathon Demonstration Prototype.</p>
      </footer>
    </div>
  );
}
