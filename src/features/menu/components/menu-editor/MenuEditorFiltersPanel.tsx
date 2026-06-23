import { FilterPill } from "@/components/common/FilterPill";
import { cn } from "@/lib/utils";
import { tokens } from "@/lib/utils/tokens";
import { DEFAULT_MENU_FILTERS, hasActiveFilters, type MenuFilters } from "../../utils/menuFilters";

interface MenuEditorFiltersPanelProps {
  menuFilters: MenuFilters;
  onMenuFiltersChange: (filters: MenuFilters) => void;
}

const FOOD_TYPE_OPTIONS = [
  ["all", "All"],
  ["veg", "Veg"],
  ["non-veg", "Non-veg"],
  ["egg", "Egg"],
] as const;

const STOCK_OPTIONS = [
  ["all", "All"],
  ["in_stock", "In stock"],
  ["out_of_stock", "Out of stock"],
] as const;

const PRICE_OPTIONS = [
  ["all", "All"],
  ["under_100", "< ₹100"],
  ["100_200", "₹100–200"],
  ["over_200", "> ₹200"],
] as const;

export function MenuEditorFiltersPanel({
  menuFilters,
  onMenuFiltersChange,
}: MenuEditorFiltersPanelProps): React.JSX.Element {
  return (
    <div className="absolute right-0 top-full mt-1.5 z-30 w-72 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl p-4 space-y-4 text-left">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">Filter menu</span>
        {hasActiveFilters(menuFilters) && (
          <button
            type="button"
            onClick={() => onMenuFiltersChange(DEFAULT_MENU_FILTERS)}
            className={cn(
              "text-[10px] font-semibold hover:underline cursor-pointer",
              tokens.colors.brand,
            )}
          >
            Reset
          </button>
        )}
      </div>

      <FilterSection label="Food type">
        {FOOD_TYPE_OPTIONS.map(([value, label]) => (
          <FilterPill
            key={value}
            active={menuFilters.foodType === value}
            onClick={() => onMenuFiltersChange({ ...menuFilters, foodType: value })}
          >
            {label}
          </FilterPill>
        ))}
      </FilterSection>

      <FilterSection label="Stock status">
        {STOCK_OPTIONS.map(([value, label]) => (
          <FilterPill
            key={value}
            active={menuFilters.stockStatus === value}
            onClick={() => onMenuFiltersChange({ ...menuFilters, stockStatus: value })}
          >
            {label}
          </FilterPill>
        ))}
      </FilterSection>

      <FilterSection label="Price range">
        {PRICE_OPTIONS.map(([value, label]) => (
          <FilterPill
            key={value}
            active={menuFilters.priceRange === value}
            onClick={() => onMenuFiltersChange({ ...menuFilters, priceRange: value })}
          >
            {label}
          </FilterPill>
        ))}
      </FilterSection>

      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={menuFilters.customisableOnly}
          onChange={(e) =>
            onMenuFiltersChange({ ...menuFilters, customisableOnly: e.target.checked })
          }
          className={cn("h-3.5 w-3.5 rounded border-zinc-300", tokens.colors.brandRing)}
        />
        <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
          Customisable items only
        </span>
      </label>
    </div>
  );
}

interface FilterSectionProps {
  label: string;
  children: React.ReactNode;
}

function FilterSection({ label, children }: FilterSectionProps): React.JSX.Element {
  return (
    <div className="space-y-1.5">
      <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">
        {label}
      </span>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}
