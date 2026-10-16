import { NextResponse } from "next/server";
import {
  getServerHealthNotes,
  addServerHealthNote,
} from "@/lib/healthNotesStore";
import { searchHealthNotes } from "@/lib/healthNotes";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";
    const tag = searchParams.get("tag");

    let notes = getServerHealthNotes();

    if (query) {
      notes = searchHealthNotes(notes, query);
    }

    if (tag) {
      notes = notes.filter((n) =>
        n.tags.some((t) => t.toLowerCase() === tag.toLowerCase())
      );
    }

    return NextResponse.json({
      success: true,
      count: notes.length,
      notes,
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

    const title = typeof body.title === "string" ? body.title.trim() : "";
    const noteBody = typeof body.body === "string" ? body.body.trim() : "";
    const date = typeof body.date === "string" && body.date.trim() ? body.date.trim() : new Date().toISOString().slice(0, 10);
    const tags = Array.isArray(body.tags) ? body.tags.filter((t: unknown): t is string => typeof t === "string") : [];

    if (!title) {
      return NextResponse.json({ error: "Title is required." }, { status: 400 });
    }
    if (!noteBody) {
      return NextResponse.json({ error: "Note body is required." }, { status: 400 });
    }

    const created = addServerHealthNote({
      title,
      body: noteBody,
      date,
      tags,
    });

    return NextResponse.json(
      {
        success: true,
        note: created,
        message: "Health note created successfully.",
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
