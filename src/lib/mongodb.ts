import { MongoClient, Db, Collection, ObjectId, Document } from "mongodb";

/**
 * MongoDB Connection Module
 *
 * This module handles MongoDB connections with the following features:
 * - Lazy initialization (only connects when needed)
 * - Connection pooling in development
 * - Build-friendly (doesn't throw during Next.js build)
 */

const uri = process.env.MONGODB_URI;

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

/**
 * Get MongoDB client promise
 * Lazily creates connection only when needed
 */
function getClientPromise(): Promise<MongoClient> {
  if (!uri) {
    throw new Error(
      "MongoDB URI not configured. Please add MONGODB_URI to your environment variables."
    );
  }

  if (process.env.NODE_ENV === "development") {
    // In development, use global variable to preserve connection across hot reloads
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri);
      global._mongoClientPromise = client.connect();
    }
    return global._mongoClientPromise;
  }

  // In production, create a new client
  if (!clientPromise) {
    client = new MongoClient(uri);
    clientPromise = client.connect();
  }
  return clientPromise;
}

/**
 * Get database instance
 */
export async function getDatabase(): Promise<Db> {
  const client = await getClientPromise();
  return client.db(process.env.MONGODB_DB || "afrocreate");
}

/**
 * Get collection with type safety
 */
export async function getCollection<T extends Document = Document>(
  name: string
): Promise<Collection<T>> {
  const db = await getDatabase();
  return db.collection<T>(name);
}

/**
 * Check if MongoDB is configured
 */
export function isMongoConfigured(): boolean {
  return !!process.env.MONGODB_URI;
}

// Type definitions for database documents
export interface UserDocument extends Document {
  _id?: ObjectId;
  email: string;
  name: string;
  avatar?: string;
  role: "admin" | "editor" | "viewer";
  teamId?: ObjectId;
  createdAt: Date;
  updatedAt: Date;
  preferences: {
    theme: "light" | "dark" | "system";
    defaultTone: string;
    defaultContentType: string;
  };
}

export interface TeamDocument extends Document {
  _id?: ObjectId;
  name: string;
  slug: string;
  ownerId: ObjectId;
  members: {
    userId: ObjectId;
    role: "admin" | "editor" | "viewer";
    joinedAt: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ContentDocument extends Document {
  _id?: ObjectId;
  title: string;
  slug: string;
  content: string;
  type: "blog" | "social" | "ad" | "email" | "headline" | "hashtag";
  status: "draft" | "scheduled" | "published" | "archived";
  authorId: ObjectId;
  teamId?: ObjectId;
  metadata: {
    keywords: string[];
    seoTitle?: string;
    seoDescription?: string;
    readabilityScore?: number;
    wordCount: number;
    readingTime: number;
  };
  scheduledAt?: Date;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  aiGenerated: boolean;
  aiPrompt?: string;
}

export interface AnalyticsDocument extends Document {
  _id?: ObjectId;
  contentId: ObjectId;
  teamId?: ObjectId;
  views: number;
  clicks: number;
  shares: number;
  engagement: number;
  date: Date;
}

export interface CalendarEventDocument extends Document {
  _id?: ObjectId;
  title: string;
  contentId?: ObjectId;
  teamId?: ObjectId;
  authorId: ObjectId;
  date: Date;
  type: "publish" | "review" | "meeting" | "deadline";
  status: "pending" | "completed" | "cancelled";
  createdAt: Date;
  updatedAt: Date;
}

// Collection names
export const Collections = {
  USERS: "users",
  TEAMS: "teams",
  CONTENT: "content",
  ANALYTICS: "analytics",
  CALENDAR: "calendar_events",
} as const;

export { ObjectId };

// Export client promise getter for direct access if needed
export { getClientPromise as clientPromise };
