import { NextRequest, NextResponse } from "next/server";
import { generateContent, GenerateContentParams } from "@/lib/openai";

export const runtime = "nodejs";
export const maxDuration = 60; // Allow up to 60 seconds for AI generation

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const params: GenerateContentParams = {
      type: body.type || "blog",
      topic: body.topic,
      tone: body.tone || "professional",
      keywords: body.keywords || [],
      targetAudience: body.targetAudience,
      length: body.length || "medium",
      includeNigerianContext: body.includeNigerianContext ?? true,
      additionalInstructions: body.additionalInstructions,
    };

    if (!params.topic) {
      return NextResponse.json(
        { error: "Topic is required" },
        { status: 400 }
      );
    }

    const result = await generateContent(params);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error("AI Generation API error:", error);
    
    // Check if it's an OpenAI API error
    if (error instanceof Error) {
      if (error.message.includes("API key")) {
        return NextResponse.json(
          { error: "AI service is not configured. Please add your OpenAI API key." },
          { status: 503 }
        );
      }
      
      if (error.message.includes("rate limit")) {
        return NextResponse.json(
          { error: "Rate limit exceeded. Please try again later." },
          { status: 429 }
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to generate content. Please try again." },
      { status: 500 }
    );
  }
}

