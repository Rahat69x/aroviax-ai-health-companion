import React from "react";
import Link from "next/link";
import { Bot, User, CheckCircle2, ArrowRight, Printer, AlertTriangle } from "lucide-react";
import { StatusBadge } from "./StatusBadge";

export function AssistantPreview() {
  const usefulPrompts = [
    "When did it start?",
    "Where is the pain?",
    "How severe does it feel?",
    "Are there other symptoms?",
  ];

  return (
    <div className="relative">
      <div className="rounded-2xl bg-white border border-[#E2E8F0] shadow-xl shadow-slate-200/50 overflow-hidden">
        {/* Card Header with Demo Preview Label */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-[#F8FAFC] border-b border-[#E2E8F0]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#0D817C] text-white flex items-center justify-center shadow-xs">
              <Bot className="w-4 h-4" aria-hidden="true" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#172554] block leading-tight">
                MediSupport Assistant
              </span>
              <span className="text-[10px] text-[#0D817C] flex items-center gap-1 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0D817C]" />
                Health Information Guide &bull; Demo
              </span>
            </div>
          </div>

          {/* Honest Status Badge: Labeled hardcoded conversation as demo */}
          <StatusBadge status="Demo" size="sm" />
        </div>

        {/* Chat Content Body */}
        <div className="p-5 space-y-4 bg-[#F8FAFC]/50">
          {/* User Message Bubble */}
          <div className="flex items-start gap-3 justify-end">
            <div className="bg-[#0D817C] text-white p-3.5 rounded-2xl rounded-tr-xs text-sm max-w-[85%] shadow-xs leading-relaxed">
              &ldquo;Help me organize information about a headache I&apos;ve had since yesterday.&rdquo;
            </div>
            <div className="w-7 h-7 rounded-full bg-[#E2E8F0] text-[#334155] flex items-center justify-center shrink-0 text-xs">
              <User className="w-4 h-4 text-[#64748B]" aria-hidden="true" />
            </div>
          </div>

          {/* Assistant Message Bubble */}
          <div className="flex items-start gap-3 justify-start">
            <div className="w-7 h-7 rounded-full bg-[#0D817C] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Bot className="w-4 h-4" aria-hidden="true" />
            </div>
            <div className="space-y-3 max-w-[92%]">
              <div className="bg-white border border-[#E2E8F0] p-3.5 rounded-2xl rounded-tl-xs text-sm text-[#334155] shadow-xs leading-relaxed">
                &ldquo;I can help you organize details that may be useful to discuss with a healthcare professional.&rdquo;
              </div>

              {/* Useful Prompts Checklist Box */}
              <div className="bg-[#E8F6F4] border border-[#0D817C]/20 rounded-xl p-3.5 shadow-2xs">
                <p className="text-xs font-bold text-[#172554] mb-2">
                  Useful prompts:
                </p>
                <ul className="space-y-1.5 text-xs text-[#334155]">
                  {usefulPrompts.map((prompt, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#0D817C] shrink-0" aria-hidden="true" />
                      <span className="font-medium">{prompt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Exact Emergency Warning Notice Required */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-[#B45309] flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-[#B45309] shrink-0 mt-0.5" aria-hidden="true" />
                <span className="leading-relaxed">
                  Seek urgent medical care for sudden, severe symptoms or other emergency warning signs.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Interactive Prompt Invitation */}
        <div className="px-5 py-3 bg-white border-t border-[#E2E8F0] flex items-center justify-between text-xs text-[#64748B]">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#0D817C]" />
            Non-diagnostic appointment preparation
          </span>
          <Link
            href="/assistant"
            className="text-[#0D817C] hover:text-[#086B67] font-semibold inline-flex items-center gap-1"
          >
            Open Assistant
            <ArrowRight className="w-3 h-3" aria-hidden="true" />
          </Link>
        </div>
      </div>

      {/* Small Overlapping "Visit Summary ready to print" Mini-Card Hint */}
      <Link
        href="/assistant"
        className="hidden sm:flex absolute -bottom-5 -left-4 items-center gap-3 bg-white border border-[#E2E8F0] rounded-2xl px-4 py-2.5 shadow-lg shadow-slate-900/5 hover:border-[#0D817C]/40 hover:-translate-y-0.5 transition-all text-xs z-20 group"
      >
        <div className="w-8 h-8 rounded-xl bg-[#E8F6F4] text-[#0D817C] border border-[#0D817C]/20 flex items-center justify-center shrink-0 group-hover:bg-[#0D817C] group-hover:text-white transition-colors">
          <Printer className="w-4 h-4" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-[#172554] flex items-center gap-1.5 leading-tight">
            Visit Summary ready to print
            <ArrowRight className="w-3 h-3 text-[#0D817C] group-hover:translate-x-0.5 transition-transform" />
          </span>
          <span className="text-[11px] text-[#64748B]">1-page clinic sheet &bull; Visit Prep Kit</span>
        </div>
        <StatusBadge status="On your device" size="sm" />
      </Link>
    </div>
  );
}
