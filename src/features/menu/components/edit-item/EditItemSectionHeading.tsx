import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { tokens } from "@/lib/utils/tokens";

interface EditItemSectionHeadingProps {
  children: ReactNode;
  className?: string;
}

export function EditItemSectionHeading({
  children,
  className,
}: EditItemSectionHeadingProps): React.JSX.Element {
  return (
    <h3
      className={cn(
        tokens.fontSizes.body,
        "text-zinc-400 dark:text-zinc-500 uppercase tracking-widest",
        className,
      )}
    >
      {children}
    </h3>
  );
}
