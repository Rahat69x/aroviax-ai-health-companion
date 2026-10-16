import { NextResponse } from "next/server";
import { searchTrustedSources } from "@/lib/trustedSources";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";
    const topic = searchParams.get("topic");
    const lang = searchParams.get("lang");

    const result = searchTrustedSources(query);
    let sources = result.sources;

    if (topic) {
      const topLower = topic.toLowerCase();
      sources = sources.filter((s) =>
        s.topics.some((t) => t.toLowerCase().includes(topLower))
      );
    }

    if (lang && (lang === "en" || lang === "bn" || lang === "both")) {
      sources = sources.filter((s) => s.language === lang || s.language === "both");
    }

    return NextResponse.json({
      success: true,
      query,
      count: sources.length,
      sources,
      disclaimer: result.disclaimer,
      timestamp: new Date().toISOString(),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
