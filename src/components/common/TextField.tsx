import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { tokens } from "@/lib/utils/tokens";

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

export function TextField({ className, hasError, ...props }: TextFieldProps): React.JSX.Element {
  return (
    <input
      className={cn(
        tokens.colors.input,
        hasError && "border-rose-400 focus:ring-rose-400",
        className,
      )}
      {...props}
    />
  );
}
