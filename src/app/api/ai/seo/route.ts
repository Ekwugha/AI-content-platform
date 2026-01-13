import { NextRequest, NextResponse } from "next/server";
import { generateSEOMetadata } from "@/lib/openai";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { content, title } = body as {
      content: string;
      title: string;
    };

    if (!content || !title) {
      return NextResponse.json(
        { error: "Content and title are required" },
        { status: 400 }
      );
    }

    const metadata = await generateSEOMetadata(content, title);
    
    return NextResponse.json(metadata);
  } catch (error) {
    console.error("SEO API error:", error);
    return NextResponse.json(
      { error: "Failed to generate SEO metadata" },
      { status: 500 }
    );
  }
}

