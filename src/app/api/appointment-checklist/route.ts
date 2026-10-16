import { NextResponse } from "next/server";
import { generateFormattedVisitText, VisitPrepData, DEFAULT_VISIT_PREP_DATA } from "@/lib/visitSummary";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Invalid request payload. Expected JSON object." },
        { status: 400 }
      );
    }

    const data: VisitPrepData = {
      mainConcern: typeof body.mainConcern === "string" ? body.mainConcern.trim() : DEFAULT_VISIT_PREP_DATA.mainConcern,
      onset: typeof body.onset === "string" ? body.onset.trim() : DEFAULT_VISIT_PREP_DATA.onset,
      progression: typeof body.progression === "string" ? body.progression.trim() : DEFAULT_VISIT_PREP_DATA.progression,
      symptomRating: typeof body.symptomRating === "number" ? body.symptomRating : DEFAULT_VISIT_PREP_DATA.symptomRating,
      qualities: Array.isArray(body.qualities) ? body.qualities.filter((q: unknown): q is string => typeof q === "string") : DEFAULT_VISIT_PREP_DATA.qualities,
      triggers: typeof body.triggers === "string" ? body.triggers.trim() : DEFAULT_VISIT_PREP_DATA.triggers,
      triedSoFar: typeof body.triedSoFar === "string" ? body.triedSoFar.trim() : DEFAULT_VISIT_PREP_DATA.triedSoFar,
      currentMedications: typeof body.currentMedications === "string" ? body.currentMedications.trim() : DEFAULT_VISIT_PREP_DATA.currentMedications,
      allergies: typeof body.allergies === "string" ? body.allergies.trim() : DEFAULT_VISIT_PREP_DATA.allergies,
      questionsForClinician: Array.isArray(body.questionsForClinician) ? body.questionsForClinician.filter((q: unknown): q is string => typeof q === "string") : DEFAULT_VISIT_PREP_DATA.questionsForClinician,
      whatToBring: Array.isArray(body.whatToBring) ? body.whatToBring.filter((q: unknown): q is string => typeof q === "string") : DEFAULT_VISIT_PREP_DATA.whatToBring,
      isCaregiverMode: Boolean(body.isCaregiverMode),
      caregiverRelationship: typeof body.caregiverRelationship === "string" ? body.caregiverRelationship.trim() : undefined,
    };

    const printableText = generateFormattedVisitText(data);

    return NextResponse.json({
      success: true,
      data,
      printableText,
      checklistSummary: {
        concern: data.mainConcern,
        questionsCount: data.questionsForClinician.length,
        itemsToBringCount: data.whatToBring.length,
      },
      disclaimer: "NON-DIAGNOSTIC NOTICE: This checklist was generated from self-reported data to help you prepare for an appointment.",
      timestamp: new Date().toISOString(),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
