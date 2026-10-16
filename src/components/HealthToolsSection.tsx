"use client";

import React from "react";
import Link from "next/link";
import {
  Activity,
  ClipboardCheck,
  BookOpen,
  FileText,
  StickyNote,
  Pill,
  Globe,
  MessageSquare,
  LineChart,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

const TOOLS = [
  {
    id: "symptom-organizer",
    icon: Activity,
    title: "Guided Symptom Organizer",
    desc: "Step-by-step flow to structure your symptoms into clear talking points for your visit.",
    badge: "On your device",
  },
  {
    id: "prepkit",
    icon: ClipboardCheck,
    title: "Doctor Visit Preparation",
    desc: "Generate a tailored appointment checklist and questions grouped by concern.",
    badge: "On your device",
  },
  {
    id: "translator",
    icon: BookOpen,
    title: "Medical Term Explainer",
    desc: "Plain-language breakdown of clinical jargon across simple, standard, and detailed levels.",
    badge: "Live",
  },
  {
    id: "document",
    icon: FileText,
    title: "Health Document Explainer",
    desc: "Upload a plain-text document for local review. No data is transmitted. PDF support coming.",
    badge: "Demo",
  },
  {
    id: "notes",
    icon: StickyNote,
    title: "Personal Health Notes",
    desc: "Dated notes and chronological timeline. Stored entirely on your device.",
    badge: "On your device",
  },
  {
    id: "medication",
    icon: Pill,
    title: "Medication Organizer",
    desc: "Record medicines and instructions exactly as given. Generate pharmacist questions. Never recommends doses.",
    badge: "On your device",
  },
  {
    id: "sources",
    icon: Globe,
    title: "Trusted Medical Sources",
    desc: "Curated directory of WHO, CDC, NHS, NLM, and DGHS Bangladesh resources.",
    badge: "Demo",
  },
  {
    id: "chat",
    icon: MessageSquare,
    title: "AI Health Chat",
    desc: "Ask health questions in plain language. Get organized information and suggested questions for your doctor.",
    badge: "Live",
  },
  {
    id: "journal",
    icon: LineChart,
    title: "Symptom Journal",
    desc: "Track daily observations and self-ratings on a chronological chart or table.",
    badge: "On your device",
  },
  {
    id: "aftervisit",
    icon: ShieldCheck,
    title: "After-Visit Notes",
    desc: "Organize and structure notes from a completed appointment for follow-up clarity.",
    badge: "Live",
  },
];

const BADGE_STYLES: Record<string, string> = {
  "Live": "bg-[#E8F6F4] text-[#0D817C] border-[#0D817C]/20",
  "On your device": "bg-slate-100 text-slate-600 border-slate-200",
  "Demo": "bg-amber-50 text-amber-700 border-amber-200",
};

export function HealthToolsSection() {
  return (
    <section id="health-tools" className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-block text-[#0D817C] text-sm font-bold uppercase tracking-widest mb-3">Health Tools</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#172554] mb-4">
            10 tools to prepare, organize, and understand
          </h2>
          <p className="text-[#64748B] text-lg leading-relaxed">
            All tools work together in the assistant workspace. Nothing is a separate website. None of them diagnose conditions.
          </p>
        </div>

        {/* Tool grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-10">
          {TOOLS.map(tool => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.id}
                href={`/assistant?tab=${tool.id}`}
                className="group bg-white border border-[#E2E8F0] rounded-2xl p-5 hover:border-[#0D817C]/50 hover:shadow-sm transition-all flex flex-col gap-3"
              >
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl bg-[#E8F6F4] flex items-center justify-center group-hover:bg-[#0D817C] transition-colors">
                    <Icon className="w-5 h-5 text-[#0D817C] group-hover:text-white transition-colors" />
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${BADGE_STYLES[tool.badge] || BADGE_STYLES["Demo"]}`}>
                    {tool.badge}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-[#172554] mb-1 text-sm leading-snug group-hover:text-[#0D817C] transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-xs text-[#64748B] leading-relaxed">{tool.desc}</p>
                </div>
                <div className="mt-auto flex items-center gap-1 text-xs font-semibold text-[#0D817C] opacity-0 group-hover:opacity-100 transition-opacity">
                  Open tool <ArrowRight className="w-3 h-3" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            href="/assistant"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-white bg-[#0D817C] hover:bg-[#086B67] shadow-sm transition-all text-base"
          >
            Open the Full Workspace
            <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="text-xs text-[#64748B] mt-3">No account required. All local tools work without internet.</p>
        </div>
      </div>
    </section>
  );
}
