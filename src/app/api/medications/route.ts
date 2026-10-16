import { NextResponse } from "next/server";
import {
  getServerMedications,
  addServerMedication,
} from "@/lib/medicationStore";

export async function GET() {
  try {
    const list = getServerMedications();
    return NextResponse.json({
      success: true,
      count: list.length,
      disclaimer: "USER-ENTERED MEDICATION LOG: For organizational reference only. Does not verify dosages, interactions, or treatment safety.",
      medications: list,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Invalid request payload. Expected JSON object." },
        { status: 400 }
      );
    }

    const name = typeof body.name === "string" ? body.name.trim() : "";
    const instructions = typeof body.instructions === "string" ? body.instructions.trim() : "";
    const purpose = typeof body.purpose === "string" ? body.purpose.trim() : "";
    const startDate = typeof body.startDate === "string" && body.startDate.trim() ? body.startDate.trim() : new Date().toISOString().slice(0, 10);
    const reminders = typeof body.reminders === "string" ? body.reminders.trim() : undefined;
    const pharmacistQuestions = Array.isArray(body.pharmacistQuestions)
      ? body.pharmacistQuestions.filter((q: unknown): q is string => typeof q === "string")
      : [];
    const isActive = body.isActive !== undefined ? Boolean(body.isActive) : true;

    if (!name) {
      return NextResponse.json({ error: "Medication name is required." }, { status: 400 });
    }

    const entry = addServerMedication({
      name,
      instructions,
      purpose,
      startDate,
      reminders,
      pharmacistQuestions,
      isActive,
    });

    return NextResponse.json(
      {
        success: true,
        entry,
        message: "Medication recorded for patient organization.",
        disclaimer: "NON-CLINICAL NOTICE: Dosages and schedules are strictly self-reported. Consult a physician or pharmacist for medical advice.",
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
