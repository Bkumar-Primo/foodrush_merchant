import { ChevronDown, ChevronUp } from "lucide-react";
import type { TempAddonGroup } from "@/types";
import { InventoryStockToggle } from "./InventoryStockToggle";
import { MenuInventoryAddonOptionRow } from "./MenuInventoryAddonOptionRow";

interface MenuInventoryAddonGroupAccordionProps {
  group: TempAddonGroup;
  isExpanded: boolean;
  isGroupActive: boolean;
  onToggleGroup: () => void;
  onToggleExpand: () => void;
  onToggleOption: (optId: string, optName: string, inStock: boolean) => void;
}

export function MenuInventoryAddonGroupAccordion({
  group,
  isExpanded,
  isGroupActive,
  onToggleGroup,
  onToggleExpand,
  onToggleOption,
}: MenuInventoryAddonGroupAccordionProps): React.JSX.Element {
  return (
    <div className="border border-zinc-200 dark:border-zinc-850 rounded-xl overflow-hidden bg-white dark:bg-zinc-900 shadow-xs">
      <div className="flex items-center justify-between p-4 bg-zinc-50/50 dark:bg-zinc-900/50 border-b border-zinc-100 dark:border-zinc-850/60">
        <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
          {group.name} ({group.options.length})
        </span>

        <div className="flex items-center gap-3">
          <InventoryStockToggle inStock={isGroupActive} onToggle={onToggleGroup} />
          <button
            type="button"
            onClick={onToggleExpand}
            className="text-zinc-400 hover:text-zinc-650 cursor-pointer p-0.5"
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="divide-y divide-zinc-100 dark:divide-zinc-850 bg-white dark:bg-zinc-900/40">
          {group.options.map((opt) => {
            const optInStock = opt.inStock !== false;
            return (
              <MenuInventoryAddonOptionRow
                key={opt.id}
                name={opt.name}
                price={opt.price}
                inStock={optInStock}
                onToggle={() => onToggleOption(opt.id, opt.name, optInStock)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
