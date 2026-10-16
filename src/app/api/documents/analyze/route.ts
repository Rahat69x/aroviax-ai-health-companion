import { NextResponse } from "next/server";
import { inspectPrivacy, redactIdentifiers } from "@/lib/privacyInspector";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const rawText = body?.text;

    if (!rawText || typeof rawText !== "string" || rawText.trim().length === 0) {
      return NextResponse.json(
        { error: "A document 'text' string is required in the request body." },
        { status: 400 }
      );
    }

    if (rawText.length > 50000) {
      return NextResponse.json(
        { error: "Document text exceeds maximum allowed size of 50,000 characters." },
        { status: 400 }
      );
    }

    // 1. Detect & redact PII/PHI
    const privacyReport = inspectPrivacy(rawText);
    const sanitizedText = redactIdentifiers(rawText);

    // 2. Keyword & concept extraction
    const lower = sanitizedText.toLowerCase();
    const questions: string[] = [
      "What does this document mean for my overall health plan?",
      "Are there any findings or values here that warrant clinical follow-up?",
    ];

    const detectedConcepts: string[] = [];

    if (lower.includes("glucose") || lower.includes("hba1c") || lower.includes("insulin")) {
      detectedConcepts.push("Blood Sugar / Diabetes Markers");
      questions.push("What do these blood sugar readings mean for my dietary or management plan?");
    }
    if (lower.includes("blood pressure") || lower.includes("hypertension") || lower.includes("mmhg")) {
      detectedConcepts.push("Cardiovascular / Blood Pressure");
      questions.push("Are my blood pressure readings within the target range for my age and profile?");
    }
    if (lower.includes("cholesterol") || lower.includes("ldl") || lower.includes("hdl") || lower.includes("triglycerides")) {
      detectedConcepts.push("Lipid Panel");
      questions.push("What do my cholesterol levels indicate about my cardiovascular health?");
    }
    if (lower.includes("creatinine") || lower.includes("kidney") || lower.includes("egfr") || lower.includes("bun")) {
      detectedConcepts.push("Renal / Kidney Function");
      questions.push("What do these kidney function metrics indicate, and do I need to re-test?");
    }
    if (lower.includes("hemoglobin") || lower.includes("rbc") || lower.includes("anemia") || lower.includes("hematocrit")) {
      detectedConcepts.push("Complete Blood Count (CBC)");
      questions.push("Could these red blood cell readings indicate anemia or fatigue causes?");
    }
    if (lower.includes("thyroid") || lower.includes("tsh") || lower.includes("t3") || lower.includes("t4")) {
      detectedConcepts.push("Thyroid Function Panel");
      questions.push("What do my thyroid hormone results suggest regarding my energy or metabolism?");
    }

    return NextResponse.json({
      success: true,
      sanitizedText,
      privacySummary: {
        piiDetected: privacyReport.hasIdentifiers,
        redactedCount: privacyReport.identifiers.length,
        typesFound: Array.from(new Set(privacyReport.identifiers.map(i => i.type))),
      },
      detectedConcepts,
      suggestedQuestions: questions.slice(0, 5),
      ambiguityNotice: "Lab values and medical shorthand depend heavily on laboratory reference ranges, personal medical history, age, and clinical context. A numerical value alone never provides a definitive diagnosis.",
      disclaimer: "NON-DIAGNOSTIC NOTICE: Document analysis is provided for educational clarification and appointment preparation only.",
      timestamp: new Date().toISOString(),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
