"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { WhatItDoesSection } from "@/components/WhatItDoesSection";
import { HowItWorks } from "@/components/HowItWorks";
import { HealthToolsSection } from "@/components/HealthToolsSection";
import { ToolsShowcase } from "@/components/ToolsShowcase";
import { FeaturesSection } from "@/components/FeaturesSection";
import { InteractiveDemoSection } from "@/components/InteractiveDemoSection";
import { SafetySection } from "@/components/SafetySection";
import { FAQAccordion } from "@/components/FAQAccordion";
import { CallToAction } from "@/components/CallToAction";
import { Footer } from "@/components/Footer";
import { SafetyModal, PrivacyModal, TermsModal } from "@/components/Modals";

export default function HomePage() {
  const [safetyModalOpen, setSafetyModalOpen] = useState(false);
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);
  const [termsModalOpen, setTermsModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#334155]">
      {/* Accessible skip link for keyboard & screen reader navigation */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-50 px-4 py-2 bg-[#0D817C] text-white rounded-lg shadow-lg font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0D817C]"
      >
        Skip to main content
      </a>

      {/* Section 1: Navigation */}
      <Navbar onOpenSafetyModal={() => setSafetyModalOpen(true)} />

      {/* Main Content Sections */}
      <main id="main-content" className="flex-1">
        {/* Section 2: Hero */}
        <HeroSection />

        {/* Section 3: What the Assistant Does */}
        <WhatItDoesSection />

        {/* Section 4: How It Works */}
        <HowItWorks />

        {/* Section 5: Health Tools Grid */}
        <HealthToolsSection />

        {/* Section 6: Tools showcase */}
        <ToolsShowcase />

        {/* Section 7: Feature Highlights */}
        <FeaturesSection />

        {/* Section 7: Interactive Demo & Chat Preview Area */}
        <InteractiveDemoSection />

        {/* Section 8: Safety and Limitations */}
        <SafetySection onOpenSafetyModal={() => setSafetyModalOpen(true)} />

        {/* Section 9: FAQ */}
        <FAQAccordion />

        {/* Section 10: Final Call to Action */}
        <CallToAction onOpenSafetyModal={() => setSafetyModalOpen(true)} />
      </main>

      {/* Section 10: Footer */}
      <Footer
        onOpenSafetyModal={() => setSafetyModalOpen(true)}
        onOpenPrivacyModal={() => setPrivacyModalOpen(true)}
        onOpenTermsModal={() => setTermsModalOpen(true)}
      />

      {/* Accessible Modals */}
      <SafetyModal
        isOpen={safetyModalOpen}
        onClose={() => setSafetyModalOpen(false)}
      />
      <PrivacyModal
        isOpen={privacyModalOpen}
        onClose={() => setPrivacyModalOpen(false)}
      />
      <TermsModal
        isOpen={termsModalOpen}
        onClose={() => setTermsModalOpen(false)}
      />
    </div>
  );
}
