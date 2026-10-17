import React from "react";
import Link from "next/link";
import { ArrowLeft, Lock } from "lucide-react";

export const metadata = {
  title: "Privacy & Data Stewardship Principles | Aroviax — AI Health Companion",
  description: "Learn how Aroviax handles sensitive health information with data minimization and client-side protection.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B]">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Homepage</span>
          </Link>
          <Link
            href="/assistant"
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            Open Assistant
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 text-sm text-slate-700 leading-relaxed">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-900 border border-teal-200">
            <Lock className="w-3.5 h-3.5 text-teal-700" />
            <span>Privacy & Data Stewardship</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#172554] tracking-tight">
            How We Protect Your Health Queries
          </h1>
          <p className="text-base text-slate-600">
            Aroviax practices strict data minimization. Here is an honest, unvarnished disclosure of our data practices.
          </p>
        </div>

        <section className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 space-y-4 shadow-xs">
          <h2 className="text-lg font-bold text-[#172554]">
            1. What We Collect and Why
          </h2>
          <p>
            When you use the live assistant, only the text query you type or speak is transmitted to our Next.js API route to format plain-language responses and synthesize consultation questions.
          </p>
          <p>
            We do NOT collect real names, email addresses, phone numbers, insurance member IDs, or physical addresses to use the tool.
          </p>
        </section>

        <section className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 space-y-4 shadow-xs">
          <h2 className="text-lg font-bold text-[#172554]">
            2. Local-Only Mode and Client-Side Protection
          </h2>
          <p>
            We provide a dedicated <strong>Local-Only Mode</strong> in the Assistant workspace. When toggled ON, the software disables all network calls; all symptom structuring and phrase matching run 100% inside your browser on your device.
          </p>
          <p>
            Additionally, our <strong>Privacy Inspector</strong> automatically scans draft messages for phone numbers, email addresses, and identification numbers, offering 1-click anonymization before you press Send.
          </p>
        </section>

        <section className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 space-y-4 shadow-xs">
          <h2 className="text-lg font-bold text-[#172554]">
            3. Data Retention & Deletion
          </h2>
          <p>
            Interactions in this demonstration prototype are transient. No persistent database holds your chat history across browser restarts.
          </p>
          <p>
            Display preferences and symptom journal entries are stored in your browser&apos;s local storage only if you explicitly choose to keep them. You can click <strong>&ldquo;Clear All My Data&rdquo;</strong> in the assistant top bar at any time to purge local storage.
          </p>
        </section>

        <section className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 space-y-4 shadow-xs">
          <h2 className="text-lg font-bold text-[#172554]">
            4. Honest Compliance Notice
          </h2>
          <p className="text-amber-900 bg-amber-50 p-4 rounded-xl border border-amber-200 text-xs">
            <strong>Important Regulatory Notice:</strong> Aroviax is an educational concept built for a technology hackathon. We have NOT conducted formal HIPAA, HITECH, or GDPR compliance audits. Therefore, users must never submit real Protected Health Information (PHI), medical records, or sensitive identities.
          </p>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 text-center text-xs text-slate-500 mt-16">
        <p>&copy; 2026 Aroviax Project. Transparent Privacy Engineering.</p>
      </footer>
    </div>
  );
}
