import { NextRequest, NextResponse } from "next/server";
import { getCollection, Collections, ContentDocument, ObjectId } from "@/lib/mongodb";

export const runtime = "nodejs";

// GET - Fetch single content by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const collection = await getCollection<ContentDocument>(Collections.CONTENT);
    
    const item = await collection.findOne({
      _id: new ObjectId(params.id),
    });

    if (!item) {
      return NextResponse.json(
        { error: "Content not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: item._id?.toString(),
      ...item,
      _id: undefined,
    });
  } catch (error) {
    console.error("Content GET by ID error:", error);
    return NextResponse.json(
      { error: "Failed to fetch content" },
      { status: 500 }
    );
  }
}

// PATCH - Update content
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const collection = await getCollection<ContentDocument>(Collections.CONTENT);
    
    const updateData: Partial<ContentDocument> = {
      updatedAt: new Date(),
    };

    // Only update provided fields
    if (body.title !== undefined) updateData.title = body.title;
    if (body.content !== undefined) updateData.content = body.content;
    if (body.status !== undefined) updateData.status = body.status;
    if (body.scheduledAt !== undefined) updateData.scheduledAt = new Date(body.scheduledAt);
    if (body.metadata !== undefined) {
      updateData.metadata = {
        keywords: body.metadata.keywords,
        seoTitle: body.metadata.seoTitle,
        seoDescription: body.metadata.seoDescription,
        readabilityScore: body.metadata.readabilityScore,
        wordCount: body.metadata.wordCount,
        readingTime: body.metadata.readingTime,
      };
    }

    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(params.id) },
      { $set: updateData },
      { returnDocument: "after" }
    );

    if (!result) {
      return NextResponse.json(
        { error: "Content not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: result._id?.toString(),
      ...result,
      _id: undefined,
    });
  } catch (error) {
    console.error("Content PATCH error:", error);
    return NextResponse.json(
      { error: "Failed to update content" },
      { status: 500 }
    );
  }
}

// DELETE - Delete content
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const collection = await getCollection<ContentDocument>(Collections.CONTENT);
    
    const result = await collection.deleteOne({
      _id: new ObjectId(params.id),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Content not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Content DELETE error:", error);
    return NextResponse.json(
      { error: "Failed to delete content" },
      { status: 500 }
    );
  }
}

