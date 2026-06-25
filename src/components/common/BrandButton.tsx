import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { tokens } from "@/lib/utils/tokens";

type BrandButtonVariant = "brand" | "order" | "orderOutline" | "danger";

interface BrandButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: BrandButtonVariant;
  children: ReactNode;
  fullWidth?: boolean;
}

function variantClasses(variant: BrandButtonVariant): string {
  switch (variant) {
    case "brand":
      return cn(
        tokens.colors.brandBg,
        tokens.colors.brandBgHover,
        "text-white disabled:bg-zinc-200 disabled:text-zinc-400",
      );
    case "order":
      return cn(tokens.colors.orderAction, tokens.colors.orderActionHover, "text-white");
    case "orderOutline":
      return cn(
        "bg-white",
        tokens.colors.orderActionBorder,
        tokens.colors.orderActionText,
        tokens.colors.orderActionOutlineHover,
      );
    case "danger":
      return "bg-[#E1656D] hover:bg-[#d75660] text-white";
    default:
      return "";
  }
}

export function BrandButton({
  variant = "brand",
  children,
  className,
  fullWidth,
  type = "button",
  ...props
}: BrandButtonProps): React.JSX.Element {
  return (
    <button
      type={type}
      className={cn(
        "rounded-md text-xs font-medium transition-colors cursor-pointer select-none",
        variantClasses(variant),
        fullWidth && "w-full",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
