import { Trash2 } from "lucide-react";
import { TextField } from "@/components/common/TextField";

interface MenuEditorCreateAddonOptionRowProps {
  value: string;
  price: number;
  canRemove: boolean;
  onValueChange: (value: string) => void;
  onPriceChange: (price: number) => void;
  onRemove: () => void;
}

export function MenuEditorCreateAddonOptionRow({
  value,
  price,
  canRemove,
  onValueChange,
  onPriceChange,
  onRemove,
}: MenuEditorCreateAddonOptionRowProps): React.JSX.Element {
  return (
    <div className="flex items-center gap-2">
      <TextField
        placeholder="Item name"
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        className="flex-1 py-1.5"
      />
      <div className="flex items-center gap-1">
        <span className="text-xs font-medium text-zinc-450">₹</span>
        <TextField
          type="number"
          placeholder="0"
          value={price || ""}
          onChange={(e) => onPriceChange(Math.max(0, Number(e.target.value)))}
          className="w-16 py-1.5 text-right"
        />
      </div>
      <button
        type="button"
        onClick={onRemove}
        disabled={!canRemove}
        className="text-zinc-400 hover:text-red-500 disabled:opacity-30 cursor-pointer p-1"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}
