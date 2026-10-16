"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldAlert,
  Menu,
  X,
  Sparkles,
  Stethoscope,
  ArrowRight,
  Info,
  SlidersHorizontal,
} from "lucide-react";
import { DisplayControlsModal } from "./DisplayControlsModal";
import { useAccessibility } from "@/context/AccessibilityContext";

interface NavbarProps {
  onOpenSafetyModal: () => void;
}

export function Navbar({ onOpenSafetyModal }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showEmergencyBanner, setShowEmergencyBanner] = useState(true);
  const [displayModalOpen, setDisplayModalOpen] = useState(false);
  const { language, setLanguage, dictionary } = useAccessibility();

  const navLinks = [
    { name: dictionary.nav.home, href: "/#hero" },
    { name: dictionary.nav.features, href: "/#features" },
    { name: dictionary.nav.howItWorks, href: "/#how-it-works" },
    { name: dictionary.nav.tools, href: "/#health-tools" },
    { name: dictionary.nav.safety, href: "/safety" },
    { name: dictionary.nav.faq, href: "/#faq" },
  ];

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white border-b border-[#E2E8F0] shadow-xs">
        {/* Top Accessible Emergency Warning Banner */}
        {showEmergencyBanner && (
          <div
            role="region"
            aria-label="Emergency disclaimer"
            className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-xs md:text-sm text-amber-900 flex items-center justify-between"
          >
            <div className="max-w-7xl mx-auto flex items-center gap-2 font-medium">
              <ShieldAlert className="w-4 h-4 text-[#B45309] shrink-0" aria-hidden="true" />
              <span>
                <strong>{dictionary.emergencyAlert}:</strong> {dictionary.emergencyNotice}
              </span>
            </div>
            <button
              onClick={() => setShowEmergencyBanner(false)}
              aria-label="Dismiss emergency banner"
              className="p-1 text-amber-700 hover:text-amber-900 rounded focus-visible:ring-2 focus-visible:ring-[#0D817C] ml-2"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Translation disclaimer banner when BN is active */}
        {language === "bn" && (
          <div className="bg-[#E8F6F4] border-b border-[#0D817C]/20 px-4 py-1.5 text-xs text-[#0D817C] text-center font-medium">
            <span><strong>ভাষা নোটিশ:</strong> {dictionary.translationDisclaimer}</span>
          </div>
        )}

        {/* Main Navbar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo & Brand */}
            <Link
              href="/"
              className="flex items-center gap-3 group focus-visible:ring-2 focus-visible:ring-[#0D817C] rounded-lg p-1"
            >
              <div className="w-10 h-10 rounded-xl bg-[#0D817C] flex items-center justify-center text-white shadow-sm group-hover:bg-[#086B67] transition-colors">
                <Stethoscope className="w-5 h-5" aria-hidden="true" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xl tracking-tight text-[#172554]">
                    MediSupport<span className="text-[#0D817C]"> AI</span>
                  </span>
                  <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#E8F6F4] text-[#0D817C] border border-[#0D817C]/20">
                    <Sparkles className="w-3 h-3 text-[#0D817C]" />
                    Hackathon Concept
                  </span>
                </div>
                <span className="text-xs text-[#64748B] hidden md:inline">
                  {dictionary.tagline}
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav
              aria-label="Main Navigation"
              className="hidden lg:flex items-center gap-1 xl:gap-2"
            >
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="px-3 py-2 text-sm font-medium text-[#334155] hover:text-[#0D817C] hover:bg-[#E8F6F4] rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-[#0D817C]"
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Right Action Controls: Language Toggle + Display + Try Assistant */}
            <div className="hidden sm:flex items-center gap-2.5">
              {/* Language Selector */}
              <div className="flex items-center rounded-xl border border-[#E2E8F0] bg-white p-0.5 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setLanguage("en")}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${
                    language === "en"
                      ? "bg-[#0D817C] text-white"
                      : "text-[#64748B] hover:text-[#334155]"
                  }`}
                  aria-label="Switch to English"
                >
                  EN
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage("bn")}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${
                    language === "bn"
                      ? "bg-[#0D817C] text-white"
                      : "text-[#64748B] hover:text-[#334155]"
                  }`}
                  title="বাংলা ভাষায় পরিবর্তন করুন"
                  aria-label="Switch to Bangla"
                >
                  বাংলা
                </button>
              </div>

              {/* Compact Display Control (A11y & Contrast) */}
              <button
                type="button"
                onClick={() => setDisplayModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#334155] bg-[#F8FAFC] hover:bg-[#E8F6F4] border border-[#E2E8F0] transition-colors focus-visible:ring-2 focus-visible:ring-[#0D817C]"
                title="Open Display & Accessibility Controls"
                aria-label="Display and accessibility settings"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#0D817C]" />
                <span>Display</span>
              </button>

              <Link
                href="/assistant"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm text-white bg-[#0D817C] hover:bg-[#086B67] active:scale-[0.98] shadow-sm transition-all focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#0D817C]"
              >
                <span>{dictionary.nav.assistant}</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>

            {/* Mobile Controls */}
            <div className="flex lg:hidden items-center gap-1.5">
              {/* Mobile Language Switcher */}
              <div className="flex items-center rounded-lg border border-[#E2E8F0] bg-white p-0.5 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setLanguage("en")}
                  className={`px-2 py-0.5 rounded text-[11px] ${
                    language === "en" ? "bg-[#0D817C] text-white" : "text-[#64748B]"
                  }`}
                >
                  EN
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage("bn")}
                  className={`px-2 py-0.5 rounded text-[11px] ${
                    language === "bn" ? "bg-[#0D817C] text-white" : "text-[#64748B]"
                  }`}
                >
                  বাং
                </button>
              </div>

              <button
                type="button"
                onClick={() => setDisplayModalOpen(true)}
                className="p-2 rounded-lg text-[#334155] hover:text-[#0D817C] hover:bg-[#E8F6F4] border border-[#E2E8F0]"
                aria-label="Display settings"
              >
                <SlidersHorizontal className="w-4 h-4 text-[#0D817C]" />
              </button>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-[#334155] hover:text-[#0D817C] hover:bg-[#E8F6F4] focus-visible:ring-2 focus-visible:ring-[#0D817C]"
                aria-controls="mobile-menu"
                aria-expanded={mobileMenuOpen}
                aria-label={mobileMenuOpen ? "Close menu" : "Open main menu"}
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" aria-hidden="true" />
                ) : (
                  <Menu className="w-6 h-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div
            id="mobile-menu"
            className="lg:hidden border-t border-[#E2E8F0] bg-white px-4 pt-3 pb-6 shadow-xl animate-in slide-in-from-top duration-200"
          >
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={handleLinkClick}
                  className="px-3 py-2.5 rounded-lg text-base font-medium text-[#334155] hover:text-[#0D817C] hover:bg-[#E8F6F4] transition-colors"
                >
                  {link.name}
                </Link>
              ))}

              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setDisplayModalOpen(true);
                }}
                className="px-3 py-2.5 rounded-lg text-base font-medium text-[#334155] hover:bg-[#E8F6F4] text-left flex items-center gap-2"
              >
                <SlidersHorizontal className="w-4 h-4 text-[#0D817C]" />
                Display & Accessibility Options
              </button>

              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenSafetyModal();
                }}
                className="px-3 py-2.5 rounded-lg text-base font-medium text-[#B45309] hover:bg-amber-50 text-left flex items-center gap-2"
              >
                <Info className="w-4 h-4 text-[#B45309]" />
                Read Safety Guidelines Modal
              </button>

              <div className="pt-2 border-t border-[#E2E8F0]">
                <Link
                  href="/assistant"
                  onClick={handleLinkClick}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-center font-semibold text-white bg-[#0D817C] hover:bg-[#086B67] shadow-sm"
                >
                  {dictionary.nav.assistant}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Accessible Display Controls Modal */}
      <DisplayControlsModal
        isOpen={displayModalOpen}
        onClose={() => setDisplayModalOpen(false)}
      />
    </>
  );
}
