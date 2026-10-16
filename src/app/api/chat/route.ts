import { NextResponse } from "next/server";
import { ChatMode } from "@/types/chat";
import { generateAiChatResponse } from "@/lib/aiProvider";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const message = body?.message;
    const mode: ChatMode = body?.mode || "chat";

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return NextResponse.json(
        { error: "A non-empty message string is required." },
        { status: 400 }
      );
    }

    const trimmed = message.trim();
    if (trimmed.length > 2000) {
      return NextResponse.json(
        { error: "Message exceeds maximum allowed length of 2000 characters." },
        { status: 400 }
      );
    }

    const response = await generateAiChatResponse(trimmed, mode);
    return NextResponse.json(response);
  } catch (error) {
    console.error("Chat API route error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while processing your request. Please try again." },
      { status: 500 }
    );
  }
}
