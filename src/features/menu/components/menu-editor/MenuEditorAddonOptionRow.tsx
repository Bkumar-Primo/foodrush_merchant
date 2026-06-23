import { Trash2 } from "lucide-react";
import { TextField } from "@/components/common/TextField";
import { MenuEditorAddonPriceInput } from "./MenuEditorAddonPriceInput";

interface MenuEditorAddonOptionRowProps {
  name: string;
  price: number;
  onNameChange: (name: string) => void;
  onPriceChange: (price: number) => void;
  onDelete: () => void;
}

export function MenuEditorAddonOptionRow({
  name,
  price,
  onNameChange,
  onPriceChange,
  onDelete,
}: MenuEditorAddonOptionRowProps): React.JSX.Element {
  return (
    <div className="flex items-center gap-2">
      <TextField
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
        className="flex-1 py-1.5"
      />
      <MenuEditorAddonPriceInput value={price} onChange={onPriceChange} />
      <button
        type="button"
        onClick={onDelete}
        className="text-zinc-400 hover:text-red-500 cursor-pointer p-1"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}
