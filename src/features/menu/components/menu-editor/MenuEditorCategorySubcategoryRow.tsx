import { cn } from "@/lib/utils";
import { tokens } from "@/lib/utils/tokens";

interface MenuEditorCategorySubcategoryRowProps {
  label: string;
  count: number;
  isActive: boolean;
  onClick: () => void;
}

export function MenuEditorCategorySubcategoryRow({
  label,
  count,
  isActive,
  onClick,
}: MenuEditorCategorySubcategoryRowProps): React.JSX.Element {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full flex items-center justify-between py-1.5 px-3 border-l text-left text-xs font-medium cursor-pointer transition-colors",
        isActive
          ? cn(
              tokens.colors.brand,
              "font-medium",
              tokens.colors.brandBorder,
              "bg-[#D4543C]/10 dark:bg-[#D4543C]/15",
            )
          : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 border-zinc-200 dark:border-zinc-800",
      )}
    >
      <span>{label}</span>
      <span className="text-[10px] text-zinc-450">{count}</span>
    </button>
  );
}
