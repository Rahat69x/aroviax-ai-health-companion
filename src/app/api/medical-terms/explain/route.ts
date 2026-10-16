import { NextResponse } from "next/server";
import { lookupTerm, SAMPLE_TERMS } from "@/lib/termTranslator";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const term = body?.term;

    if (!term || typeof term !== "string" || term.trim().length === 0) {
      return NextResponse.json(
        { error: "A valid term string is required in the request body." },
        { status: 400 }
      );
    }

    const trimmed = term.trim();
    const found = lookupTerm(trimmed);

    if (found) {
      return NextResponse.json({
        success: true,
        term: found.term,
        foundInDatabase: true,
        category: found.category,
        explanations: {
          simple: found.simple,
          standard: found.standard,
          detailed: found.detailed,
        },
        whatItDoesNotTellYou: found.whatItDoesNotTellYou,
        sampleDoctorQuestions: [
          `How does ${found.term.toLowerCase()} specifically relate to my health circumstances?`,
          `Are any lifestyle adjustments or follow-up tests recommended?`,
        ],
        disclaimer: "NON-DIAGNOSTIC NOTICE: Medical terms are provided for educational literacy only and do not constitute clinical advice.",
        timestamp: new Date().toISOString(),
      });
    }

    // General fallback decomposition for unindexed medical terms
    return NextResponse.json({
      success: true,
      term: trimmed,
      foundInDatabase: false,
      category: "General Medical Literacy",
      explanations: {
        simple: `"${trimmed}" is a clinical or diagnostic term used by healthcare professionals.`,
        standard: `In medical practice, "${trimmed}" describes an anatomical, physiological, or diagnostic observation documented during clinical care.`,
        detailed: `Clinical terminology standardizes observations across pathology, pharmacology, and anatomy. Etymological components (roots, prefixes, suffixes) convey specific clinical meanings.`,
      },
      whatItDoesNotTellYou: `A medical term alone does NOT indicate your individual prognosis, severity, or required medication. Only your attending physician can contextualize this term within your full health history.`,
      sampleDoctorQuestions: [
        `Could you explain what "${trimmed}" means in my specific lab report or visit summary?`,
        `Does this observation require follow-up testing, treatment, or routine monitoring?`,
      ],
      availableTerms: Object.keys(SAMPLE_TERMS),
      disclaimer: "NON-DIAGNOSTIC NOTICE: Medical terms are provided for educational literacy only and do not constitute clinical advice.",
      timestamp: new Date().toISOString(),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
