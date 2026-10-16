/**
 * @file visitSummary.ts
 * @description Logic for formatting user-entered data into a printable Visit Summary.
 *
 * STRICT GOVERNANCE RULES:
 * 1. The summary displays ONLY what the user entered.
 * 2. It never calculates urgency, diagnoses conditions, or inserts medical interpretation.
 * 3. The 0-10 rating is explicitly labeled "User's own subjective rating".
 */

export interface VisitPrepData {
  mainConcern: string;
  onset: string;
  progression: string; // e.g. "Constant", "Getting worse", "Comes and goes", "Improving"
  symptomRating: number; // 0 to 10 subjective rating
  qualities: string[]; // e.g. ["Dull ache", "Sharp", "Throbbing", "Stiffness"]
  triggers: string; // Activities or factors affecting it
  triedSoFar: string; // Non-prescribed or lifestyle self-care attempts
  currentMedications: string; // User-entered list only
  allergies: string; // User-entered list only
  questionsForClinician: string[];
  whatToBring: string[];
  isCaregiverMode?: boolean;
  caregiverRelationship?: string;
}

export function generateFormattedVisitText(data: VisitPrepData): string {
  const parts: string[] = [];

  parts.push("====================================================");
  parts.push("         PATIENT VISIT APPOINTMENT SUMMARY          ");
  parts.push(" Prepared with MediSupport AI (Non-Clinical Helper) ");
  parts.push("====================================================");
  parts.push("");
  parts.push("NOTICE FOR CLINICIAN: This summary was created by the patient/caregiver to organize their thoughts. All entries are self-reported. No automated diagnosis or clinical scoring has been applied.");
  parts.push("");

  if (data.isCaregiverMode && data.caregiverRelationship) {
    parts.push(`[PREPARED BY CAREGIVER: ${data.caregiverRelationship}]`);
    parts.push("");
  }

  parts.push("1. PRIMARY CONCERN");
  parts.push(`   ${data.mainConcern || "None specified"}`);
  parts.push("");

  parts.push("2. TIMELINE & PATTERN");
  parts.push(`   Onset: ${data.onset || "Not specified"}`);
  parts.push(`   Pattern: ${data.progression || "Not specified"}`);
  parts.push(`   User Subjective Severity Rating: ${data.symptomRating}/10 (Patient's own rating)`);
  if (data.qualities && data.qualities.length > 0) {
    parts.push(`   Characteristics: ${data.qualities.join(", ")}`);
  }
  if (data.triggers) {
    parts.push(`   Triggers / Influencing Factors: ${data.triggers}`);
  }
  parts.push("");

  if (data.triedSoFar) {
    parts.push("3. WHAT HAS BEEN TRIED SO FAR");
    parts.push(`   ${data.triedSoFar}`);
    parts.push("");
  }

  if (data.currentMedications || data.allergies) {
    parts.push("4. MEDICATIONS & KNOWN ALLERGIES (Self-Reported)");
    if (data.currentMedications) {
      parts.push(`   Medications: ${data.currentMedications}`);
    }
    if (data.allergies) {
      parts.push(`   Allergies: ${data.allergies}`);
    }
    parts.push("");
  }

  if (data.questionsForClinician && data.questionsForClinician.length > 0) {
    parts.push("5. PRIORITY QUESTIONS FOR THE CLINICIAN");
    data.questionsForClinician.forEach((q, idx) => {
      parts.push(`   [ ] Q${idx + 1}: ${q}`);
    });
    parts.push("");
  }

  if (data.whatToBring && data.whatToBring.length > 0) {
    parts.push("6. WHAT TO BRING CHECKLIST");
    data.whatToBring.forEach((item) => {
      parts.push(`   [ ] ${item}`);
    });
    parts.push("");
  }

  parts.push("----------------------------------------------------");
  parts.push("REMINDER: Remove any sensitive personal identity details before sharing or printing.");

  return parts.join("\n");
}

export const DEFAULT_VISIT_PREP_DATA: VisitPrepData = {
  mainConcern: "",
  onset: "Past 3-5 days",
  progression: "Comes and goes",
  symptomRating: 4,
  qualities: ["Dull ache"],
  triggers: "Worse after staring at computer screens or poor sleep",
  triedSoFar: "Rest, drinking extra water, taking a walk",
  currentMedications: "Daily multivitamin",
  allergies: "None known",
  questionsForClinician: [
    "What do you think is causing these symptoms?",
    "Are there specific warning signs that mean I should call your office right away?",
    "Do you recommend any tests or changes to my daily routine?",
  ],
  whatToBring: [
    "Photo ID and Insurance Card",
    "List of current medications & dosages",
    "This written questions summary",
    "Notepad for clinician instructions",
  ],
  isCaregiverMode: false,
};

export const SAMPLE_FICTIONAL_VISIT_DATA: VisitPrepData = {
  mainConcern: "Intermittent tension headaches and neck stiffness over the past 3 weeks",
  onset: "Began approximately 3 weeks ago during intense desk work",
  progression: "Comes and goes, usually peaks late in the afternoon",
  symptomRating: 5,
  qualities: ["Band-like tightness", "Dull pressure across forehead", "Neck stiffness"],
  triggers: "Long sessions of computer screen work, bright fluorescent lighting, poor hydration",
  triedSoFar: "Gentle neck stretching, stepping away from monitor every hour, increased water intake",
  currentMedications: "Over-the-counter ibuprofen (200mg) occasionally, multivitamin",
  allergies: "Penicillin (causes mild rash)",
  questionsForClinician: [
    "Could this headache pattern be related to posture, eye strain, or work ergonomics?",
    "At what point would you recommend diagnostic imaging or seeing a physical therapist?",
    "What non-medication lifestyle adjustments should I implement first?",
  ],
  whatToBring: [
    "Photo ID and clinic appointment confirmation",
    "Bottle of current multivitamin to review",
    "Ergonomic workstation photo to show doctor",
  ],
  isCaregiverMode: false,
};
