"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  FileText,
  Calendar,
  BarChart3,
  Settings,
  Users,
  PenTool,
  Hash,
  Mail,
  Megaphone,
  Share2,
  Moon,
  Sun,
  Plus,
  Sparkles,
} from "lucide-react";
import { useUIStore } from "@/store";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

interface CommandItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  shortcut?: string;
  action: () => void;
  category: string;
}

export function CommandPalette() {
  const router = useRouter();
  const { commandPaletteOpen, setCommandPaletteOpen } = useUIStore();
  const { setTheme, theme } = useTheme();
  const [search, setSearch] = React.useState("");

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandPaletteOpen(!commandPaletteOpen);
      }
      if (e.key === "Escape") {
        setCommandPaletteOpen(false);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [commandPaletteOpen, setCommandPaletteOpen]);

  const commands: CommandItem[] = [
    // Navigation
    {
      id: "dashboard",
      label: "Go to Dashboard",
      icon: <BarChart3 className="h-4 w-4" />,
      shortcut: "⌘D",
      action: () => router.push("/dashboard"),
      category: "Navigation",
    },
    {
      id: "editor",
      label: "Open Editor",
      icon: <PenTool className="h-4 w-4" />,
      shortcut: "⌘E",
      action: () => router.push("/dashboard/editor"),
      category: "Navigation",
    },
    {
      id: "calendar",
      label: "Content Calendar",
      icon: <Calendar className="h-4 w-4" />,
      shortcut: "⌘L",
      action: () => router.push("/dashboard/calendar"),
      category: "Navigation",
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: <BarChart3 className="h-4 w-4" />,
      action: () => router.push("/dashboard/analytics"),
      category: "Navigation",
    },
    {
      id: "team",
      label: "Team Settings",
      icon: <Users className="h-4 w-4" />,
      action: () => router.push("/dashboard/team"),
      category: "Navigation",
    },
    {
      id: "settings",
      label: "Settings",
      icon: <Settings className="h-4 w-4" />,
      shortcut: "⌘,",
      action: () => router.push("/dashboard/settings"),
      category: "Navigation",
    },

    // Create Content
    {
      id: "new-blog",
      label: "New Blog Post",
      icon: <FileText className="h-4 w-4" />,
      action: () => router.push("/dashboard/editor?type=blog"),
      category: "Create",
    },
    {
      id: "new-social",
      label: "New Social Post",
      icon: <Share2 className="h-4 w-4" />,
      action: () => router.push("/dashboard/editor?type=social"),
      category: "Create",
    },
    {
      id: "new-ad",
      label: "New Ad Copy",
      icon: <Megaphone className="h-4 w-4" />,
      action: () => router.push("/dashboard/editor?type=ad"),
      category: "Create",
    },
    {
      id: "new-email",
      label: "New Email",
      icon: <Mail className="h-4 w-4" />,
      action: () => router.push("/dashboard/editor?type=email"),
      category: "Create",
    },
    {
      id: "generate-headlines",
      label: "Generate Headlines",
      icon: <Sparkles className="h-4 w-4" />,
      action: () => router.push("/dashboard/editor?type=headline"),
      category: "Create",
    },
    {
      id: "generate-hashtags",
      label: "Generate Hashtags",
      icon: <Hash className="h-4 w-4" />,
      action: () => router.push("/dashboard/editor?type=hashtag"),
      category: "Create",
    },

    // Actions
    {
      id: "toggle-theme",
      label: theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode",
      icon: theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />,
      action: () => setTheme(theme === "dark" ? "light" : "dark"),
      category: "Actions",
    },
  ];

  const filteredCommands = commands.filter((cmd) =>
    cmd.label.toLowerCase().includes(search.toLowerCase())
  );

  const groupedCommands = filteredCommands.reduce((acc, cmd) => {
    if (!acc[cmd.category]) {
      acc[cmd.category] = [];
    }
    acc[cmd.category].push(cmd);
    return acc;
  }, {} as Record<string, CommandItem[]>);

  return (
    <AnimatePresence>
      {commandPaletteOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={() => setCommandPaletteOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.15 }}
            className="fixed left-1/2 top-[20%] z-50 w-full max-w-xl -translate-x-1/2"
          >
            <Command
              className="glass-card rounded-2xl border shadow-2xl overflow-hidden"
              shouldFilter={false}
            >
              <div className="flex items-center border-b px-4">
                <Search className="h-5 w-5 text-muted-foreground mr-2" />
                <Command.Input
                  placeholder="Type a command or search..."
                  value={search}
                  onValueChange={setSearch}
                  className="flex h-14 w-full bg-transparent py-3 text-base outline-none placeholder:text-muted-foreground"
                />
                <kbd className="hidden sm:inline-flex h-6 select-none items-center gap-1 rounded border bg-muted px-2 font-mono text-xs text-muted-foreground">
                  <span className="text-xs">ESC</span>
                </kbd>
              </div>
              <Command.List className="max-h-[400px] overflow-y-auto p-2 custom-scrollbar">
                <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
                  No results found.
                </Command.Empty>
                {Object.entries(groupedCommands).map(([category, items]) => (
                  <Command.Group key={category} heading={category}>
                    <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                      {category}
                    </div>
                    {items.map((cmd) => (
                      <Command.Item
                        key={cmd.id}
                        value={cmd.id}
                        onSelect={() => {
                          cmd.action();
                          setCommandPaletteOpen(false);
                          setSearch("");
                        }}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm cursor-pointer",
                          "aria-selected:bg-accent aria-selected:text-accent-foreground",
                          "hover:bg-accent/50 transition-colors"
                        )}
                      >
                        <span className="text-muted-foreground">{cmd.icon}</span>
                        <span className="flex-1">{cmd.label}</span>
                        {cmd.shortcut && (
                          <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs text-muted-foreground">
                            {cmd.shortcut}
                          </kbd>
                        )}
                      </Command.Item>
                    ))}
                  </Command.Group>
                ))}
              </Command.List>
              <div className="border-t p-2 flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 rounded border bg-muted">↑↓</kbd>
                    navigate
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 rounded border bg-muted">↵</kbd>
                    select
                  </span>
                </div>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded border bg-muted">⌘K</kbd>
                  toggle
                </span>
              </div>
            </Command>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

