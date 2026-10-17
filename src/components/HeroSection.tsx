import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  HelpCircle,
  ShieldCheck,
  Lock,
  HeartHandshake,
} from "lucide-react";
import { AssistantPreview } from "./AssistantPreview";

export function HeroSection() {
  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      className="relative pt-8 pb-16 md:pt-16 md:pb-24 overflow-hidden bg-[#F8FAFC]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headline and Message */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Context Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#E8F6F4] text-[#0D817C] border border-[#0D817C]/20 mb-6">
              <span className="w-2 h-2 rounded-full bg-[#0D817C] animate-pulse" />
              <span>Aroviax — AI Health Companion</span>
            </div>

            {/* Main Headline */}
            <h1
              id="hero-heading"
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#172554] leading-[1.15] mb-6"
            >
              Health questions deserve{" "}
              <span className="text-[#0D817C]">
                clear answers.
              </span>
            </h1>

            {/* Supporting Text */}
            <p className="text-lg sm:text-xl text-[#334155] leading-relaxed mb-8 max-w-2xl">
              Understand health information, organize your concerns, and prepare for better conversations with healthcare professionals.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full sm:w-auto mb-8">
              <Link
                href="/assistant"
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-white bg-[#0D817C] hover:bg-[#086B67] active:scale-[0.98] shadow-sm hover:shadow transition-all focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#0D817C]"
              >
                <span>Try the AI Assistant</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>

              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-[#334155] bg-white hover:bg-[#E8F6F4] border border-[#E2E8F0] hover:border-[#0D817C]/30 shadow-xs transition-all focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#0D817C]"
              >
                <HelpCircle className="w-4 h-4 text-[#0D817C]" aria-hidden="true" />
                <span>How It Works</span>
              </a>
            </div>

            {/* Trust Note & Direct Limitations */}
            <div className="pt-6 border-t border-[#E2E8F0] w-full max-w-2xl">
              <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs font-medium text-[#64748B]">
                <span className="inline-flex items-center gap-1.5 text-[#334155]">
                  <Lock className="w-3.5 h-3.5 text-[#0D817C]" />
                  Private-minded design
                </span>
                <span className="text-slate-300">·</span>
                <span className="inline-flex items-center gap-1.5 text-[#334155]">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#0D817C]" />
                  Clear limitations
                </span>
                <span className="text-slate-300">·</span>
                <span className="inline-flex items-center gap-1.5 text-[#334155]">
                  <HeartHandshake className="w-3.5 h-3.5 text-[#0D817C]" />
                  Human care comes first
                </span>
              </div>
              <p className="mt-2 text-xs text-[#64748B]">
                Non-diagnostic hackathon tool. Does not formulate medical diagnoses or prescribe treatment plans.
              </p>
            </div>
          </div>

          {/* Right Column: Assistant Preview Card */}
          <div className="lg:col-span-5 w-full">
            <AssistantPreview />
          </div>
        </div>
      </div>
    </section>
  );
}
