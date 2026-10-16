"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ClipboardCheck,
  BookOpen,
  FileText,
  LineChart,
  Lock,
  Eye,
  ArrowRight,
  Printer,
  Sparkles,
  LucideIcon,
} from "lucide-react";
import { StatusBadge, BadgeStatus } from "./StatusBadge";

interface ToolItem {
  id: string;
  name: string;
  badge: BadgeStatus;
  icon: LucideIcon;
  description: string;
  highlight: string;
  tabParam: string;
}

export function ToolsShowcase() {
  const tools: ToolItem[] = [
    {
      id: "prepkit",
      name: "Visit Prep Kit",
      badge: "On your device",
      icon: ClipboardCheck,
      description:
        "A step-by-step wizard to formulate your symptom timeline, personal severity rating (0–10), and high-yield questions into a clean 1-page summary.",
      highlight: "Produces a printable black-and-white summary sheet for clinical visits.",
      tabParam: "prepkit",
    },
    {
      id: "translator",
      name: "Plain-Language Term Translator",
      badge: "Live",
      icon: BookOpen,
      description:
        "Translates confusing lab reports and clinical terms into 3 reading levels (Simple, Standard, Detailed) plus a mandatory 'What this does NOT tell you' section.",
      highlight: "Unpacks terms like Benign, Edema, and Hypertension without alarming diagnoses.",
      tabParam: "translator",
    },
    {
      id: "aftervisit",
      name: "After-Visit Notes Organizer",
      badge: "Live",
      icon: FileText,
      description:
        "Paste what your doctor told you to structure instructions, follow-up milestones, and clarification questions. Never invents medication dosages.",
      highlight: "Restates patient notes verbatim to ensure follow-up instructions are crystal clear.",
      tabParam: "aftervisit",
    },
    {
      id: "journal",
      name: "Symptom Journal",
      badge: "On your device",
      icon: LineChart,
      description:
        "Log daily observations and personal ratings (0–10) with visual bar charts and accessible data tables. Exportable to CSV or print.",
      highlight: "Strictly avoids trend interpretation; displays only what you entered.",
      tabParam: "journal",
    },
    {
      id: "privacy",
      name: "Privacy Inspector",
      badge: "On your device",
      icon: Lock,
      description:
        "Inspect exact JSON payloads before sending. Provides 1-click client-side PII redaction and a Local-Only mode that blocks all network calls.",
      highlight: "Zero health data selling, transient processing, and full client control.",
      tabParam: "chat",
    },
    {
      id: "accessibility",
      name: "Accessibility Suite",
      badge: "On your device",
      icon: Eye,
      description:
        "Adjust text size up to 130%, toggle high contrast, enable dyslexia-friendly typography, and listen to any response using browser Text-to-Speech.",
      highlight: "Engineered from day one for WCAG AA standards and screen readers.",
      tabParam: "chat",
    },
  ];

  const [activeTool, setActiveTool] = useState(tools[0]);

  return (
    <section
      id="tools"
      aria-labelledby="tools-heading"
      className="py-16 md:py-24 bg-white border-t border-slate-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E8F6F4] text-[#0D817C] mb-4 border border-[#0D817C]/20">
            <Sparkles className="w-3.5 h-3.5 text-[#0D817C]" />
            <span>Beyond Just A Chat Box</span>
          </div>
          <h2
            id="tools-heading"
            className="text-3xl sm:text-4xl font-extrabold text-[#172554] tracking-tight mb-4"
          >
            Practical tools, not just a chat box.
          </h2>
          <p className="text-base sm:text-lg text-[#334155] leading-relaxed">
            Every signature tool is designed for practical patient empowerment—clearly labeled with
            an honest status badge so you know exactly where your data runs.
          </p>
        </div>

        {/* Interactive Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Tool Selector Cards */}
          <div className="lg:col-span-5 space-y-3">
            {tools.map((tool) => {
              const Icon = tool.icon;
              const isSelected = activeTool.id === tool.id;
              return (
                <button
                  key={tool.id}
                  type="button"
                  onClick={() => setActiveTool(tool)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${
                    isSelected
                      ? "bg-[#E8F6F4] border-[#0D817C]/40 ring-2 ring-[#0D817C]/20 shadow-xs"
                      : "bg-[#F8FAFC] border-[#E2E8F0] hover:border-[#0D817C]/30 hover:bg-white"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isSelected ? "bg-[#0D817C] text-white" : "bg-white text-[#334155] border border-[#E2E8F0]"
                    }`}
                  >
                    <Icon className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-bold text-sm text-[#172554] truncate">
                        {tool.name}
                      </span>
                      <StatusBadge status={tool.badge} />
                    </div>
                    <p className="text-xs text-[#64748B] line-clamp-2">
                      {tool.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Column: Active Tool Preview & Sample Visit Summary */}
          <div className="lg:col-span-7 bg-[#F8FAFC] rounded-3xl border border-[#E2E8F0] p-6 sm:p-8 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E2E8F0] pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-xl font-bold text-[#172554]">
                    {activeTool.name}
                  </h3>
                  <StatusBadge status={activeTool.badge} size="md" />
                </div>
                <p className="text-xs text-[#64748B]">{activeTool.highlight}</p>
              </div>

              <Link
                href="/assistant"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#0D817C] hover:bg-[#086B67] shadow-xs transition-colors"
              >
                <span>Open in Assistant</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Tool Detail Preview */}
            <div className="space-y-4">
              <p className="text-sm text-[#334155] leading-relaxed">
                {activeTool.description}
              </p>

              {/* Sample Visit Summary Showcase Box */}
              <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#172554] flex items-center gap-1.5">
                    <Printer className="w-3.5 h-3.5 text-[#0D817C]" />
                    Interactive Output Preview
                  </span>
                  <span className="text-[10px] font-bold text-[#B45309] bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    Sample — fictional data
                  </span>
                </div>

                {activeTool.id === "prepkit" && (
                  <div className="space-y-2 text-xs text-[#334155] font-mono bg-[#F8FAFC] p-3.5 rounded-xl border border-[#E2E8F0]">
                    <p className="text-[#172554] font-bold font-sans text-xs">
                      Primary Concern: Intermittent tension headaches over the past 3 weeks
                    </p>
                    <p>&bull; Onset: 3 weeks ago &bull; Pattern: Peaks in afternoon &bull; Rating: 5/10</p>
                    <p>&bull; Sensations: Band-like tightness across forehead</p>
                    <p>&bull; Priority Question 1: Could this be related to posture or desk ergonomics?</p>
                    <p>&bull; Priority Question 2: What non-medication lifestyle adjustments should I try?</p>
                  </div>
                )}

                {activeTool.id === "translator" && (
                  <div className="space-y-2 text-xs text-[#334155] bg-[#F8FAFC] p-3.5 rounded-xl border border-[#E2E8F0]">
                    <p className="font-bold text-[#172554]">Term: Benign (Non-cancerous)</p>
                    <p className="text-[#334155]">
                      <strong>Simple:</strong> Not cancerous. A growth or bump that will not spread.
                    </p>
                    <p className="text-[#B45309] text-[11px] bg-amber-50 p-2 rounded border border-amber-200">
                      <strong>What this does NOT tell you:</strong> Does not mean it cannot cause discomfort or press on nerves. Regular doctor monitoring is still advised.
                    </p>
                  </div>
                )}

                {activeTool.id !== "prepkit" && activeTool.id !== "translator" && (
                  <div className="space-y-2 text-xs text-[#334155] bg-[#F8FAFC] p-3.5 rounded-xl border border-[#E2E8F0]">
                    <p className="font-bold text-[#172554] font-sans">
                      Standardized patient empowerment workflow
                    </p>
                    <p>
                      Configured for privacy-minded operation. All generated question lists and summaries can be copied or printed directly in black and white.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Reminder */}
            <div className="flex items-center justify-between text-xs text-[#64748B] pt-2">
              <span>Runs with honest status labeling across all features.</span>
              <Link href="/assistant" className="text-[#0D817C] hover:text-[#086B67] font-semibold">
                Explore all 5 tabs in Assistant &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
