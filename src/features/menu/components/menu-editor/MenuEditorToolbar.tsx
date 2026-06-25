import { SlidersHorizontal, X } from "lucide-react";
import type { RefObject } from "react";
import { BrandButton } from "@/components/common/BrandButton";
import { SearchInput } from "@/components/common/SearchInput";
import { cn } from "@/lib/utils";
import { tokens } from "@/lib/utils/tokens";
import { hasActiveFilters, type MenuFilters } from "../../utils/menuFilters";
import { MenuEditorFiltersPanel } from "./MenuEditorFiltersPanel";

interface MenuEditorToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  searchPlaceholder: string;
  showFilterPanel: boolean;
  onToggleFilterPanel: () => void;
  filterPanelRef: RefObject<HTMLDivElement | null>;
  menuFilters: MenuFilters;
  onMenuFiltersChange: (filters: MenuFilters) => void;
  onSubmit: () => void;
}

export function MenuEditorToolbar({
  searchQuery,
  onSearchChange,
  searchPlaceholder,
  showFilterPanel,
  onToggleFilterPanel,
  filterPanelRef,
  menuFilters,
  onMenuFiltersChange,
  onSubmit,
}: MenuEditorToolbarProps): React.JSX.Element {
  return (
    <div className="flex justify-between items-center px-6 py-4">
      <div className="relative w-full sm:max-w-xs">
        <SearchInput
          placeholder={searchPlaceholder}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          wrapperClassName="w-full"
          className="pl-8 pr-8 py-1.5"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 cursor-pointer"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
        <div className="relative" ref={filterPanelRef}>
          <button
            type="button"
            onClick={onToggleFilterPanel}
            className="flex items-center gap-1.5 border border-zinc-250 dark:border-zinc-750 bg-white dark:bg-zinc-900 hover:bg-zinc-50 px-3.5 py-1.5 rounded-lg text-xs font-medium text-zinc-700 dark:text-zinc-300 cursor-pointer shadow-xs"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" /> Filters
            {hasActiveFilters(menuFilters) && (
              <span className={cn("h-1.5 w-1.5 rounded-full", tokens.colors.brandBg)} />
            )}
          </button>
          {showFilterPanel && (
            <MenuEditorFiltersPanel
              menuFilters={menuFilters}
              onMenuFiltersChange={onMenuFiltersChange}
            />
          )}
        </div>
        <BrandButton
          onClick={onSubmit}
          className="px-4 py-1.5 rounded-lg shadow-xs active:scale-95"
        >
          Submit Changes
        </BrandButton>
      </div>
    </div>
  );
}
