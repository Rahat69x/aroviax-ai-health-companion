"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { SupportedLanguage, DICTIONARIES, I18nDictionary } from "@/lib/i18n";

export type TextSize = "normal" | "large" | "extra-large";

interface AccessibilityState {
  textSize: TextSize;
  highContrast: boolean;
  dyslexiaFont: boolean;
  reducedMotion: boolean;
  simpleLanguage: boolean;
  language: SupportedLanguage;
  dictionary: I18nDictionary;
  optInPersistence: boolean;
  isSpeaking: boolean;
  hasSpeechSupport: boolean;
  setTextSize: (size: TextSize) => void;
  setHighContrast: (enabled: boolean) => void;
  setDyslexiaFont: (enabled: boolean) => void;
  setReducedMotion: (enabled: boolean) => void;
  setSimpleLanguage: (enabled: boolean) => void;
  setLanguage: (lang: SupportedLanguage) => void;
  setOptInPersistence: (enabled: boolean) => void;
  speakText: (text: string) => void;
  stopSpeaking: () => void;
  resetAccessibility: () => void;
}

const AccessibilityContext = createContext<AccessibilityState | undefined>(undefined);

const PREFS_STORAGE_KEY = "aroviax_accessibility_prefs";

interface StoredPrefs {
  optInPersistence?: boolean;
  textSize?: TextSize;
  highContrast?: boolean;
  dyslexiaFont?: boolean;
  reducedMotion?: boolean;
  simpleLanguage?: boolean;
  language?: SupportedLanguage;
}

function getInitialPrefs(): StoredPrefs | null {
  if (typeof window === "undefined") return null;
  try {
    const saved = localStorage.getItem(PREFS_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.optInPersistence) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn("Could not read accessibility settings:", e);
  }
  return null;
}

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [initialPrefs] = useState<StoredPrefs | null>(getInitialPrefs);

  const [textSize, setTextSizeState] = useState<TextSize>(() => initialPrefs?.textSize || "normal");
  const [highContrast, setHighContrastState] = useState(() => Boolean(initialPrefs?.highContrast));
  const [dyslexiaFont, setDyslexiaFontState] = useState(() => Boolean(initialPrefs?.dyslexiaFont));
  const [reducedMotion, setReducedMotionState] = useState(() => {
    if (typeof initialPrefs?.reducedMotion === "boolean") return initialPrefs.reducedMotion;
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return true;
    }
    return false;
  });
  const [simpleLanguage, setSimpleLanguageState] = useState(() => Boolean(initialPrefs?.simpleLanguage));
  const [language, setLanguageState] = useState<SupportedLanguage>(() => initialPrefs?.language || "en");
  const [optInPersistence, setOptInPersistenceState] = useState(() => Boolean(initialPrefs?.optInPersistence));
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [hasSpeechSupport] = useState(() => typeof window !== "undefined" && "speechSynthesis" in window);

  // Sync to document classes for text-size, themes, and language
  useEffect(() => {
    if (typeof document !== "undefined") {
      const root = document.documentElement;

      // Language attribute
      root.lang = language;

      // Text size classes
      root.classList.remove("text-size-normal", "text-size-large", "text-size-xl");
      if (textSize === "large") root.classList.add("text-size-large");
      else if (textSize === "extra-large") root.classList.add("text-size-xl");
      else root.classList.add("text-size-normal");

      // High contrast
      if (highContrast) root.classList.add("high-contrast");
      else root.classList.remove("high-contrast");

      // Dyslexia font
      if (dyslexiaFont) root.classList.add("font-dyslexia");
      else root.classList.remove("font-dyslexia");

      // Reduced motion
      if (reducedMotion) root.classList.add("reduce-motion");
      else root.classList.remove("reduce-motion");
    }
  }, [textSize, highContrast, dyslexiaFont, reducedMotion, language]);

  // Persist if opted-in
  const persistIfAllowed = (updates: Partial<StoredPrefs>) => {
    if (typeof window !== "undefined" && optInPersistence) {
      try {
        const current: StoredPrefs = {
          textSize,
          highContrast,
          dyslexiaFont,
          reducedMotion,
          simpleLanguage,
          language,
          optInPersistence,
          ...updates,
        };
        localStorage.setItem(PREFS_STORAGE_KEY, JSON.stringify(current));
      } catch (e) {
        console.warn("Could not persist accessibility settings:", e);
      }
    }
  };

  const setTextSize = (size: TextSize) => {
    setTextSizeState(size);
    persistIfAllowed({ textSize: size });
  };

  const setHighContrast = (enabled: boolean) => {
    setHighContrastState(enabled);
    persistIfAllowed({ highContrast: enabled });
  };

  const setDyslexiaFont = (enabled: boolean) => {
    setDyslexiaFontState(enabled);
    persistIfAllowed({ dyslexiaFont: enabled });
  };

  const setReducedMotion = (enabled: boolean) => {
    setReducedMotionState(enabled);
    persistIfAllowed({ reducedMotion: enabled });
  };

  const setSimpleLanguage = (enabled: boolean) => {
    setSimpleLanguageState(enabled);
    persistIfAllowed({ simpleLanguage: enabled });
  };

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    persistIfAllowed({ language: lang });
  };

  const setOptInPersistence = (enabled: boolean) => {
    setOptInPersistenceState(enabled);
    if (!enabled && typeof window !== "undefined") {
      localStorage.removeItem(PREFS_STORAGE_KEY);
    } else {
      persistIfAllowed({ optInPersistence: enabled });
    }
  };

  const speakText = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      alert("Speech synthesis is not supported on this browser.");
      return;
    }

    window.speechSynthesis.cancel();
    if (!text) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === "bn" ? "bn-BD" : "en-US";
    utterance.rate = 0.95; // comfortable reading pace
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const resetAccessibility = () => {
    setTextSizeState("normal");
    setHighContrastState(false);
    setDyslexiaFontState(false);
    setReducedMotionState(false);
    setSimpleLanguageState(false);
    setLanguageState("en");
    setOptInPersistenceState(false);
    if (typeof window !== "undefined") {
      localStorage.removeItem(PREFS_STORAGE_KEY);
    }
  };

  const dictionary = DICTIONARIES[language] || DICTIONARIES.en;

  return (
    <AccessibilityContext.Provider
      value={{
        textSize,
        highContrast,
        dyslexiaFont,
        reducedMotion,
        simpleLanguage,
        language,
        dictionary,
        optInPersistence,
        isSpeaking,
        hasSpeechSupport,
        setTextSize,
        setHighContrast,
        setDyslexiaFont,
        setReducedMotion,
        setSimpleLanguage,
        setLanguage,
        setOptInPersistence,
        speakText,
        stopSpeaking,
        resetAccessibility,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error("useAccessibility must be used within an AccessibilityProvider");
  }
  return context;
}
