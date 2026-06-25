"use client";

import { Plus, Trash2, X } from "lucide-react";
import { BrandButton } from "@/components/common/BrandButton";
import { FieldLabel } from "@/components/common/FieldLabel";
import { TextField } from "@/components/common/TextField";
import { cn } from "@/lib/utils";
import { tokens } from "@/lib/utils/tokens";
import type { EditItemForm } from "./useEditItemForm";

interface EditItemAddonGroupModalProps {
  form: EditItemForm;
}

export function EditItemAddonGroupModal({
  form,
}: EditItemAddonGroupModalProps): React.JSX.Element | null {
  const {
    showAddAddonGroupModal,
    setShowAddAddonGroupModal,
    newAddonGroupName,
    setNewAddonGroupName,
    newAddonGroupOptionsText,
    newAddonGroupPrices,
    setNewAddonGroupPrices,
    handleAddAddonOptionInput,
    handleAddonOptionTextChange,
    handleRemoveAddonOptionInput,
    handleCreateAddonGroup,
  } = form;

  if (!showAddAddonGroupModal) return null;

  return (
    <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-6 select-none animate-in fade-in duration-100">
      <div className="w-full max-w-[450px] bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col p-5 space-y-4 max-h-[85%] overflow-y-auto animate-in zoom-in-95 duration-100">
        <div className="flex items-center justify-between shrink-0">
          <h3 className="text-sm font-medium text-zinc-900 dark:text-white">Create Addon Group</h3>
          <button
            type="button"
            onClick={() => setShowAddAddonGroupModal(false)}
            className="text-zinc-400 hover:text-zinc-650 dark:hover:text-zinc-200 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-1.5 text-left shrink-0">
          <FieldLabel block>Group Name</FieldLabel>
          <TextField
            type="text"
            placeholder="E.g. Extra toppings"
            value={newAddonGroupName}
            onChange={(e) => setNewAddonGroupName(e.target.value)}
            className="py-2"
          />
        </div>

        <div className="space-y-3 pt-3 border-t border-zinc-100 overflow-y-auto">
          <div className="flex justify-between items-center text-left">
            <FieldLabel>Addon Items & Prices</FieldLabel>
            <button
              type="button"
              onClick={handleAddAddonOptionInput}
              className={cn(
                "text-xs font-medium flex items-center gap-0.5 hover:underline",
                tokens.colors.brand,
              )}
            >
              <Plus className="h-3.5 w-3.5" /> Add
            </button>
          </div>

          <div className="space-y-2">
            {newAddonGroupOptionsText.map((opt, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <TextField
                  type="text"
                  placeholder="Item name"
                  value={opt}
                  onChange={(e) => handleAddonOptionTextChange(idx, e.target.value)}
                  className="flex-1 py-1.5 font-medium"
                />
                <div className="flex items-center gap-1">
                  <span className="text-xs font-medium text-zinc-450">₹</span>
                  <TextField
                    type="number"
                    placeholder="0"
                    value={newAddonGroupPrices[opt] || ""}
                    onChange={(e) => {
                      setNewAddonGroupPrices({
                        ...newAddonGroupPrices,
                        [opt]: Math.max(0, Number(e.target.value)),
                      });
                    }}
                    className="w-16 py-1.5 text-right font-medium"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveAddonOptionInput(idx)}
                  disabled={newAddonGroupOptionsText.length <= 1}
                  className="text-zinc-400 hover:text-red-500 disabled:opacity-30 cursor-pointer p-1"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <BrandButton
          fullWidth
          onClick={handleCreateAddonGroup}
          disabled={
            !newAddonGroupName.trim() ||
            newAddonGroupOptionsText.filter((o) => o.trim() !== "").length === 0
          }
          className="py-2.5 font-medium rounded-lg shadow-xs disabled:opacity-40 shrink-0"
        >
          Create & Select Group
        </BrandButton>
      </div>
    </div>
  );
}
