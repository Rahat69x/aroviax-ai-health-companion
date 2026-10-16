import { NextResponse } from "next/server";
import {
  getServerHealthNotes,
  updateServerHealthNote,
  deleteServerHealthNote,
} from "@/lib/healthNotesStore";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const note = getServerHealthNotes().find((n) => n.id === id);

    if (!note) {
      return NextResponse.json({ error: "Health note not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, note });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Invalid request payload. Expected JSON object." },
        { status: 400 }
      );
    }

    const updates: Record<string, unknown> = {};
    if (typeof body.title === "string") updates.title = body.title.trim();
    if (typeof body.body === "string") updates.body = body.body.trim();
    if (typeof body.date === "string") updates.date = body.date.trim();
    if (Array.isArray(body.tags)) {
      updates.tags = body.tags.filter((t: unknown): t is string => typeof t === "string");
    }

    const updated = updateServerHealthNote(id, updates);
    if (!updated) {
      return NextResponse.json({ error: "Health note not found." }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      note: updated,
      message: "Health note updated successfully.",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const deleted = deleteServerHealthNote(id);

    if (!deleted) {
      return NextResponse.json({ error: "Health note not found." }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Health note deleted successfully.",
      deletedId: id,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
