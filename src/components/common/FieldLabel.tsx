import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { tokens } from "@/lib/utils/tokens";

interface FieldLabelProps {
  children: ReactNode;
  className?: string;
  block?: boolean;
}

export function FieldLabel({ children, className, block }: FieldLabelProps): React.JSX.Element {
  return (
    <span className={cn(tokens.fontSizes.fieldLabel, block && "block", className)}>{children}</span>
  );
}
