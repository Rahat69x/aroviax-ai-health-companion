/**
 * @file i18n.ts
 * @description Internationalization (i18n) scaffolding for MediSupport AI supporting English & Bangla (বাংলা).
 *
 * CRITICAL CLINICAL GOVERNANCE NOTICE:
 * 1. Translations of health terms are educational and must NOT be treated as clinically equivalent
 *    to formal medical documentation.
 * 2. Medication names, dosages, laboratory measurements, and units (e.g. mg, mL, mmHg, mmol/L)
 *    must ALWAYS remain exact and unchanged across all languages.
 * 3. Fallback disclaimer must be prominently displayed when non-English text is active:
 *    "Translation may be imperfect. Review with a fluent speaker or healthcare professional."
 */

export type SupportedLanguage = "en" | "bn";

export interface I18nDictionary {
  appName: string;
  tagline: string;
  emergencyAlert: string;
  emergencyNotice: string;
  translationDisclaimer: string;
  switchLanguage: string;
  toolsMenu: string;
  nav: {
    home: string;
    howItWorks: string;
    features: string;
    tools: string;
    safety: string;
    faq: string;
    assistant: string;
  };
  tools: {
    symptomOrganizer: {
      title: string;
      desc: string;
    };
    visitPrep: {
      title: string;
      desc: string;
    };
    termExplainer: {
      title: string;
      desc: string;
    };
    documentExplainer: {
      title: string;
      desc: string;
    };
    healthNotes: {
      title: string;
      desc: string;
    };
    medicationOrganizer: {
      title: string;
      desc: string;
    };
    trustedSources: {
      title: string;
      desc: string;
    };
  };
  actions: {
    copyText: string;
    copied: string;
    print: string;
    save: string;
    reset: string;
    back: string;
    next: string;
    finish: string;
    clearAll: string;
    openInAssistant: string;
  };
  safetyDisclaimer: string;
}

export const DICTIONARIES: Record<SupportedLanguage, I18nDictionary> = {
  en: {
    appName: "MediSupport AI",
    tagline: "Plain-language health information and appointment preparation",
    emergencyAlert: "Emergency Warning",
    emergencyNotice:
      "If you may be experiencing a medical emergency, contact local emergency services immediately.",
    translationDisclaimer:
      "Translation may be imperfect. Review with a fluent speaker or healthcare professional.",
    switchLanguage: "Language",
    toolsMenu: "Health Tools",
    nav: {
      home: "Home",
      howItWorks: "How It Works",
      features: "Features",
      tools: "Health Tools",
      safety: "Safety",
      faq: "FAQ",
      assistant: "Try Assistant",
    },
    tools: {
      symptomOrganizer: {
        title: "Guided Symptom Organizer",
        desc: "Step-by-step flow to structure your symptoms into clear talking points before your visit.",
      },
      visitPrep: {
        title: "Doctor Visit Preparation",
        desc: "Generates tailored questions and an appointment checklist grouped by clinical topic.",
      },
      termExplainer: {
        title: "Medical Term Explainer",
        desc: "Plain-language explanations, what tests represent, abbreviations, and clinician questions.",
      },
      documentExplainer: {
        title: "Health Document Explainer",
        desc: "Helps translate clinical paperwork, lab sheets, and discharge summaries without inferring diagnoses.",
      },
      healthNotes: {
        title: "Personal Health Notes & Timeline",
        desc: "Dated notes and observations on a chronological timeline. Stored 100% on your device.",
      },
      medicationOrganizer: {
        title: "Medication Information Organizer",
        desc: "Log your medicines, label instructions, and questions for your pharmacist. Never recommends dose changes.",
      },
      trustedSources: {
        title: "Trusted Medical Sources",
        desc: "Source-grounded reference search using verified public-health repositories (MedlinePlus, CDC, WHO, NHS).",
      },
    },
    actions: {
      copyText: "Copy Text",
      copied: "Copied!",
      print: "Print / Save PDF",
      save: "Save Note",
      reset: "Start Over",
      back: "Back",
      next: "Next Step",
      finish: "Generate Summary",
      clearAll: "Clear All Data",
      openInAssistant: "Open Tool",
    },
    safetyDisclaimer:
      "MediSupport AI is an educational demonstration tool. It does not provide medical diagnoses, triage acute conditions, or formulate treatment plans.",
  },
  bn: {
    appName: "মেডিসাপোর্ট এআই",
    tagline: "সহজ ভাষায় স্বাস্থ্য তথ্য এবং চিকিৎসকের অ্যাপয়েন্টমেন্ট প্রস্তুতি",
    emergencyAlert: "জরুরি সতর্কবার্তা",
    emergencyNotice:
      "আপনি যদি কোনো জরুরি শারীরিক সমস্যার সম্মুখীন হন, তবে অবিলম্বে জরুরি সেবায় (৯৯৯ / ১৬২৬৩) যোগাযোগ করুন।",
    translationDisclaimer:
      "অনুবাদ সম্পূর্ণ নিখুঁত নাও হতে পারে — একজন অভিজ্ঞ ব্যক্তি বা চিকিৎসকের সাথে পরামর্শ করুন।",
    switchLanguage: "ভাষা",
    toolsMenu: "স্বাস্থ্য টুলস",
    nav: {
      home: "হোম",
      howItWorks: "কার্যপদ্ধতি",
      features: "বৈশিষ্ট্য",
      tools: "স্বাস্থ্য টুলস",
      safety: "নিরাপত্তা নীতি",
      faq: "প্রশ্নোত্তর",
      assistant: "অ্যাসিস্ট্যান্ট",
    },
    tools: {
      symptomOrganizer: {
        title: "লক্ষণ বিন্যাসকারী (Symptom Organizer)",
        desc: "চিকিৎসকের সাথে পরামর্শের আগে আপনার শারীরিক লক্ষণগুলো ধাপে ধাপে সুবিন্যস্ত করুন।",
      },
      visitPrep: {
        title: "ডাক্তার ভিজিট প্রস্তুতি (Visit Prep)",
        desc: "বিষয়ভিত্তিক প্রশ্নমালা এবং প্রিন্টযোগ্য অ্যাপয়েন্টমেন্ট চেকলিস্ট তৈরি করুন।",
      },
      termExplainer: {
        title: "মেডিকেল পরিভাষা সহজকারী (Term Explainer)",
        desc: "কঠিন মেডিকেল রিপোর্ট ও পরিভাষা সহজ বাংলায় বুঝে নিন।",
      },
      documentExplainer: {
        title: "প্রেসক্রিপশন ও রিপোর্ট বিশ্লষণকারী (Document Explainer)",
        desc: "ল্যাব টেস্ট বা রিপোর্টের জটিল লেখা বুঝতে সহায়তা করে। কোনো মনগড়া রোগ নির্ণয় করে না।",
      },
      healthNotes: {
        title: "ব্যক্তিগত স্বাস্থ্য নোট ও টাইমলাইন (Health Notes)",
        desc: "আপনার প্রতিদিনের শারীরিক পর্যবেক্ষণ সংরক্ষণ করুন। সম্পূর্ণ আপনার ডিভাইসে সংরক্ষিত।",
      },
      medicationOrganizer: {
        title: "ওষুধের তথ্য তালিকা (Medication Organizer)",
        desc: "আপনার প্রেসক্রিপশনের ওষুধের নাম ও নিয়ম লিখে রাখুন এবং ফার্মাসিস্টের প্রশ্ন সাজান।",
      },
      trustedSources: {
        title: "নির্ভরযোগ্য মেডিকেল তথ্যসূত্র (Trusted Sources)",
        desc: "যাচাইকৃত বিশ্ব স্বাস্থ্য সংস্থা (WHO), সিডিসি ও মেডলাইনপ্লাসের রেফারেন্স থেকে তথ্য জানুন।",
      },
    },
    actions: {
      copyText: "কপি করুন",
      copied: "কপি সম্পন্ন!",
      print: "প্রিন্ট / পিডিএফ সংরক্ষণ",
      save: "নোট সংরক্ষণ করুন",
      reset: "পুনরায় শুরু",
      back: "পেছনে",
      next: "পরবর্তী ধাপ",
      finish: "সারাংশ তৈরি করুন",
      clearAll: "সব তথ্য মুছুন",
      openInAssistant: "টুলটি খুলুন",
    },
    safetyDisclaimer:
      "মেডিসাপোর্ট এআই একটি শিক্ষামূলক সহায়তা ব্যবস্থা। এটি কোনো রোগ নির্ণয় করে না, ওষুধের মাত্রা নির্ধারণ করে না বা চিকিৎসকের বিকল্প নয়।",
  },
};

/**
 * Bangla Medical Terms Tested in this application.
 * Listed for clinical governance audit.
 */
export interface BanglaTestedTerm {
  englishTerm: string;
  banglaScript: string;
  phoneticPronunciation: string;
  testedMeaning: string;
  needsClinicianReview: boolean;
}

export const BANGLA_TESTED_TERMS: BanglaTestedTerm[] = [
  {
    englishTerm: "Hypertension",
    banglaScript: "উচ্চ রক্তচাপ (High Blood Pressure)",
    phoneticPronunciation: "Uchcho Roktochap",
    testedMeaning: "রক্তনালীর দেয়ালে রক্তের চাপ স্বাভাবিকের চেয়ে বেশি থাকা।",
    needsClinicianReview: false,
  },
  {
    englishTerm: "Hypotension",
    banglaScript: "নিম্ন রক্তচাপ (Low Blood Pressure)",
    phoneticPronunciation: "Nimno Roktochap",
    testedMeaning: "রক্তের চাপ স্বাভাবিক মাত্রার চেয়ে কমে যাওয়া।",
    needsClinicianReview: false,
  },
  {
    englishTerm: "Edema",
    banglaScript: "শোথ বা পানি জমা (Edema)",
    phoneticPronunciation: "Shoth / Pani Joma",
    testedMeaning: "শরীরের টিস্যুতে অতিরিক্ত তরল বা পানি জমে ফুলে যাওয়া।",
    needsClinicianReview: true, // Flagged: "Shoth" is traditional; needs colloquial review
  },
  {
    englishTerm: "Benign",
    banglaScript: "ক্ষতিহীন টিউমার বা নির্দোষ বৃদ্ধি (Benign)",
    phoneticPronunciation: "Khotihin / Nirdosh Briddhi",
    testedMeaning: "ক্যান্সার নয় এমন একটি বৃদ্ধি যা শরীরের অন্যান্য অঙ্গে ছড়ায় না।",
    needsClinicianReview: true, // Flagged: Clinical nuance vs malignant
  },
  {
    englishTerm: "Acute",
    banglaScript: "তীব্র বা হঠাৎ শুরু হওয়া (Acute)",
    phoneticPronunciation: "Tibro / Hothat shuru",
    testedMeaning: "হঠাৎ করে শুরু হওয়া এবং তীব্র লক্ষণযুক্ত অবস্থা।",
    needsClinicianReview: false,
  },
  {
    englishTerm: "Chronic",
    banglaScript: "দীর্ঘমেয়াদী বা পুরনো রোগ (Chronic)",
    phoneticPronunciation: "Dirghomeyadi Rog",
    testedMeaning: "যে শারীরিক সমস্যা দীর্ঘদিন (সাধারণত ৩ মাসের বেশি) ধরে স্থায়ী হয়।",
    needsClinicianReview: false,
  },
  {
    englishTerm: "Anemia",
    banglaScript: "রক্তাল্পতা বা রক্তশূন্যতা (Anemia)",
    phoneticPronunciation: "Roktoshyunnota",
    testedMeaning: "রক্তে হিমোগ্লোবিন বা লোহিত রক্তকণিকার ঘাটতি।",
    needsClinicianReview: false,
  },
  {
    englishTerm: "Arrhythmia",
    banglaScript: "অস্বাভাবিক হৃদস্পন্দন (Arrhythmia)",
    phoneticPronunciation: "Oshavabik Hridshpondon",
    testedMeaning: "হৃদপিণ্ডের স্পন্দনের গতি বা ছন্দে অনিয়ম দেখা দেওয়া।",
    needsClinicianReview: true, // Flagged: Needs review for palpitations vs arrhythmia distinction
  },
];
