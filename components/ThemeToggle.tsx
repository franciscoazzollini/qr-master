"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <button
        type="button"
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface text-muted"
        aria-label="Toggle theme"
      />
    );
  }

  const isDark = (resolvedTheme ?? theme) === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface text-foreground transition-colors hover:bg-surface-elevated"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <span className="text-lg" aria-hidden>
        {isDark ? "☀️" : "🌙"}
      </span>
    </button>
  );
}
