import { Search } from "lucide-react";
import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { tokens } from "@/lib/utils/tokens";

interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  wrapperClassName?: string;
}

export function SearchInput({
  className,
  wrapperClassName,
  ...props
}: SearchInputProps): React.JSX.Element {
  return (
    <div className={cn("relative", wrapperClassName)}>
      <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
      <input type="search" className={cn(tokens.colors.input, "pl-9", className)} {...props} />
    </div>
  );
}
