import { ArrowRight, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { tokens } from "@/lib/utils/tokens";
import type { MenuItem } from "@/types";
import { MenuEditorCategoryRow } from "./MenuEditorCategoryRow";

interface MenuEditorCategoryListProps {
  visibleCategories: string[];
  filteredInventory: MenuItem[];
  inventory: MenuItem[];
  customSubcategories: Record<string, string[]>;
  selectedCategory: string;
  selectedSubcategory: string | null;
  displayExpandedCategories: string[];
  activeCategoryDropdown: string | null;
  onSelectCategory: (category: string) => void;
  onSelectSubcategory: (category: string, subcategory: string | null) => void;
  onToggleExpand: (category: string) => void;
  onCategoryDropdownChange: (category: string | null) => void;
  onAddCategory: () => void;
  onAddSubcategory: (category: string) => void;
  onRenameCategory: (oldName: string, newName: string) => void;
  onDeleteCategory: (categoryName: string) => void;
  onGoToAddons: () => void;
}

export function MenuEditorCategoryList({
  visibleCategories,
  filteredInventory,
  inventory,
  customSubcategories,
  selectedCategory,
  selectedSubcategory,
  displayExpandedCategories,
  activeCategoryDropdown,
  onSelectCategory,
  onSelectSubcategory,
  onToggleExpand,
  onCategoryDropdownChange,
  onAddCategory,
  onAddSubcategory,
  onRenameCategory,
  onDeleteCategory,
  onGoToAddons,
}: MenuEditorCategoryListProps): React.JSX.Element {
  return (
    <div className="w-[38%] border-r border-zinc-150 dark:border-zinc-950 bg-white flex flex-col h-full overflow-hidden shrink-0">
      <div className="bg-[#F5FBFC] px-4 py-3 border-b border-zinc-150 dark:border-zinc-950 flex justify-between items-center shrink-0">
        <span className="text-xs font-medium text-zinc-900 dark:text-white">
          Categories ({visibleCategories.length})
        </span>
      </div>

      <div className="border-b border-zinc-150 dark:border-zinc-950 bg-white shrink-0">
        <button
          type="button"
          onClick={onAddCategory}
          className={cn(
            "w-full flex items-center justify-start gap-1.5 px-4 py-3 text-xs font-medium hover:bg-[#D4543C]/5 dark:hover:bg-[#D4543C]/10 cursor-pointer transition-colors",
            tokens.colors.brand,
          )}
        >
          <Plus className="h-4 w-4" /> Add Category
        </button>
      </div>

      <div className="flex-1 overflow-y-auto divide-y divide-zinc-100 dark:divide-zinc-955">
        {visibleCategories.map((cat) => (
          <MenuEditorCategoryRow
            key={cat}
            category={cat}
            catCount={filteredInventory.filter((i) => i.category === cat).length}
            isSelected={selectedCategory === cat}
            isExpanded={displayExpandedCategories.includes(cat)}
            selectedSubcategory={selectedSubcategory}
            customSubcategories={customSubcategories[cat] ?? []}
            inventory={inventory}
            activeCategoryDropdown={activeCategoryDropdown}
            onSelectCategory={onSelectCategory}
            onSelectSubcategory={onSelectSubcategory}
            onToggleExpand={onToggleExpand}
            onCategoryDropdownChange={onCategoryDropdownChange}
            onAddSubcategory={onAddSubcategory}
            onRenameCategory={onRenameCategory}
            onDeleteCategory={onDeleteCategory}
          />
        ))}
      </div>

      <div className="p-4 border-t border-zinc-150 dark:border-zinc-950 shrink-0">
        <button
          type="button"
          onClick={onGoToAddons}
          className={cn(
            "w-full flex items-center justify-between py-2 px-3 border border-[#D4543C]/40 dark:border-zinc-800 hover:bg-[#D4543C]/5 rounded-lg text-xs font-medium cursor-pointer transition-colors",
            tokens.colors.brand,
          )}
        >
          <span>Go to Add Ons</span>
          <ArrowRight className={cn("h-4 w-4", tokens.colors.brand)} />
        </button>
      </div>
    </div>
  );
}
