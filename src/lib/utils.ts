import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

export function formatRelativeTime(date: Date | string): string {
  const now = new Date();
  const then = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - then.getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  
  return formatDate(date);
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

export function calculateReadingTime(text: string): number {
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

export function extractKeywords(text: string, limit: number = 10): string[] {
  const commonWords = new Set([
    "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for",
    "of", "with", "by", "from", "as", "is", "was", "are", "were", "been",
    "be", "have", "has", "had", "do", "does", "did", "will", "would", "could",
    "should", "may", "might", "must", "shall", "can", "this", "that", "these",
    "those", "i", "you", "he", "she", "it", "we", "they", "what", "which",
    "who", "when", "where", "why", "how", "all", "each", "every", "both",
    "few", "more", "most", "other", "some", "such", "no", "nor", "not", "only",
    "own", "same", "so", "than", "too", "very", "just", "also", "now", "here",
  ]);

  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .filter((word) => word.length > 3 && !commonWords.has(word));

  const frequency: Record<string, number> = {};
  words.forEach((word) => {
    frequency[word] = (frequency[word] || 0) + 1;
  });

  return Object.entries(frequency)
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit)
    .map(([word]) => word);
}

export function calculateReadabilityScore(text: string): number {
  const sentences = text.split(/[.!?]+/).filter(Boolean).length || 1;
  const words = text.trim().split(/\s+/).length;
  const syllables = text.split(/\s+/).reduce((count, word) => {
    return count + countSyllables(word);
  }, 0);

  // Flesch Reading Ease formula
  const score = 206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words);
  return Math.max(0, Math.min(100, Math.round(score)));
}

function countSyllables(word: string): number {
  word = word.toLowerCase();
  if (word.length <= 3) return 1;
  
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "");
  word = word.replace(/^y/, "");
  
  const matches = word.match(/[aeiouy]{1,2}/g);
  return matches ? matches.length : 1;
}

export const contentTypes = [
  { id: "blog", label: "Blog Post", icon: "FileText" },
  { id: "social", label: "Social Post", icon: "Share2" },
  { id: "ad", label: "Ad Copy", icon: "Megaphone" },
  { id: "email", label: "Email", icon: "Mail" },
  { id: "headline", label: "Headlines", icon: "Type" },
  { id: "hashtag", label: "Hashtags", icon: "Hash" },
] as const;

export type ContentType = (typeof contentTypes)[number]["id"];

export const toneOptions = [
  { id: "professional", label: "Professional" },
  { id: "casual", label: "Casual" },
  { id: "friendly", label: "Friendly" },
  { id: "formal", label: "Formal" },
  { id: "persuasive", label: "Persuasive" },
  { id: "inspiring", label: "Inspiring" },
  { id: "humorous", label: "Humorous" },
  { id: "nigerian", label: "Nigerian Pidgin" },
] as const;

export type ToneOption = (typeof toneOptions)[number]["id"];

export const nigerianContextPrompts = {
  marketReferences: [
    "Computer Village", "Alaba Market", "Balogun Market", "Onitsha Main Market",
    "Ariaria Market", "Wuse Market"
  ],
  culturalEvents: [
    "Felabration", "Lagos Fashion Week", "Calabar Carnival", "Eyo Festival",
    "New Yam Festival", "Durbar Festival"
  ],
  businessTerms: [
    "hustle", "side hustle", "packaging", "levels", "secure the bag",
    "runs", "flex", "sapa", "japa"
  ],
  greetings: [
    "E go be", "How far", "Wetin dey", "Na so", "E choke", "Omo", "Na wa"
  ],
};

