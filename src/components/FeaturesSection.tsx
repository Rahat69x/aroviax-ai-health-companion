import React from "react";
import {
  FileText,
  ListOrdered,
  CalendarCheck2,
  Lock,
  SlidersHorizontal,
  ShieldAlert,
} from "lucide-react";
import { FeatureCard, FeatureCardProps } from "./FeatureCard";

export function FeaturesSection() {
  const features: FeatureCardProps[] = [
    {
      id: "plain-language",
      title: "Plain-language explanations",
      description:
        "Translates complex medical conditions, lab results, and diagnostic terminology into clear summaries across 3 reading levels without confusing jargon.",
      icon: FileText,
      badge: "Live",
      color: "text-[#0D817C]",
      bg: "bg-[#E8F6F4]",
    },
    {
      id: "symptom-organizer",
      title: "Symptom organizer & journal",
      description:
        "Structures what you are experiencing into clinical dimensions: timeline, triggers, and your personal 0–10 rating. Never computes diagnostic risk scores.",
      icon: ListOrdered,
      badge: "On your device",
      color: "text-[#0D817C]",
      bg: "bg-[#E8F6F4]",
    },
    {
      id: "appointment-prep",
      title: "Appointment preparation",
      description:
        "Guides you through a step-by-step wizard to compile a clean, 1-page printable Visit Summary and high-yield question checklist for your clinician.",
      icon: CalendarCheck2,
      badge: "On your device",
      color: "text-[#0D817C]",
      bg: "bg-[#E8F6F4]",
    },
    {
      id: "privacy-inspector",
      title: "Client-side privacy inspector",
      description:
        "Inspect exact JSON payloads before sending. Provides 1-click PII redaction (emails, phone, IDs), local-only mode, and instant data clearing.",
      icon: Lock,
      badge: "On your device",
      color: "text-[#0D817C]",
      bg: "bg-[#E8F6F4]",
    },
    {
      id: "accessibility-suite",
      title: "Accessibility suite & audio",
      description:
        "Adjust reading size up to 130%, toggle high-contrast mode, enable dyslexia-friendly typography, and listen to responses with Web Speech API audio.",
      icon: SlidersHorizontal,
      badge: "On your device",
      color: "text-[#0D817C]",
      bg: "bg-[#E8F6F4]",
    },
    {
      id: "safety-transparency",
      title: "Clear safety and uncertainty messages",
      description:
        "Proactively triggers emergency red flag alerts using a conservative, reviewable ruleset. Explicitly outlines what the AI cannot know.",
      icon: ShieldAlert,
      badge: "On your device",
      color: "text-[#B45309]",
      bg: "bg-amber-50",
    },
  ];

  return (
    <section
      aria-labelledby="features-heading"
      className="py-16 md:py-24 bg-white border-t border-[#E2E8F0]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E8F6F4] text-[#0D817C] mb-4 border border-[#0D817C]/20">
            <span>Designed For Patient Empowerment</span>
          </div>
          <h2
            id="features-heading"
            className="text-3xl sm:text-4xl font-extrabold text-[#172554] tracking-tight mb-4"
          >
            Practical tools for your healthcare journey
          </h2>
          <p className="text-base sm:text-lg text-[#334155] leading-relaxed">
            Every feature is focused on clarity, preparation, and safety—grounded in honest
            expectations and respectful of medical expertise.
          </p>
        </div>

        {/* 6 Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature) => (
            <FeatureCard key={feature.id} {...feature} />
          ))}
        </div>

        {/* Responsible Engineering Statement */}
        <div className="mt-12 text-center text-xs text-[#64748B] max-w-2xl mx-auto">
          Features carry honest status badges. MediSupport AI avoids simulated patient databases,
          unvalidated diagnostic algorithms, or exaggerated outcome promises.
        </div>
      </div>
    </section>
  );
}
