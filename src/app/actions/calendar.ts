"use server";

import { revalidatePath } from "next/cache";
import { getCollection, Collections, CalendarEventDocument, ObjectId, isMongoConfigured } from "@/lib/mongodb";

export interface CreateCalendarEventInput {
  title: string;
  date: string;
  type: "publish" | "review" | "meeting" | "deadline";
  contentId?: string;
}

export async function createCalendarEvent(input: CreateCalendarEventInput) {
  if (!isMongoConfigured()) {
    console.log("📅 Mock: Creating calendar event -", input.title);
    return {
      success: true,
      id: "mock-" + Date.now(),
      message: "Mock save - Database not configured",
    };
  }

  try {
    const collection = await getCollection<CalendarEventDocument>(Collections.CALENDAR);
    
    const eventDoc: Omit<CalendarEventDocument, "_id"> = {
      title: input.title,
      date: new Date(input.date),
      type: input.type,
      status: "pending",
      contentId: input.contentId ? new ObjectId(input.contentId) : undefined,
      authorId: new ObjectId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collection.insertOne(eventDoc as CalendarEventDocument);
    
    revalidatePath("/dashboard/calendar");
    
    return {
      success: true,
      id: result.insertedId.toString(),
    };
  } catch (error) {
    console.error("Create calendar event error:", error);
    return {
      success: false,
      error: "Failed to create calendar event",
    };
  }
}

export async function updateCalendarEvent(
  id: string,
  updates: Partial<CreateCalendarEventInput> & { status?: string }
) {
  if (!isMongoConfigured()) {
    console.log("📅 Mock: Updating calendar event -", id);
    return { success: true, message: "Mock update" };
  }

  try {
    const collection = await getCollection<CalendarEventDocument>(Collections.CALENDAR);
    
    const updateData: Partial<CalendarEventDocument> = {
      updatedAt: new Date(),
    };

    if (updates.title !== undefined) updateData.title = updates.title;
    if (updates.date !== undefined) updateData.date = new Date(updates.date);
    if (updates.type !== undefined) updateData.type = updates.type;
    if (updates.status !== undefined) updateData.status = updates.status as CalendarEventDocument["status"];

    await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
    
    revalidatePath("/dashboard/calendar");
    
    return { success: true };
  } catch (error) {
    console.error("Update calendar event error:", error);
    return {
      success: false,
      error: "Failed to update calendar event",
    };
  }
}

export async function moveCalendarEvent(id: string, newDate: string) {
  if (!isMongoConfigured()) {
    console.log("📅 Mock: Moving calendar event -", id, "to", newDate);
    return { success: true, message: "Mock move" };
  }

  try {
    const collection = await getCollection<CalendarEventDocument>(Collections.CALENDAR);
    
    await collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          date: new Date(newDate),
          updatedAt: new Date(),
        },
      }
    );
    
    revalidatePath("/dashboard/calendar");
    
    return { success: true };
  } catch (error) {
    console.error("Move calendar event error:", error);
    return {
      success: false,
      error: "Failed to move calendar event",
    };
  }
}

export async function deleteCalendarEvent(id: string) {
  if (!isMongoConfigured()) {
    console.log("📅 Mock: Deleting calendar event -", id);
    return { success: true, message: "Mock delete" };
  }

  try {
    const collection = await getCollection<CalendarEventDocument>(Collections.CALENDAR);
    
    await collection.deleteOne({ _id: new ObjectId(id) });
    
    revalidatePath("/dashboard/calendar");
    
    return { success: true };
  } catch (error) {
    console.error("Delete calendar event error:", error);
    return {
      success: false,
      error: "Failed to delete calendar event",
    };
  }
}

export async function completeCalendarEvent(id: string) {
  if (!isMongoConfigured()) {
    console.log("📅 Mock: Completing calendar event -", id);
    return { success: true, message: "Mock complete" };
  }

  try {
    const collection = await getCollection<CalendarEventDocument>(Collections.CALENDAR);
    
    await collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          status: "completed",
          updatedAt: new Date(),
        },
      }
    );
    
    revalidatePath("/dashboard/calendar");
    
    return { success: true };
  } catch (error) {
    console.error("Complete calendar event error:", error);
    return {
      success: false,
      error: "Failed to complete calendar event",
    };
  }
}
