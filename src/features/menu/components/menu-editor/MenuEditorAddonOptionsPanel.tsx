import { HelpCircle } from "lucide-react";
import { BrandButton } from "@/components/common/BrandButton";
import { TextField } from "@/components/common/TextField";
import type { TempAddonGroup } from "@/types";
import { MenuEditorAddonOptionRow } from "./MenuEditorAddonOptionRow";
import { MenuEditorAddonPriceInput } from "./MenuEditorAddonPriceInput";

interface MenuEditorAddonOptionsPanelProps {
  selectedGroup: TempAddonGroup | null;
  addonGroups: TempAddonGroup[];
  setAddonGroups: React.Dispatch<React.SetStateAction<TempAddonGroup[]>>;
  newOptionName: string;
  newOptionPrice: number;
  onNewOptionNameChange: (name: string) => void;
  onNewOptionPriceChange: (price: number) => void;
  onClearSelection: () => void;
}

export function MenuEditorAddonOptionsPanel({
  selectedGroup,
  addonGroups,
  setAddonGroups,
  newOptionName,
  newOptionPrice,
  onNewOptionNameChange,
  onNewOptionPriceChange,
  onClearSelection,
}: MenuEditorAddonOptionsPanelProps): React.JSX.Element {
  if (!selectedGroup) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-20 text-center">
        <HelpCircle className="h-10 w-10 text-zinc-300 dark:text-zinc-700" />
        <h4 className="mt-4 text-sm font-medium text-zinc-850 dark:text-zinc-300">
          Customize Options Panel
        </h4>
        <p className="text-xs text-zinc-450 mt-1 max-w-xs leading-normal">
          Select a group on the left and click Customize to edit option items and prices.
        </p>
      </div>
    );
  }

  const updateGroups = (updater: (group: TempAddonGroup) => TempAddonGroup): void => {
    setAddonGroups(addonGroups.map((g) => (g.id === selectedGroup.id ? updater(g) : g)));
  };

  const handleDeleteGroup = (): void => {
    if (confirm(`Delete "${selectedGroup.name}" addon group globally?`)) {
      setAddonGroups(addonGroups.filter((g) => g.id !== selectedGroup.id));
      onClearSelection();
    }
  };

  const handleAddOption = (): void => {
    if (!newOptionName.trim()) return;
    const newOpt = {
      id: `add_${Date.now()}`,
      name: newOptionName.trim(),
      price: newOptionPrice || 0,
    };
    updateGroups((g) => ({ ...g, options: [...g.options, newOpt] }));
    onNewOptionNameChange("");
    onNewOptionPriceChange(0);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <div className="px-6 py-3 border-b border-zinc-150 bg-[#F5FBFC] flex justify-between items-center shrink-0">
        <span className="text-xs font-medium text-zinc-900 uppercase tracking-wider">
          CUSTOMISE OPTIONS: {selectedGroup.name}
        </span>
        <button
          type="button"
          onClick={handleDeleteGroup}
          className="text-[10px] font-semibold text-red-500 hover:underline"
        >
          Delete Group
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 max-w-lg text-left">
        <div className="space-y-3">
          {selectedGroup.options.map((opt) => (
            <MenuEditorAddonOptionRow
              key={opt.id}
              name={opt.name}
              price={opt.price}
              onNameChange={(name) =>
                updateGroups((g) => ({
                  ...g,
                  options: g.options.map((o) => (o.id === opt.id ? { ...o, name } : o)),
                }))
              }
              onPriceChange={(price) =>
                updateGroups((g) => ({
                  ...g,
                  options: g.options.map((o) => (o.id === opt.id ? { ...o, price } : o)),
                }))
              }
              onDelete={() =>
                updateGroups((g) => ({
                  ...g,
                  options: g.options.filter((o) => o.id !== opt.id),
                }))
              }
            />
          ))}
        </div>

        <div className="border-t border-dashed border-zinc-150 pt-4 space-y-3">
          <span className="text-[10px] font-bold text-zinc-400 uppercase block">
            Add new option item
          </span>
          <div className="flex items-center gap-2">
            <TextField
              placeholder="New item name"
              value={newOptionName}
              onChange={(e) => onNewOptionNameChange(e.target.value)}
              className="flex-1 py-1.5"
            />
            <MenuEditorAddonPriceInput value={newOptionPrice} onChange={onNewOptionPriceChange} />
            <BrandButton onClick={handleAddOption} className="px-3.5 py-1.5 rounded-lg shadow-xs">
              Add
            </BrandButton>
          </div>
        </div>
      </div>
    </div>
  );
}
