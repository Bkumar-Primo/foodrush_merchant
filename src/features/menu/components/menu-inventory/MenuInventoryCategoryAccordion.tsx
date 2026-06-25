import { ChevronDown, ChevronUp } from "lucide-react";
import type { MenuItem } from "@/types";
import { InventoryStockToggle } from "./InventoryStockToggle";
import { MenuInventoryDishRow } from "./MenuInventoryDishRow";

interface MenuInventoryCategoryAccordionProps {
  category: string;
  items: MenuItem[];
  isExpanded: boolean;
  isCategoryActive: boolean;
  onToggleCategory: () => void;
  onToggleExpand: () => void;
  onToggleItem: (itemId: string, itemName: string, inStock: boolean) => void;
}

export function MenuInventoryCategoryAccordion({
  category,
  items,
  isExpanded,
  isCategoryActive,
  onToggleCategory,
  onToggleExpand,
  onToggleItem,
}: MenuInventoryCategoryAccordionProps): React.JSX.Element {
  return (
    <div className="border border-zinc-200 dark:border-zinc-850 rounded-xl overflow-hidden bg-white dark:bg-zinc-900 shadow-xs">
      <div className="flex items-center justify-between p-4 bg-zinc-50/50 dark:bg-zinc-900/50 border-b border-zinc-100 dark:border-zinc-850/60">
        <span className="text-xs font-medium text-zinc-800 dark:text-zinc-200">
          {category} ({items.length})
        </span>

        <div className="flex items-center gap-3">
          <InventoryStockToggle inStock={isCategoryActive} onToggle={onToggleCategory} />
          <button
            type="button"
            onClick={onToggleExpand}
            className="text-zinc-400 hover:text-zinc-600 cursor-pointer p-0.5"
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="divide-y divide-zinc-100 dark:divide-zinc-850 bg-white dark:bg-zinc-900/40">
          {items.map((item) => (
            <MenuInventoryDishRow
              key={item.id}
              item={item}
              onToggle={() => onToggleItem(item.id, item.name, item.inStock)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
