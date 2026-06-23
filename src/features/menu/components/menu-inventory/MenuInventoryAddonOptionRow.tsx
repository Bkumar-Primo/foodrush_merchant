import { InventoryStockToggle } from "./InventoryStockToggle";

interface MenuInventoryAddonOptionRowProps {
  name: string;
  price: number;
  inStock: boolean;
  onToggle: () => void;
}

export function MenuInventoryAddonOptionRow({
  name,
  price,
  inStock,
  onToggle,
}: MenuInventoryAddonOptionRowProps): React.JSX.Element {
  return (
    <div className="flex items-center justify-between p-4 pl-6 transition-colors hover:bg-zinc-50/20">
      <span className="text-xs font-semibold text-zinc-755 dark:text-zinc-200">
        {name} (+₹{price})
      </span>
      <InventoryStockToggle inStock={inStock} onToggle={onToggle} />
    </div>
  );
}
