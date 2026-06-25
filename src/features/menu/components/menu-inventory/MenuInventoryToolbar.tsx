import { SlidersHorizontal, X } from "lucide-react";
import type { RefObject } from "react";
import { SearchInput } from "@/components/common/SearchInput";
import { tokens } from "@/lib/utils/tokens";
import type { MenuFilters } from "../../utils/menuFilters";
import { MenuInventoryFiltersPanel } from "./MenuInventoryFiltersPanel";

interface MenuInventoryToolbarProps {
  localSearch: string;
  onSearchChange: (query: string) => void;
  showFilterPanel: boolean;
  onToggleFilterPanel: () => void;
  filterPanelRef: RefObject<HTMLDivElement | null>;
  localFilters: MenuFilters;
  onFiltersChange: (filters: MenuFilters) => void;
  hasActiveFilters: boolean;
}

export function MenuInventoryToolbar({
  localSearch,
  onSearchChange,
  showFilterPanel,
  onToggleFilterPanel,
  filterPanelRef,
  localFilters,
  onFiltersChange,
  hasActiveFilters,
}: MenuInventoryToolbarProps): React.JSX.Element {
  return (
    <div className="flex justify-between items-center py-4 shrink-0">
      <div className="relative w-full sm:max-w-xs">
        <SearchInput
          placeholder="Search dishes or add-ons"
          value={localSearch}
          onChange={(e) => onSearchChange(e.target.value)}
          wrapperClassName="w-full"
          className="pl-8 pr-8 py-1.5"
        />
        {localSearch && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 cursor-pointer"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      <div className="relative" ref={filterPanelRef}>
        <button
          type="button"
          onClick={onToggleFilterPanel}
          className="flex items-center gap-1.5 border border-zinc-250 dark:border-zinc-750 bg-white dark:bg-zinc-900 hover:bg-zinc-50 px-3.5 py-1.5 rounded-lg text-xs font-medium shadow-xs cursor-pointer"
        >
          <SlidersHorizontal className="h-3.5 w-3.5" /> Filters
          {hasActiveFilters && (
            <span className={`h-1.5 w-1.5 rounded-full ${tokens.colors.brandBg}`} />
          )}
        </button>
        {showFilterPanel && (
          <MenuInventoryFiltersPanel
            localFilters={localFilters}
            onFiltersChange={onFiltersChange}
            hasActive={hasActiveFilters}
          />
        )}
      </div>
    </div>
  );
}
