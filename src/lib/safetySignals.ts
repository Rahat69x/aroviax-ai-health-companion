/**
 * @file safetySignals.ts
 * @description Deterministic rule-based emergency signal detector for Aroviax.
 *
 * CLINICAL GOVERNANCE NOTICE:
 * This module is a conservative, rule-based software heuristic designed for hackathon demonstration.
 * It MUST be reviewed, calibrated, and formally approved by a licensed clinical advisory committee
 * prior to any real-world clinical deployment.
 *
 * CRITICAL SAFETY RULES:
 * 1. It only escalates; it NEVER reassures ("No notice does not mean a situation is safe").
 * 2. Keyword detection and LLMs cannot reliably catch every emergency or subtle atypical presentation.
 * 3. Never calculates risk scores, probabilities, or medical diagnoses.
 * 4. Dual-language support: English and Bangla (বাংলা).
 */

export interface VerifiedEmergencyContact {
  region: string;
  countryCode: string;
  emergencyNumber: string;
  healthHelpline?: string;
  description: string;
  source: string;
}

/**
 * Real, verified emergency numbers by region.
 * Never invent telephone numbers; only use officially published emergency contacts.
 */
export const VERIFIED_EMERGENCY_CONTACTS: VerifiedEmergencyContact[] = [
  {
    region: "Bangladesh (বাংলাদেশ)",
    countryCode: "BD",
    emergencyNumber: "999",
    healthHelpline: "16263 (Shastho Batayen - স্বাস্থ্য বাতায়ন)",
    description: "National emergency service (Police, Ambulance, Fire) and official DGHS 24/7 health helpline.",
    source: "Government of Bangladesh / Directorate General of Health Services (DGHS)",
  },
  {
    region: "United States",
    countryCode: "US",
    emergencyNumber: "911",
    healthHelpline: "988 (Suicide & Crisis Lifeline)",
    description: "National emergency medical, fire, and police dispatch.",
    source: "Federal Communications Commission (FCC)",
  },
  {
    region: "United Kingdom",
    countryCode: "GB",
    emergencyNumber: "999",
    healthHelpline: "111 (NHS Non-Emergency Urgent Care)",
    description: "UK Emergency Services dispatch and NHS 111 urgent health advice.",
    source: "National Health Service (NHS)",
  },
  {
    region: "European Union / International",
    countryCode: "EU",
    emergencyNumber: "112",
    description: "Single European emergency number accessible free of charge throughout the EU.",
    source: "European Commission Emergency Services Directive",
  },
];

export interface SafetySignalResult {
  hasEmergencySignal: boolean;
  detectedPhrases: string[];
  detectedLanguage: "en" | "bn" | "none";
  escalationNotice: string | null;
  guidanceSteps: string[];
  recommendedContacts: VerifiedEmergencyContact[];
}

/**
 * English high-acuity warning phrases that mandate immediate emergency medical escalation.
 */
export const EMERGENCY_PHRASE_LIST: string[] = [
  "chest pain",
  "pressure in chest",
  "crushing chest",
  "chest tightness",
  "pain radiating to left arm",
  "pain radiating to jaw",
  "shortness of breath",
  "can't breathe",
  "cannot breathe",
  "trouble breathing",
  "gasping for air",
  "sudden numbness",
  "facial drooping",
  "slurred speech",
  "face drooping",
  "arm weakness",
  "stroke",
  "heart attack",
  "thunderclap headache",
  "worst headache of my life",
  "sudden severe headache",
  "coughing up blood",
  "vomiting blood",
  "uncontrolled bleeding",
  "uncontrollable bleeding",
  "lost consciousness",
  "passed out",
  "unresponsive",
  "fainted and hit head",
  "overdose",
  "suicide",
  "suicidal",
  "want to end my life",
  "hurt myself",
  "throat swelling",
  "tongue swelling",
  "anaphylaxis",
  "allergic reaction cant breathe",
  "severe burn",
  "baby high fever unresponsive",
];

/**
 * Bangla (বাংলা) high-acuity warning phrases that mandate immediate emergency medical escalation.
 * NOTE: Needs review by a licensed bilingual clinician before clinical deployment.
 */
export const BANGLA_EMERGENCY_PHRASE_LIST: string[] = [
  "বুকে তীব্র ব্যথা",
  "বুকে ব্যথা",
  "বুকে চাপ",
  "বুকের ভিতর চাপ",
  "শ্বাস নিতে কষ্ট",
  "শ্বাসকষ্ট",
  "দম বন্ধ হয়ে আসছে",
  "দম আটকে আসছে",
  "কথা জড়িয়ে যাচ্ছে",
  "মুখ বেঁকে গেছে",
  "হাত অবশ",
  "পা অবশ",
  "স্ট্রোক",
  "হার্ট অ্যাটাক",
  "মাথায় তীব্র যন্ত্রণা",
  "অসহ্য মাথাব্যথা",
  "রক্তবমি",
  "অতিরিক্ত রক্তপাত",
  "রক্তক্ষরণ থামছে না",
  "অজ্ঞান হয়ে গেছে",
  "বেহুঁশ হয়ে গেছে",
  "আত্মহত্যা",
  "আত্মহত্যার চিন্তা",
  "নিজেকে শেষ করে দিতে চাই",
  "গলা ফুলে গেছে",
  "এলার্জির কারণে শ্বাস বন্ধ",
  "বিষ খেয়েছে",
];

/**
 * Evaluates user input against both English and Bangla emergency phrase lists.
 * Operates purely on-device with zero network transmission.
 */
export function checkSafetySignal(
  inputText: string,
  preferredCountry: string = "BD"
): SafetySignalResult {
  if (!inputText || typeof inputText !== "string") {
    return {
      hasEmergencySignal: false,
      detectedPhrases: [],
      detectedLanguage: "none",
      escalationNotice: null,
      guidanceSteps: [],
      recommendedContacts: VERIFIED_EMERGENCY_CONTACTS,
    };
  }

  const normalized = inputText.toLowerCase();
  const detectedPhrases: string[] = [];
  let detectedLanguage: "en" | "bn" | "none" = "none";

  // Check English phrases
  for (const phrase of EMERGENCY_PHRASE_LIST) {
    if (normalized.includes(phrase)) {
      detectedPhrases.push(phrase);
      if (detectedLanguage === "none") detectedLanguage = "en";
    }
  }

  // Check Bangla phrases
  for (const phrase of BANGLA_EMERGENCY_PHRASE_LIST) {
    if (inputText.includes(phrase)) {
      detectedPhrases.push(phrase);
      detectedLanguage = "bn";
    }
  }

  // Filter contacts by preferred country, default to BD & US on top
  const matchedContact =
    VERIFIED_EMERGENCY_CONTACTS.find((c) => c.countryCode.toLowerCase() === preferredCountry.toLowerCase()) ||
    VERIFIED_EMERGENCY_CONTACTS[0];

  if (detectedPhrases.length > 0) {
    const isBangla = detectedLanguage === "bn";

    const escalationNotice = isBangla
      ? `জরুরি সতর্কবার্তা: আপনার উল্লেখিত লক্ষণগুলো উচ্চ-ঝুঁকিপূর্ণ বা জরুরি চিকিৎসার সংকেত হতে পারে। এআই সফটওয়্যার কখনোই জরুরি অবস্থার মূল্যায়ন বা চিকিৎসা দিতে পারে না। অবিলম্বে স্থানীয় জরুরি সেবা (${matchedContact.emergencyNumber}) অথবা নিকটস্থ হাসপাতালে যোগাযোগ করুন।`
      : `EMERGENCY WARNING: Potential high-urgency symptoms detected. AI conversational software cannot triage or evaluate acute medical emergencies. Please contact local emergency services (${matchedContact.emergencyNumber}) or seek immediate emergency hospital care.`;

    const guidanceSteps = isBangla
      ? [
          `অবিলম্বে স্থানীয় জরুরি নাম্বারে কল করুন (যেমন বাংলাদেশে ${matchedContact.emergencyNumber} বা স্বাস্থ্য বাতায়ন ১৬২৬৩)।`,
          "বুকে তীব্র ব্যথা, শ্বাসকষ্ট বা প্যারালাইসিসের লক্ষণে নিজে গাড়ি চালিয়ে হাসপাতালে যাবেন না।",
          "একা থাকলে আশপাশের কাউকে বা প্রতিবেশীকে দ্রুত অবগত করুন এবং সদর দরজা খুলে রাখুন।",
          "চিকিৎসক বা অ্যাম্বুলেন্স আসার আগে কোনো অননুমোদিত ওষুধ গ্রহণ করবেন না।",
        ]
      : [
          `Call emergency services immediately (such as ${matchedContact.emergencyNumber} or your local emergency dispatch).`,
          "Do not drive yourself to the hospital if experiencing acute chest discomfort, shortness of breath, or sudden weakness.",
          "If you are alone, inform a neighbor or unlock your door while awaiting emergency responders.",
          "Have a caregiver or companion note the exact minute symptoms began to inform emergency medical personnel.",
        ];

    return {
      hasEmergencySignal: true,
      detectedPhrases,
      detectedLanguage,
      escalationNotice,
      guidanceSteps,
      recommendedContacts: VERIFIED_EMERGENCY_CONTACTS,
    };
  }

  return {
    hasEmergencySignal: false,
    detectedPhrases: [],
    detectedLanguage: "none",
    escalationNotice: null,
    guidanceSteps: [],
    recommendedContacts: VERIFIED_EMERGENCY_CONTACTS,
  };
}
