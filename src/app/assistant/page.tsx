"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Stethoscope,
  MessageSquare,
  ClipboardCheck,
  BookOpen,
  FileText,
  LineChart,
  Lock,
  HeartHandshake,
  ArrowLeft,
  Eye,
  Trash2,
  ShieldAlert,
  Info,
  Pill,
  StickyNote,
  Globe,
  Activity,
  LucideIcon,
} from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { AssistantChatTab } from "@/components/assistant/AssistantChatTab";
import { VisitPrepKit } from "@/components/assistant/VisitPrepKit";
import { TermTranslator } from "@/components/assistant/TermTranslator";
import { AfterVisitNotes } from "@/components/assistant/AfterVisitNotes";
import { SymptomJournal } from "@/components/assistant/SymptomJournal";
import { MedicationOrganizer } from "@/components/assistant/MedicationOrganizer";
import { PersonalHealthNotes } from "@/components/assistant/PersonalHealthNotes";
import { TrustedSourcesFinder } from "@/components/assistant/TrustedSourcesFinder";
import { GuidedSymptomOrganizer } from "@/components/assistant/GuidedSymptomOrganizer";
import { DocumentExplainer } from "@/components/assistant/DocumentExplainer";
import { DisplayControlsModal } from "@/components/DisplayControlsModal";
import { clearAllLocalData } from "@/lib/privacyInspector";
import { useAccessibility } from "@/context/AccessibilityContext";

export type AssistantTab =
  | "chat"
  | "symptom-organizer"
  | "prepkit"
  | "translator"
  | "document"
  | "notes"
  | "medication"
  | "sources"
  | "aftervisit"
  | "journal";

const ALL_TABS: { id: AssistantTab; label: string; icon: LucideIcon; badge: "Live" | "On your device" | "Demo" }[] = [
  { id: "chat", label: "AI Chat", icon: MessageSquare, badge: "Live" },
  { id: "symptom-organizer", label: "Symptom Organizer", icon: Activity, badge: "On your device" },
  { id: "prepkit", label: "Visit Prep Kit", icon: ClipboardCheck, badge: "On your device" },
  { id: "translator", label: "Term Explainer", icon: BookOpen, badge: "Live" },
  { id: "document", label: "Document Explainer", icon: FileText, badge: "Demo" },
  { id: "notes", label: "Health Notes", icon: StickyNote, badge: "On your device" },
  { id: "medication", label: "Medications", icon: Pill, badge: "On your device" },
  { id: "sources", label: "Trusted Sources", icon: Globe, badge: "Demo" },
  { id: "aftervisit", label: "After-Visit Notes", icon: FileText, badge: "Live" },
  { id: "journal", label: "Symptom Journal", icon: LineChart, badge: "On your device" },
];

export default function AssistantPage() {
  const [activeTab, setActiveTab] = useState<AssistantTab>(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("tab") as AssistantTab;
      if (tabParam && ALL_TABS.some(t => t.id === tabParam)) return tabParam;
    }
    return "chat";
  });
  const [isCaregiverMode, setIsCaregiverMode] = useState(false);
  const [localOnlyMode, setLocalOnlyMode] = useState(false);
  const [isDisplayModalOpen, setIsDisplayModalOpen] = useState(false);
  const { language, setLanguage, dictionary } = useAccessibility();

  const tabs = ALL_TABS.map(t =>
    t.id === "chat" ? { ...t, badge: (localOnlyMode ? "On your device" : "Live") as "Live" | "On your device" | "Demo" } : t
  );

  const handleClearData = () => {
    if (confirm("Reset all session data and clear local storage?")) {
      clearAllLocalData();
      alert("Local data cleared.");
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#334155] flex flex-col">
      {/* Emergency Notice */}
      <div role="region" aria-label="Emergency warning"
        className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-xs text-amber-900 flex items-center">
        <div className="max-w-7xl mx-auto flex items-center gap-2 font-medium">
          <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
          <span>
            <strong>Non-Emergency Workspace:</strong> If facing sudden or acute symptoms, call local emergency services immediately.
          </span>
        </div>
      </div>

      {/* Workspace Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-[#E2E8F0] shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Brand + Back */}
            <div className="flex items-center gap-3">
              <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#64748B] hover:text-[#0D817C] transition-colors p-1">
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Home</span>
              </Link>
              <div className="h-5 w-px bg-[#E2E8F0] hidden sm:block" />
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#0D817C] text-white flex items-center justify-center">
                  <Stethoscope className="w-4 h-4" />
                </div>
                <span className="font-bold text-base text-[#172554] tracking-tight">
                  Aroviax
                  <span className="text-xs text-[#64748B] font-normal hidden md:inline ml-2">— AI Health Companion</span>
                </span>
              </div>
            </div>

            {/* Right controls */}
            <div className="flex items-center gap-2">
              {/* Caregiver Mode */}
              <button type="button" onClick={() => setIsCaregiverMode(!isCaregiverMode)}
                className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${isCaregiverMode ? "bg-[#E8F6F4] text-[#0D817C] border-[#0D817C]/30" : "bg-white text-[#64748B] border-[#E2E8F0] hover:bg-[#F8FAFC]"}`}
                title="Toggle caregiver mode">
                <HeartHandshake className="w-3.5 h-3.5 text-[#0D817C]" />
                <span>{isCaregiverMode ? "Caregiver: ON" : "Caregiver"}</span>
              </button>

              {/* Local-Only */}
              <button type="button" onClick={() => setLocalOnlyMode(!localOnlyMode)}
                className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${localOnlyMode ? "bg-[#E8F6F4] text-[#0D817C] border-[#0D817C]/30" : "bg-white text-[#64748B] border-[#E2E8F0] hover:bg-[#F8FAFC]"}`}
                title="Disable network requests">
                <Lock className="w-3.5 h-3.5 text-[#0D817C]" />
                <span>{localOnlyMode ? "Local: ON" : "Local Mode"}</span>
              </button>

              {/* Language selector */}
              <div className="flex items-center rounded-xl border border-[#E2E8F0] bg-white p-0.5 text-xs font-semibold">
                <button type="button" onClick={() => setLanguage("en")}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${language === "en" ? "bg-[#0D817C] text-white" : "text-[#64748B] hover:text-[#334155]"}`}>
                  EN
                </button>
                <button type="button" onClick={() => setLanguage("bn")}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${language === "bn" ? "bg-[#0D817C] text-white" : "text-[#64748B] hover:text-[#334155]"}`}
                  title="বাংলা">
                  BN
                </button>
              </div>

              {/* Display Controls */}
              <button type="button" onClick={() => setIsDisplayModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-[#64748B] bg-white hover:bg-[#E8F6F4] border border-[#E2E8F0] transition-colors"
                title="Display & Accessibility Suite">
                <Eye className="w-3.5 h-3.5 text-[#0D817C]" />
                <span className="hidden md:inline">Display</span>
              </button>

              {/* Clear Data */}
              <button type="button" onClick={handleClearData}
                className="p-2 text-[#64748B] hover:text-red-600 transition-colors rounded-lg"
                title="Clear all stored data" aria-label="Clear all data">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-1 overflow-x-auto py-2 border-t border-[#E2E8F0] no-scrollbar" role="tablist" aria-label="Health tools">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button key={tab.id} type="button" role="tab" aria-selected={isActive}
                  onClick={() => setActiveTab(tab.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${isActive ? "bg-[#0D817C] text-white shadow-xs" : "text-[#64748B] hover:bg-[#E8F6F4] hover:text-[#0D817C]"}`}>
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <StatusBadge status={tab.badge} className={isActive ? "!bg-[#086B67] !text-white !border-[#086B67]" : ""} />
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Banners */}
      {language === "bn" && (
        <div className="bg-[#E8F6F4] border-b border-[#0D817C]/20 px-4 py-2 text-xs text-[#0D817C]">
          <div className="max-w-7xl mx-auto flex items-center gap-2 font-medium">
            <Info className="w-4 h-4 shrink-0" />
            <span><strong>ভাষা নোটিশ:</strong> {dictionary.translationDisclaimer}</span>
          </div>
        </div>
      )}
      {isCaregiverMode && (
        <div className="bg-[#E8F6F4] border-b border-[#0D817C]/20 px-4 py-2 text-xs text-[#0D817C]">
          <div className="max-w-7xl mx-auto flex items-center gap-2 font-medium">
            <HeartHandshake className="w-4 h-4 shrink-0" />
            <span><strong>Caregiver Mode Active:</strong> You are preparing information on behalf of someone else. Always respect their consent and autonomy.</span>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8" role="tabpanel">
        {activeTab === "chat" && <AssistantChatTab localOnlyMode={localOnlyMode} onToggleLocalOnly={setLocalOnlyMode} isCaregiverMode={isCaregiverMode} />}
        {activeTab === "symptom-organizer" && <GuidedSymptomOrganizer />}
        {activeTab === "prepkit" && <VisitPrepKit isCaregiverMode={isCaregiverMode} />}
        {activeTab === "translator" && <TermTranslator />}
        {activeTab === "document" && <DocumentExplainer />}
        {activeTab === "notes" && <PersonalHealthNotes />}
        {activeTab === "medication" && <MedicationOrganizer />}
        {activeTab === "sources" && <TrustedSourcesFinder />}
        {activeTab === "aftervisit" && <AfterVisitNotes />}
        {activeTab === "journal" && <SymptomJournal />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-[#E2E8F0] py-5 text-xs text-[#64748B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span>Aroviax Workspace</span>
            <span>&bull;</span>
            <Link href="/safety" className="hover:text-[#0D817C] underline">Safety</Link>
            <span>&bull;</span>
            <Link href="/privacy" className="hover:text-[#0D817C] underline">Privacy</Link>
            <span>&bull;</span>
            <Link href="/terms" className="hover:text-[#0D817C] underline">Terms</Link>
          </div>
          <div className="text-center sm:text-right">Non-diagnostic hackathon demonstrator. Human medical care comes first.</div>
        </div>
      </footer>

      <DisplayControlsModal isOpen={isDisplayModalOpen} onClose={() => setIsDisplayModalOpen(false)} />
    </div>
  );
}
