/**
 * @file termTranslator.ts
 * @description Educational plain-language translator for medical terms.
 *
 * Each term includes 3 reading levels:
 * - Simple (conversational, easy reading)
 * - Standard (general patient health education)
 * - Detailed (anatomical and clinical mechanics)
 * Plus a mandatory "What this does NOT tell you" limitation section.
 */

export interface TranslatedTerm {
  term: string;
  category: string;
  simple: string;
  standard: string;
  detailed: string;
  whatItDoesNotTellYou: string;
}

export const SAMPLE_TERMS: Record<string, TranslatedTerm> = {
  hypertension: {
    term: "Hypertension",
    category: "Cardiovascular",
    simple: "High blood pressure. It means the blood is pushing too hard against the inside of your blood vessels.",
    standard: "A chronic condition where the force of blood against your artery walls is consistently higher than normal (typically 130/80 mmHg or higher).",
    detailed: "Elevated systemic vascular resistance or increased cardiac output resulting in sustained systolic pressure ≥ 130 mmHg and/or diastolic pressure ≥ 80 mmHg.",
    whatItDoesNotTellYou: "It does NOT tell you whether an artery is blocked, what specific organ damage exists, or which medication is right for you. Only physical exams and lab tests determine your exact treatment plan.",
  },
  benign: {
    term: "Benign",
    category: "General Pathology",
    simple: "Not cancerous. It means a growth or bump will not spread to other parts of your body.",
    standard: "A non-cancerous condition or growth that remains localized, does not invade nearby tissues, and does not metastasize.",
    detailed: "A cellular proliferation that lacks the invasive, dysplastic, or metastatic characteristics of malignant neoplasms.",
    whatItDoesNotTellYou: "It does NOT mean the growth cannot cause discomfort, press on nearby nerves, or require surgical removal if it causes symptoms. Always discuss monitoring with your physician.",
  },
  edema: {
    term: "Edema",
    category: "Physical Findings",
    simple: "Swelling caused by too much fluid trapped inside your body's tissues, often in feet or ankles.",
    standard: "Abnormal accumulation of interstitial fluid in body tissues, frequently manifesting as swelling in the legs, hands, or abdomen.",
    detailed: "Fluid extravasation from the intravascular space into the interstitial compartment driven by altered hydrostatic pressure, oncotic pressure, or lymphatic obstruction.",
    whatItDoesNotTellYou: "It does NOT tell you why fluid is accumulating—it could be standing too long, sodium intake, medications, heart, kidney, or vein issues. Clinical testing is needed to identify the root cause.",
  },
  "acute vs chronic": {
    term: "Acute vs. Chronic",
    category: "Clinical Timing",
    simple: "Acute means it started quickly or recently (like a sprain). Chronic means it has lasted a long time (months or years).",
    standard: "Acute describes illnesses or symptoms that develop rapidly and usually resolve quickly. Chronic refers to conditions persisting for three months or longer.",
    detailed: "Acute signifies sudden onset and relatively brief duration with rapid clinical progression. Chronic denotes prolonged disease duration often characterized by gradual onset and persistent systemic management.",
    whatItDoesNotTellYou: "Acute does NOT automatically mean 'dangerous' and chronic does NOT mean 'untreatable'. It simply describes the timeline and persistence of the issue.",
  },
  biopsy: {
    term: "Biopsy",
    category: "Diagnostic Procedures",
    simple: "A procedure where a doctor takes a tiny sample of tissue so it can be looked at under a microscope.",
    standard: "The removal of a small sample of tissue or cells from the body for microscopic examination and pathological evaluation.",
    detailed: "A diagnostic sampling technique (e.g., punch, needle aspiration, incisional, or excisional) to allow histologic, cytologic, or immunohistochemical analysis.",
    whatItDoesNotTellYou: "Having a biopsy does NOT automatically mean you have cancer or a severe disease. It is a routine diagnostic tool used to clarify and confirm what cells look like.",
  },
};

export function lookupTerm(termQuery: string): TranslatedTerm | null {
  if (!termQuery) return null;
  const clean = termQuery.trim().toLowerCase();

  for (const key of Object.keys(SAMPLE_TERMS)) {
    if (clean.includes(key) || key.includes(clean)) {
      return SAMPLE_TERMS[key];
    }
  }

  return null;
}
