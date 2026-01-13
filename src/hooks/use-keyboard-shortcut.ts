"use client";

import { useEffect, useCallback } from "react";

type ModifierKey = "ctrl" | "alt" | "shift" | "meta";

interface KeyboardShortcutOptions {
  key: string;
  modifiers?: ModifierKey[];
  callback: () => void;
  enabled?: boolean;
}

export function useKeyboardShortcut({
  key,
  modifiers = [],
  callback,
  enabled = true,
}: KeyboardShortcutOptions) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      // Check if all required modifiers are pressed
      const ctrlRequired = modifiers.includes("ctrl");
      const altRequired = modifiers.includes("alt");
      const shiftRequired = modifiers.includes("shift");
      const metaRequired = modifiers.includes("meta");

      const ctrlPressed = event.ctrlKey;
      const altPressed = event.altKey;
      const shiftPressed = event.shiftKey;
      const metaPressed = event.metaKey;

      // On Mac, we often want Cmd (meta) instead of Ctrl
      const ctrlOrMeta = ctrlRequired ? (ctrlPressed || metaPressed) : true;

      if (
        event.key.toLowerCase() === key.toLowerCase() &&
        ctrlOrMeta &&
        altPressed === altRequired &&
        shiftPressed === shiftRequired &&
        (metaRequired ? metaPressed : true)
      ) {
        event.preventDefault();
        callback();
      }
    },
    [key, modifiers, callback, enabled]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);
}

// Predefined shortcuts
export function useCommandPaletteShortcut(callback: () => void) {
  useKeyboardShortcut({
    key: "k",
    modifiers: ["meta"],
    callback,
  });
}

export function useSaveShortcut(callback: () => void) {
  useKeyboardShortcut({
    key: "s",
    modifiers: ["meta"],
    callback,
  });
}

export function useEscapeShortcut(callback: () => void) {
  useKeyboardShortcut({
    key: "Escape",
    callback,
  });
}

