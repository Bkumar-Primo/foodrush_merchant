import { ChevronDown, ChevronUp, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { tokens } from "@/lib/utils/tokens";
import type { MenuItem } from "@/types";
import { MenuEditorCategoryDropdown } from "./MenuEditorCategoryDropdown";
import { MenuEditorCategorySubcategoryRow } from "./MenuEditorCategorySubcategoryRow";

interface MenuEditorCategoryRowProps {
  category: string;
  catCount: number;
  isSelected: boolean;
  isExpanded: boolean;
  selectedSubcategory: string | null;
  customSubcategories: string[];
  inventory: MenuItem[];
  activeCategoryDropdown: string | null;
  onSelectCategory: (category: string) => void;
  onSelectSubcategory: (category: string, subcategory: string | null) => void;
  onToggleExpand: (category: string) => void;
  onCategoryDropdownChange: (category: string | null) => void;
  onAddSubcategory: (category: string) => void;
  onRenameCategory: (oldName: string, newName: string) => void;
  onDeleteCategory: (categoryName: string) => void;
}

export function MenuEditorCategoryRow({
  category,
  catCount,
  isSelected,
  isExpanded,
  selectedSubcategory,
  customSubcategories,
  inventory,
  activeCategoryDropdown,
  onSelectCategory,
  onSelectSubcategory,
  onToggleExpand,
  onCategoryDropdownChange,
  onAddSubcategory,
  onRenameCategory,
  onDeleteCategory,
}: MenuEditorCategoryRowProps): React.JSX.Element {
  const subcategories = Array.from(
    new Set([
      ...customSubcategories,
      ...inventory
        .filter((item) => item.category === category && item.subcategory)
        .flatMap((item) => (item.subcategory ? [item.subcategory] : [])),
    ]),
  );

  const isCategoryActive = isSelected && !selectedSubcategory;

  return (
    <div className="flex flex-col">
      <div
        className={cn(
          "flex items-center justify-between px-4 py-3 transition-all hover:bg-zinc-50 dark:hover:bg-zinc-955/55",
          isCategoryActive &&
            cn("bg-blue-50/30 dark:bg-indigo-950/15 border-l-2", tokens.colors.brandBorder),
        )}
      >
        <button
          type="button"
          onClick={() => onSelectSubcategory(category, null)}
          className={cn(
            "flex-1 min-w-0 text-left text-xs font-medium truncate cursor-pointer",
            isCategoryActive ? tokens.colors.brand : "text-zinc-800 dark:text-zinc-200",
          )}
        >
          {category} ({catCount})
        </button>
        <div className="flex items-center gap-1.5 shrink-0">
          <MenuEditorCategoryDropdown
            category={category}
            isOpen={activeCategoryDropdown === category}
            onToggle={() =>
              onCategoryDropdownChange(activeCategoryDropdown === category ? null : category)
            }
            onClose={() => onCategoryDropdownChange(null)}
            onRename={onRenameCategory}
            onDelete={onDeleteCategory}
            onAddSubcategory={() => {
              onSelectCategory(category);
              onAddSubcategory(category);
            }}
          />
          <button
            type="button"
            onClick={() => onToggleExpand(category)}
            className="text-zinc-400 hover:text-zinc-650 dark:hover:text-zinc-200 p-0.5 cursor-pointer"
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="pl-4 bg-zinc-50/30 dark:bg-zinc-955/5 py-1.5 space-y-0.5">
          <MenuEditorCategorySubcategoryRow
            label={`All ${category}`}
            count={catCount}
            isActive={isCategoryActive}
            onClick={() => onSelectSubcategory(category, null)}
          />
          {subcategories.map((sub) => (
            <MenuEditorCategorySubcategoryRow
              key={sub}
              label={sub}
              count={
                inventory.filter((i) => i.category === category && i.subcategory === sub).length
              }
              isActive={isSelected && selectedSubcategory === sub}
              onClick={() => onSelectSubcategory(category, sub)}
            />
          ))}
          <button
            type="button"
            onClick={() => {
              onSelectCategory(category);
              onAddSubcategory(category);
            }}
            className={cn(
              "w-full flex items-center gap-1.5 py-1.5 px-3 border-l border-zinc-200 dark:border-zinc-800 text-[10px] font-medium hover:underline cursor-pointer",
              tokens.colors.brand,
            )}
          >
            <Plus className="h-3 w-3" /> Add Subcategory
          </button>
        </div>
      )}
    </div>
  );
}
