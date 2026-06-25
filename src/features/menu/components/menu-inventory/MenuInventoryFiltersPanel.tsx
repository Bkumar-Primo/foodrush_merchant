import { FieldLabel } from "@/components/common/FieldLabel";
import { FilterPill } from "@/components/common/FilterPill";
import { cn } from "@/lib/utils";
import { tokens } from "@/lib/utils/tokens";
import { DEFAULT_MENU_FILTERS, type MenuFilters } from "../../utils/menuFilters";

interface MenuInventoryFiltersPanelProps {
  localFilters: MenuFilters;
  onFiltersChange: (filters: MenuFilters) => void;
  hasActive: boolean;
}

const FOOD_TYPE_OPTIONS = [
  ["all", "All"],
  ["veg", "Veg"],
  ["non-veg", "Non-veg"],
  ["egg", "Egg"],
] as const;

const STOCK_OPTIONS = [
  ["all", "All stock"],
  ["in_stock", "In stock"],
  ["out_of_stock", "Out of stock"],
] as const;

export function MenuInventoryFiltersPanel({
  localFilters,
  onFiltersChange,
  hasActive,
}: MenuInventoryFiltersPanelProps): React.JSX.Element {
  return (
    <div className="absolute right-0 top-full mt-1.5 z-30 w-72 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl p-4 space-y-3 text-left">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium">Filter inventory</span>
        {hasActive && (
          <button
            type="button"
            onClick={() => onFiltersChange(DEFAULT_MENU_FILTERS)}
            className={cn(
              "text-[10px] font-medium hover:underline cursor-pointer",
              tokens.colors.brand,
            )}
          >
            Reset
          </button>
        )}
      </div>

      <div className="space-y-1">
        <FieldLabel block>Food type</FieldLabel>
        <div className="flex flex-wrap gap-1.5">
          {FOOD_TYPE_OPTIONS.map(([value, label]) => (
            <FilterPill
              key={value}
              active={localFilters.foodType === value}
              onClick={() => onFiltersChange({ ...localFilters, foodType: value })}
            >
              {label}
            </FilterPill>
          ))}
        </div>
      </div>

      <div className="space-y-1">
        <FieldLabel block>Stock status</FieldLabel>
        <div className="flex flex-wrap gap-1.5">
          {STOCK_OPTIONS.map(([value, label]) => (
            <FilterPill
              key={value}
              active={localFilters.stockStatus === value}
              onClick={() => onFiltersChange({ ...localFilters, stockStatus: value })}
            >
              {label}
            </FilterPill>
          ))}
        </div>
      </div>
    </div>
  );
}
