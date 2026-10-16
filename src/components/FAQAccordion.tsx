"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export function FAQAccordion() {
  const faqs: FAQItem[] = [
    {
      id: "faq-works",
      question: "How does MediSupport AI work?",
      answer:
        "MediSupport AI works in three simple steps: you describe your health concern in plain everyday language, the assistant organizes your symptoms and generates key questions to ask, and you receive structured preparation to help guide your discussion with a licensed healthcare professional.",
    },
    {
      id: "faq-diagnosis",
      question: "Can the AI diagnose my condition?",
      answer:
        "No. MediSupport AI is strictly an informational support tool and cannot confirm or establish medical diagnoses. Only licensed clinicians with direct clinical context can perform examinations, interpret diagnostic tests, and formulate medical diagnoses.",
    },
    {
      id: "faq-reliability",
      question: "Can I rely on the answers for treatment decisions?",
      answer:
        "No. All treatment decisions, medication changes, and healthcare management plans must be discussed with and prescribed by a qualified healthcare professional. Our tool is designed solely to help you organize questions and understand general health terminology before your appointment.",
    },
    {
      id: "faq-emergency",
      question: "What should I do if my symptoms are severe or an emergency?",
      answer:
        "Do not wait for the AI or spend time interacting with digital tools. Seek urgent or emergency medical care immediately, or call your local emergency services (such as 911).",
    },
    {
      id: "faq-privacy",
      question: "How is my privacy and health data protected?",
      answer:
        "In this demonstration version, messages are processed to format your questions and provide plain-language explanations. Interactions are processed in real time and are not linked to a persistent patient profile or sold. However, persistent medical encryption audits have not been performed, so you should never submit real names, medical record numbers, addresses, or sensitive personal identifiers.",
    },
    {
      id: "faq-uncertainty",
      question: "What happens if the AI is uncertain?",
      answer:
        "The assistant is programmed to explicitly communicate uncertainty, highlight gaps where clinical examinations are required, and direct users to consult human medical specialists rather than guessing or presenting speculative answers as medical facts.",
    },
  ];

  const [openIds, setOpenIds] = useState<Record<string, boolean>>({
    "faq-works": true, // First item open by default
  });

  const toggleItem = (id: string) => {
    setOpenIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="py-16 md:py-24 bg-[#F8FAFC] border-t border-[#E2E8F0]"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E8F6F4] text-[#0D817C] border border-[#0D817C]/20 mb-4">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Frequently Asked Questions</span>
          </div>
          <h2
            id="faq-heading"
            className="text-3xl sm:text-4xl font-extrabold text-[#172554] tracking-tight mb-4"
          >
            Clear answers about how we work
          </h2>
          <p className="text-base text-[#334155] max-w-2xl mx-auto">
            Transparency is central to patient trust. Here is what you should know about our scope,
            data practices, and limitations.
          </p>
        </div>

        {/* Accordion Container */}
        <div className="space-y-4">
          {faqs.map((faq) => {
            const isOpen = !!openIds[faq.id];
            const buttonId = `faq-button-${faq.id}`;
            const panelId = `faq-panel-${faq.id}`;

            return (
              <div
                key={faq.id}
                className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xs overflow-hidden transition-all duration-200"
              >
                <h3>
                  <button
                    id={buttonId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => toggleItem(faq.id)}
                    className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 font-bold text-base sm:text-lg text-[#172554] hover:text-[#0D817C] focus-visible:ring-2 focus-visible:ring-[#0D817C] focus-visible:outline-none transition-colors"
                  >
                    <span>{faq.question}</span>
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                        isOpen ? "rotate-180 bg-[#E8F6F4] text-[#0D817C]" : "bg-slate-100 text-[#64748B]"
                      }`}
                      aria-hidden="true"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </span>
                  </button>
                </h3>

                {isOpen && (
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    className="px-6 pb-6 pt-1 text-sm sm:text-base text-[#334155] leading-relaxed border-t border-[#E2E8F0] animate-in fade-in-50 duration-200"
                  >
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
