import React from "react";
import Link from "next/link";
import { Stethoscope, HeartHandshake, Shield, Sparkles } from "lucide-react";

interface FooterProps {
  onOpenSafetyModal: () => void;
  onOpenPrivacyModal: () => void;
  onOpenTermsModal: () => void;
}

export function Footer({
  onOpenSafetyModal,
  onOpenPrivacyModal,
  onOpenTermsModal,
}: FooterProps) {
  const currentYear = 2026;

  return (
    <footer className="bg-[#172554] text-slate-300 border-t border-slate-800 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand & Project Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#0D817C] flex items-center justify-center text-white shadow-sm">
                <Stethoscope className="w-5 h-5" aria-hidden="true" />
              </div>
              <span className="font-bold text-xl text-white tracking-tight">
                Aroviax<span className="text-[#0D817C]"></span>
              </span>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed max-w-sm">
              An AI healthcare-support hackathon project created to make health information
              approachable, organize symptom details, and prepare individuals for informed doctor
              conversations.
            </p>

            <div className="flex items-center gap-2 text-xs text-slate-400 pt-2">
              <Sparkles className="w-4 h-4 text-[#0D817C]" />
              <span>Built for AI Healthcare Hackathon demonstration</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/#hero" className="hover:text-[#0D817C] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/#features" className="hover:text-[#0D817C] transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="hover:text-[#0D817C] transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/safety" className="hover:text-[#0D817C] transition-colors">
                  Safety
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="hover:text-[#0D817C] transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/assistant" className="text-[#0D817C] hover:text-white transition-colors font-semibold">
                  Try the Assistant &rarr;
                </Link>
              </li>
            </ul>
          </div>

          {/* Safety & Trust Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Safety & Ethics
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/safety" className="hover:text-[#0D817C] transition-colors">
                  Safety Guidelines
                </Link>
              </li>
              <li>
                <Link href="/safety/lab" className="hover:text-[#0D817C] transition-colors text-slate-300">
                  Responsible AI Lab
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenSafetyModal}
                  className="hover:text-[#0D817C] transition-colors text-left"
                >
                  Clinical Boundaries
                </button>
              </li>
              <li>
                <Link href="/#faq" className="hover:text-[#0D817C] transition-colors">
                  FAQ & Limitations
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Policy Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Transparency
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="hover:text-[#0D817C] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[#0D817C] transition-colors">
                  Terms of Use
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenPrivacyModal}
                  className="hover:text-[#0D817C] transition-colors text-left"
                >
                  Privacy Modal
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenTermsModal}
                  className="hover:text-[#0D817C] transition-colors text-left"
                >
                  Terms Modal
                </button>
              </li>
              <li>
                <span className="text-xs text-slate-400 block pt-1">
                  Project: AI Healthcare Hackathon
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Disclaimer Banner */}
        <div className="mt-12 pt-8 border-t border-slate-700/60 text-xs text-slate-400 space-y-3 leading-relaxed">
          <div className="flex items-center gap-2 text-slate-300 font-semibold">
            <Shield className="w-4 h-4 text-[#B45309] shrink-0" />
            <span>Important Medical and Legal Disclaimer:</span>
          </div>
          <p>
            Aroviax is an educational concept developed for an AI healthcare hackathon. It is
            not a diagnostic medical device, does not formulate clinical diagnoses, does not prescribe
            medications, and does not replace the relationship between a patient and their physician.
            Always seek the advice of your physician or other qualified health provider with any
            questions you may have regarding a medical condition. Never disregard professional
            medical advice or delay in seeking it because of something you have read on this
            application.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 text-slate-400">
            <span>&copy; {currentYear} Aroviax — AI Health Companion. Open-source hackathon demonstrator.</span>
            <div className="flex items-center gap-1.5 text-slate-300">
              <HeartHandshake className="w-3.5 h-3.5 text-[#0D817C]" />
              <span>Patient empowerment through clarity & communication</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
