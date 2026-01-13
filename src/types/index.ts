// Content Types
export type ContentType = "blog" | "social" | "ad" | "email" | "headline" | "hashtag";

export type ContentStatus = "draft" | "scheduled" | "published" | "archived";

export type ToneOption =
  | "professional"
  | "casual"
  | "friendly"
  | "formal"
  | "persuasive"
  | "inspiring"
  | "humorous"
  | "nigerian";

// User Types
export type UserRole = "admin" | "editor" | "viewer";

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  teamId?: string;
  preferences: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPreferences {
  theme: "light" | "dark" | "system";
  defaultTone: ToneOption;
  defaultContentType: ContentType;
  includeNigerianContext: boolean;
}

// Content Types
export interface ContentMetadata {
  keywords: string[];
  seoTitle?: string;
  seoDescription?: string;
  readabilityScore?: number;
  wordCount: number;
  readingTime: number;
}

export interface Content {
  id: string;
  title: string;
  slug: string;
  content: string;
  type: ContentType;
  status: ContentStatus;
  authorId: string;
  teamId?: string;
  metadata: ContentMetadata;
  scheduledAt?: Date;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  aiGenerated: boolean;
  aiPrompt?: string;
}

// Calendar Types
export type CalendarEventType = "publish" | "review" | "meeting" | "deadline";

export type CalendarEventStatus = "pending" | "completed" | "cancelled";

export interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  type: CalendarEventType;
  status: CalendarEventStatus;
  contentId?: string;
  teamId?: string;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Analytics Types
export interface AnalyticsData {
  totalViews: number;
  totalClicks: number;
  totalShares: number;
  engagementRate: number;
  topContent: TopContentItem[];
  dailyStats: DailyStats[];
}

export interface TopContentItem {
  id: string;
  title: string;
  views: number;
  engagement: number;
}

export interface DailyStats {
  date: string;
  views: number;
  clicks: number;
  shares: number;
}

// Team Types
export interface Team {
  id: string;
  name: string;
  slug: string;
  ownerId: string;
  members: TeamMember[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TeamMember {
  userId: string;
  role: UserRole;
  joinedAt: Date;
}

// AI Generation Types
export interface GenerationParams {
  type: ContentType;
  topic: string;
  tone: ToneOption;
  keywords?: string[];
  targetAudience?: string;
  length?: "short" | "medium" | "long";
  includeNigerianContext?: boolean;
  additionalInstructions?: string;
}

export interface GeneratedContent {
  content: string;
  title?: string;
  seoTitle?: string;
  seoDescription?: string;
  suggestedKeywords: string[];
  hashtags?: string[];
  readabilityScore: number;
}

// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
}

