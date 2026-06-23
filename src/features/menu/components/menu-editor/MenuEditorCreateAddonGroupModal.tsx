import { Plus } from "lucide-react";
import { BrandButton } from "@/components/common/BrandButton";
import { FieldLabel } from "@/components/common/FieldLabel";
import { TextField } from "@/components/common/TextField";
import { cn } from "@/lib/utils";
import { tokens } from "@/lib/utils/tokens";
import type { TempAddonGroup } from "@/types";
import { MenuEditorCreateAddonGroupModalHeader } from "./MenuEditorCreateAddonGroupModalHeader";
import { MenuEditorCreateAddonOptionRow } from "./MenuEditorCreateAddonOptionRow";

interface MenuEditorCreateAddonGroupModalProps {
  isOpen: boolean;
  groupName: string;
  options: string[];
  prices: Record<string, number>;
  onGroupNameChange: (name: string) => void;
  onOptionsChange: (options: string[]) => void;
  onPricesChange: (prices: Record<string, number>) => void;
  onClose: () => void;
  onCreate: (group: TempAddonGroup) => void;
}

export function MenuEditorCreateAddonGroupModal({
  isOpen,
  groupName,
  options,
  prices,
  onGroupNameChange,
  onOptionsChange,
  onPricesChange,
  onClose,
  onCreate,
}: MenuEditorCreateAddonGroupModalProps): React.JSX.Element | null {
  if (!isOpen) return null;

  const validOptions = options.filter((o) => o.trim() !== "");
  const canCreate = groupName.trim() !== "" && validOptions.length > 0;

  const handleCreate = (): void => {
    if (!canCreate) return;
    const groupId = `grp_${Date.now()}`;
    onCreate({
      id: groupId,
      name: groupName.trim(),
      options: validOptions.map((o, i) => ({
        id: `add_${groupId}_${i}`,
        name: o.trim(),
        price: prices[o] ?? 0,
      })),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-xs select-none">
      <div className="w-full max-w-[460px] bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-5 space-y-4 animate-in fade-in zoom-in-95 duration-100">
        <MenuEditorCreateAddonGroupModalHeader onClose={onClose} />

        <div className="space-y-1.5 text-left shrink-0">
          <FieldLabel block>Group Name</FieldLabel>
          <TextField
            placeholder="E.g. Extra toppings"
            value={groupName}
            onChange={(e) => onGroupNameChange(e.target.value)}
          />
        </div>

        <div className="space-y-3 pt-3 border-t border-zinc-100 overflow-y-auto">
          <div className="flex justify-between items-center text-left">
            <FieldLabel>Addon Items & Prices</FieldLabel>
            <button
              type="button"
              onClick={() => onOptionsChange([...options, ""])}
              className={cn(
                "text-xs font-medium flex items-center gap-0.5 hover:underline",
                tokens.colors.brand,
              )}
            >
              <Plus className="h-3.5 w-3.5" /> Add
            </button>
          </div>

          <div className="space-y-2">
            {options.map((opt, idx) => (
              <MenuEditorCreateAddonOptionRow
                key={idx}
                value={opt}
                price={prices[opt] ?? 0}
                canRemove={options.length > 1}
                onValueChange={(value) => {
                  const next = [...options];
                  next[idx] = value;
                  onOptionsChange(next);
                }}
                onPriceChange={(price) => onPricesChange({ ...prices, [opt]: price })}
                onRemove={() => onOptionsChange(options.filter((_, i) => i !== idx))}
              />
            ))}
          </div>
        </div>

        <BrandButton
          fullWidth
          disabled={!canCreate}
          onClick={handleCreate}
          className="py-2.5 rounded-lg shadow-xs text-center shrink-0"
        >
          Create Group
        </BrandButton>
      </div>
    </div>
  );
}
