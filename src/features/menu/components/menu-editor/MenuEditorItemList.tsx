import { AlertCircle, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { tokens } from "@/lib/utils/tokens";
import type { MenuItem } from "@/types";
import { hasActiveFilters, type MenuFilters } from "../../utils/menuFilters";
import { MenuEditorItemRow } from "./MenuEditorItemRow";

interface MenuEditorItemListProps {
  resolvedCategory: string;
  selectedSubcategory: string | null;
  activeItems: MenuItem[];
  searchQuery: string;
  menuFilters: MenuFilters;
  onAddItem: () => void;
  onEditItem: (item: MenuItem) => void;
}

export function MenuEditorItemList({
  resolvedCategory,
  selectedSubcategory,
  activeItems,
  searchQuery,
  menuFilters,
  onAddItem,
  onEditItem,
}: MenuEditorItemListProps): React.JSX.Element {
  const breadcrumb = selectedSubcategory
    ? `${resolvedCategory} > ${selectedSubcategory}`
    : resolvedCategory;

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#F9FAFB] dark:bg-zinc-955/20">
      <div className="px-6 py-3 border-b border-zinc-150 dark:border-zinc-950 bg-[#F5FBFC] flex justify-between items-center shrink-0">
        <span className="text-xs font-medium text-zinc-900 dark:text-white">
          {breadcrumb} ({activeItems.length})
        </span>
      </div>

      <div className="border-b border-zinc-150 dark:border-zinc-950 bg-white shrink-0">
        <button
          type="button"
          onClick={onAddItem}
          className={cn(
            "w-full flex items-center justify-start gap-1.5 px-6 py-3 text-xs font-medium hover:bg-[#D4543C]/5 dark:hover:bg-[#D4543C]/10 cursor-pointer transition-colors",
            tokens.colors.brand,
          )}
        >
          <Plus className="h-4 w-4" /> Add New Item
        </button>
      </div>

      <div className="flex-1 overflow-y-auto bg-white dark:bg-zinc-900 divide-y divide-zinc-100 dark:divide-zinc-800">
        {activeItems.length === 0 ? (
          <EmptyItemsState searchQuery={searchQuery} menuFilters={menuFilters} />
        ) : (
          activeItems.map((item) => (
            <MenuEditorItemRow key={item.id} item={item} onEdit={onEditItem} />
          ))
        )}
      </div>
    </div>
  );
}

interface EmptyItemsStateProps {
  searchQuery: string;
  menuFilters: MenuFilters;
}

function EmptyItemsState({ searchQuery, menuFilters }: EmptyItemsStateProps): React.JSX.Element {
  const hasFilters = Boolean(searchQuery) || hasActiveFilters(menuFilters);

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center space-y-2">
      <AlertCircle className="h-8 w-8 text-zinc-300 dark:text-zinc-700" />
      <p className="text-xs font-medium text-zinc-500">No items found</p>
      <p className="text-[10px] text-zinc-400">
        {hasFilters
          ? "Try adjusting your search or filters."
          : "Click Add New Item to register dishes here."}
      </p>
    </div>
  );
}
