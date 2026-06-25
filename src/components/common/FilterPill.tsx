import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { tokens } from "@/lib/utils/tokens";

interface FilterPillProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  children: ReactNode;
}

export function FilterPill({
  active = false,
  children,
  className,
  type = "button",
  ...props
}: FilterPillProps): React.JSX.Element {
  return (
    <button
      type={type}
      className={cn(
        "px-2.5 py-1 rounded-md text-[10px] font-medium border cursor-pointer transition-colors",
        active
          ? cn(tokens.colors.brandBg, "text-white", tokens.colors.brandBorder)
          : "bg-white dark:bg-zinc-900 text-zinc-600 border-zinc-200 dark:border-zinc-700",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
