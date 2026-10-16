/**
 * @file trustedSources.ts
 * Curated list of verified public-health information sources.
 * Never invents citations. Only links to real, publicly accessible pages.
 */

export interface TrustedSource {
  id: string;
  name: string;
  organization: string;
  url: string;
  description: string;
  topics: string[];
  language: "en" | "bn" | "both";
  lastVerified: string;
}

export interface SourceSearchResult {
  sources: TrustedSource[];
  query: string;
  disclaimer: string;
}

export const TRUSTED_SOURCE_LIST: TrustedSource[] = [
  {
    id: "medlineplus",
    name: "MedlinePlus Health Topics",
    organization: "U.S. National Library of Medicine (NLM)",
    url: "https://medlineplus.gov/healthtopics.html",
    description: "Authoritative, plain-language health information from the U.S. National Library of Medicine covering hundreds of conditions, drugs, and wellness topics.",
    topics: ["general health", "conditions", "drugs", "symptoms", "wellness", "lab tests"],
    language: "en",
    lastVerified: "2026-10-01",
  },
  {
    id: "cdc_health",
    name: "CDC Health A–Z",
    organization: "U.S. Centers for Disease Control and Prevention (CDC)",
    url: "https://www.cdc.gov/az/index.html",
    description: "Public health guidance on diseases, vaccines, health behaviors, and prevention from the U.S. CDC.",
    topics: ["disease prevention", "vaccines", "public health", "infections", "chronic conditions"],
    language: "en",
    lastVerified: "2026-10-01",
  },
  {
    id: "who_health",
    name: "WHO Health Topics",
    organization: "World Health Organization (WHO)",
    url: "https://www.who.int/health-topics",
    description: "International health guidance from the WHO covering global diseases, nutrition, mental health, and health systems.",
    topics: ["global health", "nutrition", "mental health", "infections", "chronic disease"],
    language: "en",
    lastVerified: "2026-10-01",
  },
  {
    id: "nhs_conditions",
    name: "NHS Health A to Z",
    organization: "National Health Service (NHS), United Kingdom",
    url: "https://www.nhs.uk/conditions/",
    description: "Clinically reviewed information about symptoms, conditions, and treatments from the UK National Health Service.",
    topics: ["symptoms", "conditions", "treatment", "mental health", "surgery"],
    language: "en",
    lastVerified: "2026-10-01",
  },
  {
    id: "dghs_bangladesh",
    name: "DGHS Health Information",
    organization: "Directorate General of Health Services, Bangladesh",
    url: "https://dghs.gov.bd",
    description: "Official health information, disease alerts, and public health guidance from Bangladesh's Directorate General of Health Services.",
    topics: ["Bangladesh", "public health", "disease alerts", "health services", "maternal health"],
    language: "both",
    lastVerified: "2026-10-01",
  },
  {
    id: "nimh_mental",
    name: "NIMH — Mental Health Information",
    organization: "National Institute of Mental Health (NIMH)",
    url: "https://www.nimh.nih.gov/health/topics",
    description: "Science-based information on mental health disorders, treatments, and research from the U.S. National Institute of Mental Health.",
    topics: ["mental health", "anxiety", "depression", "sleep", "stress", "PTSD"],
    language: "en",
    lastVerified: "2026-10-01",
  },
  {
    id: "nih_medlineplus_drugs",
    name: "MedlinePlus Drug Information",
    organization: "U.S. National Library of Medicine (NLM)",
    url: "https://medlineplus.gov/druginformation.html",
    description: "Medication descriptions, side effects, and usage information from the U.S. National Library of Medicine. Does not replace pharmacist or physician guidance.",
    topics: ["medications", "drugs", "side effects", "pharmacology", "prescriptions"],
    language: "en",
    lastVerified: "2026-10-01",
  },
  {
    id: "mayo_symptoms",
    name: "Mayo Clinic — Symptoms",
    organization: "Mayo Clinic",
    url: "https://www.mayoclinic.org/symptoms",
    description: "Clinician-reviewed symptom descriptions and when-to-see-a-doctor guidance from Mayo Clinic.",
    topics: ["symptoms", "conditions", "when to see a doctor", "first aid"],
    language: "en",
    lastVerified: "2026-10-01",
  },
];

export function searchTrustedSources(query: string): SourceSearchResult {
  const disclaimer = "These are links to publicly available health education resources. They are not personalized medical advice. Review findings with your healthcare provider.";

  if (!query.trim()) {
    return { sources: TRUSTED_SOURCE_LIST, query, disclaimer };
  }

  const q = query.toLowerCase();
  const matched = TRUSTED_SOURCE_LIST.filter(s =>
    s.name.toLowerCase().includes(q) ||
    s.organization.toLowerCase().includes(q) ||
    s.description.toLowerCase().includes(q) ||
    s.topics.some(t => t.toLowerCase().includes(q))
  );

  return {
    sources: matched.length > 0 ? matched : TRUSTED_SOURCE_LIST,
    query,
    disclaimer,
  };
}
