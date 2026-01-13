"use server";

import { revalidatePath } from "next/cache";
import { getCollection, Collections, ContentDocument, ObjectId, isMongoConfigured } from "@/lib/mongodb";
import { slugify, calculateReadingTime, calculateReadabilityScore } from "@/lib/utils";

export interface CreateContentInput {
  title: string;
  content: string;
  type: "blog" | "social" | "ad" | "email" | "headline" | "hashtag";
  keywords?: string[];
  seoTitle?: string;
  seoDescription?: string;
  aiGenerated?: boolean;
}

export async function createContent(input: CreateContentInput) {
  // Return mock success if MongoDB is not configured
  if (!isMongoConfigured()) {
    console.log("📝 Mock: Creating content -", input.title);
    return {
      success: true,
      id: "mock-" + Date.now(),
      message: "Mock save - Database not configured",
    };
  }

  try {
    const collection = await getCollection<ContentDocument>(Collections.CONTENT);
    
    const wordCount = input.content.split(/\s+/).filter(Boolean).length;
    
    const contentDoc: Omit<ContentDocument, "_id"> = {
      title: input.title,
      slug: slugify(input.title),
      content: input.content,
      type: input.type,
      status: "draft",
      authorId: new ObjectId(),
      metadata: {
        keywords: input.keywords || [],
        seoTitle: input.seoTitle,
        seoDescription: input.seoDescription,
        readabilityScore: calculateReadabilityScore(input.content),
        wordCount,
        readingTime: calculateReadingTime(input.content),
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      aiGenerated: input.aiGenerated || false,
    };

    const result = await collection.insertOne(contentDoc as ContentDocument);
    
    revalidatePath("/dashboard/content");
    revalidatePath("/dashboard");
    
    return {
      success: true,
      id: result.insertedId.toString(),
    };
  } catch (error) {
    console.error("Create content error:", error);
    return {
      success: false,
      error: "Failed to create content",
    };
  }
}

export async function updateContent(
  id: string,
  updates: Partial<CreateContentInput> & { status?: string }
) {
  if (!isMongoConfigured()) {
    console.log("📝 Mock: Updating content -", id);
    return { success: true, message: "Mock update" };
  }

  try {
    const collection = await getCollection<ContentDocument>(Collections.CONTENT);
    
    const updateData: Partial<ContentDocument> = {
      updatedAt: new Date(),
    };

    if (updates.title !== undefined) {
      updateData.title = updates.title;
      updateData.slug = slugify(updates.title);
    }
    if (updates.content !== undefined) {
      updateData.content = updates.content;
      const wordCount = updates.content.split(/\s+/).filter(Boolean).length;
      updateData.metadata = {
        ...updateData.metadata,
        wordCount,
        readingTime: calculateReadingTime(updates.content),
        readabilityScore: calculateReadabilityScore(updates.content),
        keywords: updates.keywords || [],
        seoTitle: updates.seoTitle,
        seoDescription: updates.seoDescription,
      };
    }
    if (updates.status !== undefined) {
      updateData.status = updates.status as ContentDocument["status"];
    }

    await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
    
    revalidatePath("/dashboard/content");
    revalidatePath("/dashboard");
    
    return { success: true };
  } catch (error) {
    console.error("Update content error:", error);
    return {
      success: false,
      error: "Failed to update content",
    };
  }
}

export async function deleteContent(id: string) {
  if (!isMongoConfigured()) {
    console.log("📝 Mock: Deleting content -", id);
    return { success: true, message: "Mock delete" };
  }

  try {
    const collection = await getCollection<ContentDocument>(Collections.CONTENT);
    
    await collection.deleteOne({ _id: new ObjectId(id) });
    
    revalidatePath("/dashboard/content");
    revalidatePath("/dashboard");
    
    return { success: true };
  } catch (error) {
    console.error("Delete content error:", error);
    return {
      success: false,
      error: "Failed to delete content",
    };
  }
}

export async function publishContent(id: string) {
  if (!isMongoConfigured()) {
    console.log("📝 Mock: Publishing content -", id);
    return { success: true, message: "Mock publish" };
  }

  try {
    const collection = await getCollection<ContentDocument>(Collections.CONTENT);
    
    await collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          status: "published",
          publishedAt: new Date(),
          updatedAt: new Date(),
        },
      }
    );
    
    revalidatePath("/dashboard/content");
    revalidatePath("/dashboard");
    
    return { success: true };
  } catch (error) {
    console.error("Publish content error:", error);
    return {
      success: false,
      error: "Failed to publish content",
    };
  }
}

export async function scheduleContent(id: string, scheduledAt: Date) {
  if (!isMongoConfigured()) {
    console.log("📝 Mock: Scheduling content -", id, scheduledAt);
    return { success: true, message: "Mock schedule" };
  }

  try {
    const collection = await getCollection<ContentDocument>(Collections.CONTENT);
    
    await collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          status: "scheduled",
          scheduledAt,
          updatedAt: new Date(),
        },
      }
    );
    
    revalidatePath("/dashboard/content");
    revalidatePath("/dashboard/calendar");
    
    return { success: true };
  } catch (error) {
    console.error("Schedule content error:", error);
    return {
      success: false,
      error: "Failed to schedule content",
    };
  }
}

export async function duplicateContent(id: string) {
  if (!isMongoConfigured()) {
    console.log("📝 Mock: Duplicating content -", id);
    return { success: true, id: "mock-" + Date.now(), message: "Mock duplicate" };
  }

  try {
    const collection = await getCollection<ContentDocument>(Collections.CONTENT);
    
    const original = await collection.findOne({ _id: new ObjectId(id) });
    
    if (!original) {
      return {
        success: false,
        error: "Content not found",
      };
    }

    const duplicate: Omit<ContentDocument, "_id"> = {
      ...original,
      _id: undefined,
      title: `${original.title} (Copy)`,
      slug: `${original.slug}-copy-${Date.now()}`,
      status: "draft",
      createdAt: new Date(),
      updatedAt: new Date(),
      publishedAt: undefined,
      scheduledAt: undefined,
    };

    const result = await collection.insertOne(duplicate as ContentDocument);
    
    revalidatePath("/dashboard/content");
    
    return {
      success: true,
      id: result.insertedId.toString(),
    };
  } catch (error) {
    console.error("Duplicate content error:", error);
    return {
      success: false,
      error: "Failed to duplicate content",
    };
  }
}
