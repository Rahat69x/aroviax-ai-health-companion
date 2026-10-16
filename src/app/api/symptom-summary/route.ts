import { NextResponse } from "next/server";
import { checkSafetySignal } from "@/lib/safetySignals";
import {
  generateSymptomSummaryText,
  SymptomOrganizerData,
  DEFAULT_ORGANIZER_DATA,
} from "@/lib/symptomOrganizer";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Invalid request payload. Expected JSON object." },
        { status: 400 }
      );
    }

    const data: SymptomOrganizerData = {
      mainConcern: typeof body.mainConcern === "string" ? body.mainConcern.trim() : DEFAULT_ORGANIZER_DATA.mainConcern,
      onsetDate: typeof body.onsetDate === "string" ? body.onsetDate.trim() : (typeof body.onset === "string" ? body.onset.trim() : DEFAULT_ORGANIZER_DATA.onsetDate),
      durationDescription: typeof body.durationDescription === "string" ? body.durationDescription.trim() : (typeof body.duration === "string" ? body.duration.trim() : DEFAULT_ORGANIZER_DATA.durationDescription),
      severityRating: typeof body.severityRating === "number" ? body.severityRating : DEFAULT_ORGANIZER_DATA.severityRating,
      qualities: Array.isArray(body.qualities) ? body.qualities.filter((q: unknown): q is string => typeof q === "string") : DEFAULT_ORGANIZER_DATA.qualities,
      location: typeof body.location === "string" ? body.location.trim() : DEFAULT_ORGANIZER_DATA.location,
      associatedSymptoms: typeof body.associatedSymptoms === "string" ? body.associatedSymptoms.trim() : DEFAULT_ORGANIZER_DATA.associatedSymptoms,
      triggers: typeof body.triggers === "string" ? body.triggers.trim() : DEFAULT_ORGANIZER_DATA.triggers,
      relievingFactors: typeof body.relievingFactors === "string" ? body.relievingFactors.trim() : DEFAULT_ORGANIZER_DATA.relievingFactors,
      relevantContext: typeof body.relevantContext === "string" ? body.relevantContext.trim() : DEFAULT_ORGANIZER_DATA.relevantContext,
      questionsForDoctor: Array.isArray(body.questionsForDoctor) ? body.questionsForDoctor.filter((q: unknown): q is string => typeof q === "string") : DEFAULT_ORGANIZER_DATA.questionsForDoctor,
    };

    if (!data.mainConcern) {
      return NextResponse.json(
        { error: "Main concern cannot be empty." },
        { status: 400 }
      );
    }

    const safetySignal = checkSafetySignal(data.mainConcern);
    const summaryText = generateSymptomSummaryText(data);

    return NextResponse.json({
      success: true,
      data,
      summaryText,
      safetySignal,
      disclaimer: "NON-DIAGNOSTIC NOTICE: This summary is organized from user input to assist communication with a licensed healthcare provider.",
      timestamp: new Date().toISOString(),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
