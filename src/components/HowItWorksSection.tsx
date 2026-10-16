import React from "react";
import { MessageSquareText, Layers, CheckSquare, ArrowRight } from "lucide-react";

export function HowItWorksSection() {
  const steps = [
    {
      stepNumber: "01",
      title: "Describe your concern.",
      subtitle: "Plain language description",
      description:
        "The user explains what they want to understand using ordinary language. No medical terminology or clinical jargon is needed.",
      icon: MessageSquareText,
      badge: "User Input",
      visualExample: "“I've had knee soreness when going down stairs for two weeks...”",
    },
    {
      stepNumber: "02",
      title: "Get organized information.",
      subtitle: "Structured synthesis",
      description:
        "The assistant provides a readable explanation or helps structure the user's questions into clear, logical talking points.",
      icon: Layers,
      badge: "AI Organization",
      visualExample: "Categorized tracking checklist: timeline, triggers, and impact on mobility.",
    },
    {
      stepNumber: "03",
      title: "Prepare for the appropriate next step.",
      subtitle: "Actionable preparation",
      description:
        "The user receives guidance on when professional medical advice is appropriate and what information may be useful to bring.",
      icon: CheckSquare,
      badge: "Clinical Next Steps",
      visualExample: "List of 4 targeted questions to ask your doctor + red flag symptoms.",
    },
  ];

  return (
    <section
      id="how-it-works"
      aria-labelledby="how-it-works-heading"
      className="py-16 md:py-24 bg-[#F8FAFC]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E8F6F4] text-[#0D817C] mb-4 border border-[#0D817C]/20">
            <span>User Journey</span>
          </div>
          <h2
            id="how-it-works-heading"
            className="text-3xl sm:text-4xl font-extrabold text-[#172554] tracking-tight mb-4"
          >
            How It Works
          </h2>
          <p className="text-base sm:text-lg text-[#334155] leading-relaxed">
            A simple, transparent three-step process designed to eliminate confusion and help you
            arrive at your consultation prepared.
          </p>
        </div>

        {/* 3-Step Process: Horizontal on desktop, stacked on mobile */}
        <div className="relative">
          {/* Desktop Connecting Line */}
          <div
            className="hidden lg:block absolute top-20 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-[#0D817C]/30 via-[#0D817C] to-[#086B67]/40 -z-0"
            aria-hidden="true"
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.stepNumber}
                  className="relative flex flex-col bg-white rounded-2xl p-7 border border-[#E2E8F0] shadow-xs hover:border-[#0D817C]/40 hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-xl bg-[#0D817C] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                        {step.stepNumber}
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-[#E8F6F4] text-[#0D817C] flex items-center justify-center border border-[#0D817C]/20">
                        <Icon className="w-5 h-5" aria-hidden="true" />
                      </div>
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-[#F8FAFC] text-[#334155] border border-[#E2E8F0]">
                      {step.badge}
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <h3 className="text-xl font-bold text-[#172554] mb-1">
                    {step.title}
                  </h3>
                  <span className="text-xs font-medium text-[#0D817C] mb-3 block">
                    {step.subtitle}
                  </span>

                  {/* Description */}
                  <p className="text-sm text-[#334155] leading-relaxed mb-6 flex-1">
                    {step.description}
                  </p>

                  {/* Micro Visual Card Preview */}
                  <div className="mt-auto bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3 text-xs text-[#64748B] italic">
                    <span className="font-semibold text-[#172554] not-italic block mb-1">
                      Example:
                    </span>
                    {step.visualExample}
                  </div>

                  {/* Mobile Arrow Connector */}
                  {index < steps.length - 1 && (
                    <div className="lg:hidden flex justify-center py-4 text-[#0D817C]">
                      <ArrowRight className="w-5 h-5 rotate-90" aria-hidden="true" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Direct Action Link */}
        <div className="mt-12 text-center">
          <a
            href="#demo"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#0D817C] hover:text-[#086B67] focus-visible:ring-2 focus-visible:ring-[#0D817C] rounded-lg p-1"
          >
            <span>Experience the workflow in the interactive demo</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
