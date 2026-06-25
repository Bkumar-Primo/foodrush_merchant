"use client";

import { Moon, Sun } from "lucide-react";
import { tokens } from "@/lib/utils/tokens";

interface HeaderThemeToggleProps {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

export function HeaderThemeToggle({
  theme,
  toggleTheme,
}: HeaderThemeToggleProps): React.JSX.Element {
  return (
    <button
      onClick={toggleTheme}
      className={`flex items-center justify-center p-1.5 rounded-lg border ${tokens.colors.border} bg-white hover:bg-zinc-100 dark:bg-zinc-900 dark:hover:bg-zinc-800 ${tokens.colors.textMuted} transition-colors shadow-sm cursor-pointer`}
      aria-label="Toggle theme"
      title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
    >
      {theme === "light" ? (
        <Moon className="h-3.5 w-3.5" />
      ) : (
        <Sun className="h-3.5 w-3.5 text-amber-500" />
      )}
    </button>
  );
}
