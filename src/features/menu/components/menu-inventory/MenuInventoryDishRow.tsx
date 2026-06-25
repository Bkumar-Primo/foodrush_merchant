import { FoodTypeIcon } from "@/components/common/FoodTypeIcon";
import type { MenuItem } from "@/types";
import { InventoryStockToggle } from "./InventoryStockToggle";

interface MenuInventoryDishRowProps {
  item: MenuItem;
  onToggle: () => void;
}

export function MenuInventoryDishRow({
  item,
  onToggle,
}: MenuInventoryDishRowProps): React.JSX.Element {
  return (
    <div className="flex items-center justify-between p-4 pl-6 transition-colors hover:bg-zinc-50/20">
      <div className="flex items-center gap-2.5">
        <span
          className={`inline-flex items-center justify-center border size-3 rounded-xs shrink-0 ${
            item.foodType === "veg"
              ? "border-emerald-500 bg-emerald-50/50"
              : item.foodType === "non-veg"
                ? "border-rose-600 bg-rose-50/50"
                : "border-amber-500 bg-amber-50/50"
          }`}
        >
          <FoodTypeIcon foodType={item.foodType} />
        </span>
        <span className="text-xs font-medium text-zinc-755 dark:text-zinc-200">{item.name}</span>
      </div>
      <InventoryStockToggle inStock={item.inStock} onToggle={onToggle} />
    </div>
  );
}
