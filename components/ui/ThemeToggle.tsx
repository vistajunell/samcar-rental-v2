"use client";

import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";

export default function ThemeToggle() {
  const { theme, toggleTheme, mounted } = useTheme();

  /* Avoid hydration mismatch — render an inert placeholder until mounted */
  if (!mounted) {
    return (
      <span
        aria-hidden
        className="inline-flex w-9 h-9 rounded-full border border-gray-200 dark:border-white/10"
      />
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="group relative inline-flex w-9 h-9 items-center justify-center rounded-full border border-gray-200 dark:border-white/15 bg-white dark:bg-white/5 hover:border-brand-red dark:hover:border-brand-red transition-all overflow-hidden"
    >
      <Sun
        className={`absolute h-4 w-4 text-yellow-500 transition-all duration-300 ${
          isDark ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
        }`}
      />
      <Moon
        className={`absolute h-4 w-4 text-brand-red transition-all duration-300 ${
          isDark ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"
        }`}
      />
    </button>
  );
}
