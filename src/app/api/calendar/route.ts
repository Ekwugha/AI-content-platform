import { NextRequest, NextResponse } from "next/server";
import { getCollection, Collections, CalendarEventDocument, ObjectId, isMongoConfigured } from "@/lib/mongodb";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET - Fetch calendar events
export async function GET(request: NextRequest) {
  if (!isMongoConfigured()) {
    return NextResponse.json({
      events: [],
      message: "Using mock data - Database not configured",
    });
  }

  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("start");
    const endDate = searchParams.get("end");

    const collection = await getCollection<CalendarEventDocument>(Collections.CALENDAR);
    
    // Build query
    const query: Record<string, unknown> = {};
    
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const events = await collection
      .find(query)
      .sort({ date: 1 })
      .toArray();

    return NextResponse.json({
      events: events.map((event) => ({
        id: event._id?.toString(),
        title: event.title,
        date: event.date.toISOString().split("T")[0],
        type: event.type,
        status: event.status,
        contentId: event.contentId?.toString(),
      })),
    });
  } catch (error) {
    console.error("Calendar GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch calendar events" },
      { status: 500 }
    );
  }
}

// POST - Create calendar event
export async function POST(request: NextRequest) {
  if (!isMongoConfigured()) {
    const body = await request.json();
    return NextResponse.json({
      id: "mock-" + Date.now(),
      ...body,
      message: "Mock save - Database not configured",
    });
  }

  try {
    const body = await request.json();
    
    const collection = await getCollection<CalendarEventDocument>(Collections.CALENDAR);
    
    const eventDoc: Omit<CalendarEventDocument, "_id"> = {
      title: body.title,
      date: new Date(body.date),
      type: body.type,
      status: body.status || "pending",
      contentId: body.contentId ? new ObjectId(body.contentId) : undefined,
      teamId: body.teamId ? new ObjectId(body.teamId) : undefined,
      authorId: new ObjectId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collection.insertOne(eventDoc as CalendarEventDocument);
    
    return NextResponse.json({
      id: result.insertedId.toString(),
      ...eventDoc,
      date: eventDoc.date.toISOString().split("T")[0],
    });
  } catch (error) {
    console.error("Calendar POST error:", error);
    return NextResponse.json(
      { error: "Failed to create calendar event" },
      { status: 500 }
    );
  }
}

// PATCH - Update calendar event
export async function PATCH(request: NextRequest) {
  if (!isMongoConfigured()) {
    return NextResponse.json({ success: true, message: "Mock update - Database not configured" });
  }

  try {
    const body = await request.json();
    
    if (!body.id) {
      return NextResponse.json(
        { error: "Event ID is required" },
        { status: 400 }
      );
    }

    const collection = await getCollection<CalendarEventDocument>(Collections.CALENDAR);
    
    const updateData: Partial<CalendarEventDocument> = {
      updatedAt: new Date(),
    };

    if (body.title !== undefined) updateData.title = body.title;
    if (body.date !== undefined) updateData.date = new Date(body.date);
    if (body.type !== undefined) updateData.type = body.type;
    if (body.status !== undefined) updateData.status = body.status;

    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(body.id) },
      { $set: updateData },
      { returnDocument: "after" }
    );

    if (!result) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: result._id?.toString(),
      title: result.title,
      date: result.date.toISOString().split("T")[0],
      type: result.type,
      status: result.status,
    });
  } catch (error) {
    console.error("Calendar PATCH error:", error);
    return NextResponse.json(
      { error: "Failed to update calendar event" },
      { status: 500 }
    );
  }
}

// DELETE - Delete calendar event
export async function DELETE(request: NextRequest) {
  if (!isMongoConfigured()) {
    return NextResponse.json({ success: true, message: "Mock delete - Database not configured" });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Event ID is required" },
        { status: 400 }
      );
    }

    const collection = await getCollection<CalendarEventDocument>(Collections.CALENDAR);
    
    const result = await collection.deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Calendar DELETE error:", error);
    return NextResponse.json(
      { error: "Failed to delete calendar event" },
      { status: 500 }
    );
  }
}
