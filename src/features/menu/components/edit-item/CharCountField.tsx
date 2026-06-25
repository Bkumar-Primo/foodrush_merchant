"use client";

import { FieldLabel } from "@/components/common/FieldLabel";
import { TextField } from "@/components/common/TextField";
import { cn } from "@/lib/utils";
import { tokens } from "@/lib/utils/tokens";

interface CharCountFieldProps {
  label: string;
  value: string;
  maxLength: number;
  onChange: (value: string) => void;
  placeholder: string;
  multiline?: boolean;
  rows?: number;
}

export function CharCountField({
  label,
  value,
  maxLength,
  onChange,
  placeholder,
  multiline,
  rows = 3,
}: CharCountFieldProps): React.JSX.Element {
  return (
    <div className="space-y-1.5">
      <FieldLabel>{label}</FieldLabel>
      <div className="relative w-full">
        {multiline ? (
          <textarea
            placeholder={placeholder}
            value={value}
            maxLength={maxLength}
            rows={rows}
            onChange={(e) => onChange(e.target.value)}
            className={cn(tokens.colors.input, "py-2.5 pr-12 resize-none font-medium")}
          />
        ) : (
          <TextField
            type="text"
            placeholder={placeholder}
            value={value}
            maxLength={maxLength}
            onChange={(e) => onChange(e.target.value)}
            className="py-2.5 pr-12 font-medium"
          />
        )}
        <span
          className={cn(
            "absolute right-3 text-[9px] font-medium text-zinc-400",
            multiline ? "bottom-3" : "top-1/2 -translate-y-1/2",
          )}
        >
          {value.length} / {maxLength}
        </span>
      </div>
    </div>
  );
}
