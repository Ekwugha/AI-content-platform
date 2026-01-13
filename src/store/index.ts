import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { ContentType, ToneOption } from "@/lib/utils";

// ============================================
// Content Store
// ============================================
export interface ContentItem {
  id: string;
  title: string;
  content: string;
  type: ContentType;
  status: "draft" | "scheduled" | "published" | "archived";
  createdAt: string;
  updatedAt: string;
  scheduledAt?: string;
  metadata: {
    keywords: string[];
    seoTitle?: string;
    seoDescription?: string;
    readabilityScore?: number;
    wordCount: number;
    readingTime: number;
  };
}

interface ContentState {
  items: ContentItem[];
  currentItem: ContentItem | null;
  isLoading: boolean;
  isSaving: boolean;
  lastSaved: string | null;
  
  setItems: (items: ContentItem[]) => void;
  addItem: (item: ContentItem) => void;
  updateItem: (id: string, updates: Partial<ContentItem>) => void;
  deleteItem: (id: string) => void;
  setCurrentItem: (item: ContentItem | null) => void;
  setLoading: (loading: boolean) => void;
  setSaving: (saving: boolean) => void;
  setLastSaved: (date: string | null) => void;
}

export const useContentStore = create<ContentState>((set) => ({
  items: [],
  currentItem: null,
  isLoading: false,
  isSaving: false,
  lastSaved: null,

  setItems: (items) => set({ items }),
  addItem: (item) => set((state) => ({ items: [item, ...state.items] })),
  updateItem: (id, updates) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, ...updates, updatedAt: new Date().toISOString() } : item
      ),
      currentItem:
        state.currentItem?.id === id
          ? { ...state.currentItem, ...updates, updatedAt: new Date().toISOString() }
          : state.currentItem,
    })),
  deleteItem: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
      currentItem: state.currentItem?.id === id ? null : state.currentItem,
    })),
  setCurrentItem: (item) => set({ currentItem: item }),
  setLoading: (loading) => set({ isLoading: loading }),
  setSaving: (saving) => set({ isSaving: saving }),
  setLastSaved: (date) => set({ lastSaved: date }),
}));

// ============================================
// Editor Store
// ============================================
interface EditorState {
  content: string;
  title: string;
  type: ContentType;
  tone: ToneOption;
  keywords: string[];
  isGenerating: boolean;
  suggestions: string[];
  showSuggestions: boolean;
  isDirty: boolean;
  
  setContent: (content: string) => void;
  setTitle: (title: string) => void;
  setType: (type: ContentType) => void;
  setTone: (tone: ToneOption) => void;
  setKeywords: (keywords: string[]) => void;
  addKeyword: (keyword: string) => void;
  removeKeyword: (keyword: string) => void;
  setIsGenerating: (generating: boolean) => void;
  setSuggestions: (suggestions: string[]) => void;
  setShowSuggestions: (show: boolean) => void;
  setIsDirty: (dirty: boolean) => void;
  reset: () => void;
}

const initialEditorState = {
  content: "",
  title: "",
  type: "blog" as ContentType,
  tone: "professional" as ToneOption,
  keywords: [],
  isGenerating: false,
  suggestions: [],
  showSuggestions: false,
  isDirty: false,
};

export const useEditorStore = create<EditorState>((set) => ({
  ...initialEditorState,

  setContent: (content) => set({ content, isDirty: true }),
  setTitle: (title) => set({ title, isDirty: true }),
  setType: (type) => set({ type }),
  setTone: (tone) => set({ tone }),
  setKeywords: (keywords) => set({ keywords }),
  addKeyword: (keyword) =>
    set((state) => ({
      keywords: state.keywords.includes(keyword)
        ? state.keywords
        : [...state.keywords, keyword],
    })),
  removeKeyword: (keyword) =>
    set((state) => ({
      keywords: state.keywords.filter((k) => k !== keyword),
    })),
  setIsGenerating: (generating) => set({ isGenerating: generating }),
  setSuggestions: (suggestions) => set({ suggestions }),
  setShowSuggestions: (show) => set({ showSuggestions: show }),
  setIsDirty: (dirty) => set({ isDirty: dirty }),
  reset: () => set(initialEditorState),
}));

// ============================================
// UI Store
// ============================================
interface UIState {
  sidebarOpen: boolean;
  commandPaletteOpen: boolean;
  theme: "light" | "dark" | "system";
  activeTab: string;
  
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setCommandPaletteOpen: (open: boolean) => void;
  toggleCommandPalette: () => void;
  setTheme: (theme: "light" | "dark" | "system") => void;
  setActiveTab: (tab: string) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      commandPaletteOpen: false,
      theme: "system",
      activeTab: "dashboard",

      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
      toggleCommandPalette: () =>
        set((state) => ({ commandPaletteOpen: !state.commandPaletteOpen })),
      setTheme: (theme) => set({ theme }),
      setActiveTab: (tab) => set({ activeTab: tab }),
    }),
    {
      name: "afrocreate-ui",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ theme: state.theme, sidebarOpen: state.sidebarOpen }),
    }
  )
);

// ============================================
// Calendar Store
// ============================================
export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: "publish" | "review" | "meeting" | "deadline";
  status: "pending" | "completed" | "cancelled";
  contentId?: string;
}

interface CalendarState {
  events: CalendarEvent[];
  selectedDate: string | null;
  viewMode: "month" | "week" | "day";
  
  setEvents: (events: CalendarEvent[]) => void;
  addEvent: (event: CalendarEvent) => void;
  updateEvent: (id: string, updates: Partial<CalendarEvent>) => void;
  deleteEvent: (id: string) => void;
  moveEvent: (id: string, newDate: string) => void;
  setSelectedDate: (date: string | null) => void;
  setViewMode: (mode: "month" | "week" | "day") => void;
}

export const useCalendarStore = create<CalendarState>((set) => ({
  events: [],
  selectedDate: null,
  viewMode: "month",

  setEvents: (events) => set({ events }),
  addEvent: (event) => set((state) => ({ events: [...state.events, event] })),
  updateEvent: (id, updates) =>
    set((state) => ({
      events: state.events.map((event) =>
        event.id === id ? { ...event, ...updates } : event
      ),
    })),
  deleteEvent: (id) =>
    set((state) => ({
      events: state.events.filter((event) => event.id !== id),
    })),
  moveEvent: (id, newDate) =>
    set((state) => ({
      events: state.events.map((event) =>
        event.id === id ? { ...event, date: newDate } : event
      ),
    })),
  setSelectedDate: (date) => set({ selectedDate: date }),
  setViewMode: (mode) => set({ viewMode: mode }),
}));

// ============================================
// User Store
// ============================================
interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: "admin" | "editor" | "viewer";
}

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  setUser: (user: User | null) => void;
  setAuthenticated: (authenticated: boolean) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setAuthenticated: (authenticated) => set({ isAuthenticated: authenticated }),
  setLoading: (loading) => set({ isLoading: loading }),
  logout: () => set({ user: null, isAuthenticated: false }),
}));

// ============================================
// Analytics Store
// ============================================
export interface AnalyticsData {
  totalViews: number;
  totalClicks: number;
  totalShares: number;
  engagementRate: number;
  topContent: { id: string; title: string; views: number }[];
  dailyStats: { date: string; views: number; clicks: number; shares: number }[];
}

interface AnalyticsState {
  data: AnalyticsData | null;
  isLoading: boolean;
  dateRange: { start: string; end: string };
  
  setData: (data: AnalyticsData | null) => void;
  setLoading: (loading: boolean) => void;
  setDateRange: (range: { start: string; end: string }) => void;
}

export const useAnalyticsStore = create<AnalyticsState>((set) => ({
  data: null,
  isLoading: false,
  dateRange: {
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    end: new Date().toISOString(),
  },

  setData: (data) => set({ data }),
  setLoading: (loading) => set({ isLoading: loading }),
  setDateRange: (range) => set({ dateRange: range }),
}));

