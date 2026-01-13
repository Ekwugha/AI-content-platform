import { NextRequest, NextResponse } from "next/server";
import { getCollection, Collections, ContentDocument, ObjectId } from "@/lib/mongodb";

export const runtime = "nodejs";

// GET - Fetch all content or filter by query params
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const status = searchParams.get("status");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    const collection = await getCollection<ContentDocument>(Collections.CONTENT);
    
    // Build query
    const query: Record<string, unknown> = {};
    if (type) query.type = type;
    if (status) query.status = status;

    const [items, total] = await Promise.all([
      collection
        .find(query)
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(limit)
        .toArray(),
      collection.countDocuments(query),
    ]);

    return NextResponse.json({
      items: items.map((item) => ({
        id: item._id?.toString(),
        ...item,
        _id: undefined,
      })),
      total,
      limit,
      offset,
    });
  } catch (error) {
    console.error("Content GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch content" },
      { status: 500 }
    );
  }
}

// POST - Create new content
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const collection = await getCollection<ContentDocument>(Collections.CONTENT);
    
    const contentDoc: Omit<ContentDocument, "_id"> = {
      title: body.title,
      slug: body.slug || body.title.toLowerCase().replace(/\s+/g, "-"),
      content: body.content,
      type: body.type,
      status: body.status || "draft",
      authorId: new ObjectId(), // In production, get from auth session
      metadata: {
        keywords: body.metadata?.keywords || [],
        seoTitle: body.metadata?.seoTitle,
        seoDescription: body.metadata?.seoDescription,
        readabilityScore: body.metadata?.readabilityScore,
        wordCount: body.metadata?.wordCount || 0,
        readingTime: body.metadata?.readingTime || 0,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      aiGenerated: body.aiGenerated || false,
      aiPrompt: body.aiPrompt,
    };

    const result = await collection.insertOne(contentDoc as ContentDocument);
    
    return NextResponse.json({
      id: result.insertedId.toString(),
      ...contentDoc,
    });
  } catch (error) {
    console.error("Content POST error:", error);
    return NextResponse.json(
      { error: "Failed to create content" },
      { status: 500 }
    );
  }
}

