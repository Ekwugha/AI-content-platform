"use client";

import { useEffect, useRef, useCallback } from "react";
import { useContentStore } from "@/store";

interface UseAutosaveOptions {
  data: unknown;
  onSave: (data: unknown) => Promise<void>;
  interval?: number;
  enabled?: boolean;
}

export function useAutosave({
  data,
  onSave,
  interval = 30000,
  enabled = true,
}: UseAutosaveOptions) {
  const { setSaving, setLastSaved } = useContentStore();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedDataRef = useRef<string>("");

  const save = useCallback(async () => {
    const currentData = JSON.stringify(data);
    
    // Don't save if data hasn't changed
    if (currentData === lastSavedDataRef.current) {
      return;
    }

    setSaving(true);
    try {
      await onSave(data);
      lastSavedDataRef.current = currentData;
      setLastSaved(new Date().toISOString());
    } catch (error) {
      console.error("Autosave failed:", error);
    } finally {
      setSaving(false);
    }
  }, [data, onSave, setSaving, setLastSaved]);

  useEffect(() => {
    if (!enabled) return;

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(save, interval);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, interval, enabled, save]);

  // Save on unmount if there are unsaved changes
  useEffect(() => {
    return () => {
      const currentData = JSON.stringify(data);
      if (currentData !== lastSavedDataRef.current) {
        save();
      }
    };
  }, [data, save]);

  return { save };
}

