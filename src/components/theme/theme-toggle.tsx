"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const THEME_STORAGE_KEY = "gemma-theme";

type ThemeMode = "light" | "dark";

type ThemeToggleProps = {
  className?: string;
};

function getSystemTheme(): ThemeMode {
  if (typeof window === "undefined") {
    return "dark";
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyTheme(theme: ThemeMode) {
  const root = document.documentElement;
  if (theme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
}

export default function ThemeToggle({ className }: ThemeToggleProps) {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<ThemeMode>("dark");

  useEffect(() => {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null;
    const initialTheme = stored ?? getSystemTheme();
    setTheme(initialTheme);
    applyTheme(initialTheme);
    setMounted(true);
  }, []);

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border border-border bg-panel/80 p-1 text-xs",
        className,
        !mounted && "opacity-70"
      )}
      role="group"
      aria-label="Theme toggle"
    >
      {(["light", "dark"] as ThemeMode[]).map((mode) => (
        <button
          key={mode}
          type="button"
          disabled={!mounted}
          onClick={() => {
            setTheme(mode);
            applyTheme(mode);
            window.localStorage.setItem(THEME_STORAGE_KEY, mode);
          }}
          aria-pressed={theme === mode}
          className={cn(
            "rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.2em] transition",
            theme === mode
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {mode}
        </button>
      ))}
    </div>
  );
}
