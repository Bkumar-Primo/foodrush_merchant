import { TextField } from "@/components/common/TextField";

interface MenuEditorAddonPriceInputProps {
  value: number;
  onChange: (price: number) => void;
}

export function MenuEditorAddonPriceInput({
  value,
  onChange,
}: MenuEditorAddonPriceInputProps): React.JSX.Element {
  return (
    <div className="flex items-center gap-1">
      <span className="text-xs text-zinc-400">₹</span>
      <TextField
        type="number"
        value={value}
        onChange={(e) => onChange(Math.max(0, Number(e.target.value)))}
        className="w-16 py-1.5 text-right"
      />
    </div>
  );
}
