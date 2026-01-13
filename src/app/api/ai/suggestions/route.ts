import { NextRequest, NextResponse } from "next/server";
import { generateSuggestions } from "@/lib/openai";
import type { ContentType } from "@/lib/utils";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { content, type } = body as {
      content: string;
      type: ContentType;
    };

    if (!content || content.length < 20) {
      return NextResponse.json({ suggestions: [] });
    }

    const suggestions = await generateSuggestions({
      currentText: content,
      contentType: type || "blog",
    });
    
    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error("Suggestions API error:", error);
    return NextResponse.json({ suggestions: [] });
  }
}

