interface InventoryStockToggleProps {
  inStock: boolean;
  onToggle: () => void;
}

export function InventoryStockToggle({
  inStock,
  onToggle,
}: InventoryStockToggleProps): React.JSX.Element {
  return (
    <div className="flex items-center gap-2">
      <span
        className={`text-[10px] font-semibold ${inStock ? "text-emerald-600" : "text-zinc-450"}`}
      >
        {inStock ? "In stock" : "Out of stock"}
      </span>
      <button
        type="button"
        onClick={onToggle}
        className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer focus:outline-none flex items-center ${
          inStock ? "bg-emerald-500 justify-end" : "bg-zinc-300 justify-start"
        }`}
      >
        <span className="w-4 h-4 rounded-full bg-white shadow-sm shrink-0" />
      </button>
    </div>
  );
}
