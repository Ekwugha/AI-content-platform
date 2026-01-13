import { MongoClient, Db, Collection, ObjectId } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error("Please add your MongoDB URI to .env.local");
}

const uri = process.env.MONGODB_URI;
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export async function getDatabase(): Promise<Db> {
  const client = await clientPromise;
  return client.db(process.env.MONGODB_DB || "afrocreate");
}

export async function getCollection<T extends Document>(
  name: string
): Promise<Collection<T>> {
  const db = await getDatabase();
  return db.collection<T>(name);
}

// Type definitions for database documents
export interface UserDocument {
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

export interface TeamDocument {
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

export interface ContentDocument {
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

export interface AnalyticsDocument {
  _id?: ObjectId;
  contentId: ObjectId;
  teamId?: ObjectId;
  views: number;
  clicks: number;
  shares: number;
  engagement: number;
  date: Date;
}

export interface CalendarEventDocument {
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

export { clientPromise, ObjectId };

