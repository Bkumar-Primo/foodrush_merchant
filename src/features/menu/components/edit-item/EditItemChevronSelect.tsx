import { ChevronDown } from "lucide-react";
import type { SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { tokens } from "@/lib/utils/tokens";

interface EditItemChevronSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  wrapperClassName?: string;
}

export function EditItemChevronSelect({
  className,
  wrapperClassName,
  children,
  ...props
}: EditItemChevronSelectProps): React.JSX.Element {
  return (
    <div className={cn("relative w-full", wrapperClassName)}>
      <select
        className={cn(
          "w-full appearance-none rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-955 px-3 py-2 text-xs font-medium text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-1 transition-all cursor-pointer",
          tokens.colors.brandRing,
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
    </div>
  );
}
