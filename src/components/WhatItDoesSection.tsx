import React from "react";
import { BookOpen, ListFilter, ClipboardCheck, ArrowUpRight, ShieldCheck } from "lucide-react";

export function WhatItDoesSection() {
  const cards = [
    {
      id: "understand",
      icon: BookOpen,
      iconColor: "text-[#0D817C]",
      bgColor: "bg-[#E8F6F4]",
      borderColor: "border-[#0D817C]/20",
      title: "Understand Health Information",
      description:
        "Help users understand general health terminology and common medical concepts in plain language.",
      benefit: "Decodes complex clinical terms into everyday language you can easily comprehend.",
      example: "Demystifies lab ranges, diagnostic terminology, and anatomical references.",
    },
    {
      id: "organize",
      icon: ListFilter,
      iconColor: "text-[#0D817C]",
      bgColor: "bg-[#E8F6F4]",
      borderColor: "border-[#0D817C]/20",
      title: "Organize Your Concerns",
      description:
        "Help users structure symptom descriptions and identify useful details to share with a healthcare professional.",
      benefit: "Turns vague worries into a chronological, structured outline that doctors can quickly evaluate.",
      example: "Highlights key factors like onset timing, triggers, pain quality, and severity variations.",
    },
    {
      id: "prepare",
      icon: ClipboardCheck,
      iconColor: "text-[#0D817C]",
      bgColor: "bg-[#E8F6F4]",
      borderColor: "border-[#0D817C]/20",
      title: "Prepare for Appointments",
      description:
        "Help users create a list of questions, concerns, and relevant information before a medical visit.",
      benefit: "Ensures you maximize limited clinical visit time without forgetting vital inquiries.",
      example: "Produces an actionable checklist of priority questions and documentation to bring.",
    },
  ];

  return (
    <section
      id="features"
      aria-labelledby="what-it-does-heading"
      className="py-16 md:py-24 bg-white border-y border-[#E2E8F0]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E8F6F4] text-[#0D817C] mb-4 border border-[#0D817C]/20">
            <span>Core Capabilities</span>
          </div>
          <h2
            id="what-it-does-heading"
            className="text-3xl sm:text-4xl font-extrabold text-[#172554] tracking-tight mb-4"
          >
            Health information, made easier to navigate.
          </h2>
          <p className="text-base sm:text-lg text-[#334155] leading-relaxed">
            Rather than jumping to alarming internet conclusions, Aroviax provides calm,
            structured guidance to help you prepare before seeing your doctor.
          </p>
        </div>

        {/* 3 Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                className="group relative flex flex-col justify-between p-8 rounded-2xl bg-white border border-[#E2E8F0] hover:border-[#0D817C]/40 hover:shadow-md transition-all duration-200"
              >
                <div>
                  <div
                    className={`w-12 h-12 rounded-xl ${card.bgColor} ${card.borderColor} border flex items-center justify-center mb-6 group-hover:scale-105 transition-transform`}
                  >
                    <Icon className={`w-6 h-6 ${card.iconColor}`} aria-hidden="true" />
                  </div>

                  <h3 className="text-xl font-bold text-[#172554] mb-3 group-hover:text-[#0D817C] transition-colors">
                    {card.title}
                  </h3>

                  <p className="text-sm text-[#334155] leading-relaxed mb-6">
                    {card.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#E2E8F0] space-y-2">
                  <div className="text-xs font-semibold text-[#172554] flex items-center gap-1.5">
                    <ArrowUpRight className="w-3.5 h-3.5 text-[#0D817C]" />
                    Key Benefit:
                  </div>
                  <p className="text-xs text-[#64748B] leading-normal">
                    {card.benefit}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Responsible Boundaries Disclaimer Callout */}
        <div className="mt-12 p-4 rounded-xl bg-[#E8F6F4] border border-[#0D817C]/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#334155]">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-[#0D817C] shrink-0" />
            <span>
              <strong>Scope Notice:</strong> Aroviax does not provide clinical diagnosis,
              formal triage, or medical treatment plans.
            </span>
          </div>
          <a
            href="#safety"
            className="text-[#0D817C] hover:text-[#086B67] font-semibold shrink-0 underline decoration-[#0D817C]/30 underline-offset-2"
          >
            Review our safety principles &rarr;
          </a>
        </div>
      </div>
    </section>
  );
}
