import { NextRequest, NextResponse } from "next/server";
import { improveContent } from "@/lib/openai";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { content, instruction } = body as {
      content: string;
      instruction: string;
    };

    if (!content || !instruction) {
      return NextResponse.json(
        { error: "Content and instruction are required" },
        { status: 400 }
      );
    }

    const improvedContent = await improveContent(content, instruction);
    
    return NextResponse.json({ content: improvedContent });
  } catch (error) {
    console.error("Improve API error:", error);
    return NextResponse.json(
      { error: "Failed to improve content" },
      { status: 500 }
    );
  }
}

