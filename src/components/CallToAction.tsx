import React from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck, HeartHandshake } from "lucide-react";

interface CallToActionProps {
  onOpenSafetyModal: () => void;
}

export function CallToAction({ onOpenSafetyModal }: CallToActionProps) {
  return (
    <section
      aria-labelledby="cta-heading"
      className="py-16 md:py-20 bg-[#F8FAFC] border-t border-[#E2E8F0]"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-[#172554] rounded-3xl p-8 sm:p-12 lg:p-16 text-white shadow-lg relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto">
            {/* Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#E8F6F4]/15 text-[#E8F6F4] border border-[#0D817C]/40 mb-6">
              <HeartHandshake className="w-3.5 h-3.5 text-[#E8F6F4]" />
              <span>Calm, Informed Healthcare Preparation</span>
            </div>

            {/* Headline */}
            <h2
              id="cta-heading"
              className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-4"
            >
              Take the next step with clearer questions.
            </h2>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-8">
              Use AI to understand health information and prepare for a more informed conversation
              with a healthcare professional.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/assistant"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-white bg-[#0D817C] hover:bg-[#086B67] active:scale-[0.98] shadow-sm transition-all focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#0D817C]"
              >
                <span>Try the Assistant</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/safety"
                onClick={onOpenSafetyModal}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-white bg-white/10 hover:bg-white/15 border border-white/20 transition-all focus-visible:ring-2 focus-visible:ring-white"
              >
                <ShieldCheck className="w-4 h-4 text-[#E8F6F4]" />
                <span>Read Safety Guidelines</span>
              </Link>
            </div>

            {/* Direct Reassuring Footnote */}
            <p className="mt-8 text-xs text-slate-400">
              No registration required for preview · Non-diagnostic assistance · Respects clinical privacy
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
