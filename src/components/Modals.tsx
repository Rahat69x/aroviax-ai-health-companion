"use client";

import React, { useEffect } from "react";
import { X, ShieldAlert, Lock, FileText } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

function BaseModal({ isOpen, onClose, title, children }: ModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-2xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col z-10">
        {/* Header */}
        <div className="px-6 py-4 bg-[#F8FAFC] border-b border-[#E2E8F0] flex items-center justify-between">
          <h3 className="text-lg font-bold text-[#172554]">{title}</h3>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1.5 rounded-lg text-[#64748B] hover:text-[#172554] hover:bg-[#E8F6F4] transition-colors focus-visible:ring-2 focus-visible:ring-[#0D817C]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-sm text-[#334155] leading-relaxed">
          {children}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-[#F8FAFC] border-t border-[#E2E8F0] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-sm font-semibold text-white bg-[#0D817C] hover:bg-[#086B67] transition-colors focus-visible:ring-2 focus-visible:ring-[#0D817C]"
          >
            Close & Return
          </button>
        </div>
      </div>
    </div>
  );
}

export function SafetyModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Safety Guidelines & Clinical Boundaries"
    >
      <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 space-y-1 mb-4">
        <div className="flex items-center gap-2 font-bold text-amber-900">
          <ShieldAlert className="w-4 h-4 text-amber-700" />
          <span>Non-Diagnostic Disclaimer</span>
        </div>
        <p className="text-xs text-amber-800">
          MediSupport AI is an educational technology prototype. It is NOT a doctor, medical device,
          or clinical diagnostic tool.
        </p>
      </div>

      <h4 className="font-bold text-[#172554]">1. Core Purpose</h4>
      <p>
        The primary objective of MediSupport AI is health literacy and communication support. It
        empowers users to organize their thoughts, learn general health terminology, and draft
        questions before visiting a certified physician.
      </p>

      <h4 className="font-bold text-[#172554]">2. Immediate Emergency Protocol</h4>
      <p>
        If you or someone you are assisting experiences any of the following symptoms, STOP using
        this application and call emergency medical services (such as 911 or your local emergency
        number) immediately:
      </p>
      <ul className="list-disc pl-5 space-y-1 text-xs">
        <li>Chest pain, tight pressure in chest, or pain radiating to arms/jaw</li>
        <li>Severe difficulty breathing or shortness of breath</li>
        <li>Sudden numbness, weakness, or facial drooping (signs of stroke)</li>
        <li>Sudden loss of speech, vision, or severe disorientation</li>
        <li>Uncontrollable bleeding or severe physical injury</li>
        <li>Thoughts of self-harm or suicide</li>
      </ul>

      <h4 className="font-bold text-[#172554]">3. AI Limitations & Error Boundaries</h4>
      <p>
        Artificial intelligence models can generate inaccurate, incomplete, or outdated
        information. Health choices must never be made solely on AI outputs without consulting a
        qualified clinical provider who has reviewed your personal medical history.
      </p>

      <h4 className="font-bold text-[#172554]">4. What We Do Not Do</h4>
      <p>
        We do not prescribe medications, calculate dosages, order lab work, perform clinical
        triage, or provide second opinions that supersede clinical guidelines.
      </p>
    </BaseModal>
  );
}

export function PrivacyModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Privacy & Data Stewardship Principles"
    >
      <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 text-teal-950 space-y-1 mb-4">
        <div className="flex items-center gap-2 font-bold text-teal-900">
          <Lock className="w-4 h-4 text-teal-700" />
          <span>Privacy-Minded Architecture</span>
        </div>
        <p className="text-xs text-teal-800">
          We practice data minimization and do not monetize or sell health inquiries.
        </p>
      </div>

      <h4 className="font-bold text-[#172554]">1. Information We Collect</h4>
      <p>
        In this hackathon demonstration prototype, only the text message you submit is processed by
        the server-side handler to synthesize informational responses and checklist items.
      </p>

      <h4 className="font-bold text-[#172554]">2. What We Do NOT Store</h4>
      <p>
        We do not require user accounts, email addresses, names, medical record numbers, or payment
        information. Messages are ephemeral and not retained in permanent patient registries.
      </p>

      <h4 className="font-bold text-[#172554]">3. Patient Best Practices</h4>
      <p>
        Because this is a demonstration environment, we advise users never to submit personally
        identifiable health information (PHI), real full names, Social Security numbers, or specific
        provider medical records.
      </p>

      <h4 className="font-bold text-[#172554]">4. Third-Party Disclosures</h4>
      <p>
        No user queries or interaction logs are shared with pharmaceutical companies, health
        insurers, or commercial advertising networks.
      </p>
    </BaseModal>
  );
}

export function TermsModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Terms of Use & Hackathon Demonstration Notice"
    >
      <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-950 space-y-1 mb-4">
        <div className="flex items-center gap-2 font-bold text-blue-900">
          <FileText className="w-4 h-4 text-blue-700" />
          <span>Educational & Demonstrative Use Only</span>
        </div>
        <p className="text-xs text-blue-800">
          By utilizing this website, you agree to its limitations as an educational demonstrator.
        </p>
      </div>

      <h4 className="font-bold text-[#172554]">1. Not Healthcare Advice</h4>
      <p>
        The content provided across MediSupport AI is for informational purposes only. It does not
        constitute formal medical advice, clinical diagnosis, or a doctor-patient relationship.
      </p>

      <h4 className="font-bold text-[#172554]">2. Assumption of Risk</h4>
      <p>
        Users assume full responsibility for how they choose to utilize generated question lists or
        terminology summaries. Always seek professional advice for any health conditions.
      </p>

      <h4 className="font-bold text-[#172554]">3. Hackathon Scope</h4>
      <p>
        This software is provided &quot;as is&quot; without warranties of any kind regarding clinical
        accuracy, uninterrupted uptime, or fitness for specific diagnostic objectives.
      </p>
    </BaseModal>
  );
}
