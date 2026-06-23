"use client";

import { Trash2 } from "lucide-react";
import { BrandButton } from "@/components/common/BrandButton";
import type { TempAddonGroup } from "@/types";
import type { EditItemForm } from "./useEditItemForm";

interface EditItemAddonGroupRowProps {
  group: TempAddonGroup;
  form: EditItemForm;
}

export function EditItemAddonGroupRow({
  group,
  form,
}: EditItemAddonGroupRowProps): React.JSX.Element {
  const {
    selectedAddonGroupIds,
    editingAddonGroupId,
    setEditingAddonGroupId,
    newInlineAddonName,
    setNewInlineAddonName,
    newInlineAddonPrice,
    setNewInlineAddonPrice,
    handleToggleAddonGroup,
    handleAddonOptionFieldChangeInline,
    handleRemoveAddonOptionInline,
    handleAddNewAddonOptionInline,
  } = form;

  const isChecked = selectedAddonGroupIds.includes(group.id);
  const isEditingOptions = editingAddonGroupId === group.id;

  return (
    <div className="border p-2.5 rounded-sm">
      <div className="flex items-center justify-between gap-2.5">
        <div
          onClick={() => handleToggleAddonGroup(group.id)}
          className="flex items-start gap-2.5 cursor-pointer flex-1 group"
        >
          <input
            type="checkbox"
            checked={isChecked}
            onChange={() => {}}
            className="mt-1 h-3.5 w-3.5 text-indigo-650 focus:ring-indigo-500 border-zinc-300 rounded cursor-pointer"
          />
          <div className="text-left">
            <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 group-hover:text-[#2563EB]">
              {group.name}
            </span>
            <span className="text-[9px] text-zinc-400 block font-medium">
              {group.options.map((o) => `${o.name} (₹${o.price})`).join(", ")}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setEditingAddonGroupId(isEditingOptions ? null : group.id)}
          className="text-[10px] font-semibold text-indigo-650 hover:underline shrink-0"
        >
          {isEditingOptions ? "Done" : "Customize"}
        </button>
      </div>

      {isEditingOptions && (
        <div className="mt-2.5 p-3 rounded-lg border border-zinc-200 bg-white space-y-2.5">
          <span className="text-[9px] font-bold text-zinc-455 uppercase block">
            Customise options
          </span>

          <div className="space-y-1.5">
            {group.options.map((opt) => (
              <div key={opt.id} className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={opt.name}
                  onChange={(e) =>
                    handleAddonOptionFieldChangeInline(group.id, opt.id, "name", e.target.value)
                  }
                  className="flex-1 rounded-md border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-[11px] focus:outline-none font-medium"
                />
                <div className="flex items-center gap-0.5 shrink-0">
                  <span className="text-[10px] text-zinc-400">₹</span>
                  <input
                    type="number"
                    value={opt.price}
                    onChange={(e) =>
                      handleAddonOptionFieldChangeInline(group.id, opt.id, "price", e.target.value)
                    }
                    className="w-12 rounded-md border border-zinc-200 bg-zinc-50 px-1 py-0.5 text-[11px] text-right focus:outline-none font-medium"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveAddonOptionInline(group.id, opt.id)}
                  className="text-zinc-450 hover:text-red-500 shrink-0 p-0.5"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-1.5 border-t border-dashed border-zinc-150 pt-2">
            <input
              type="text"
              placeholder="New item name"
              value={newInlineAddonName}
              onChange={(e) => setNewInlineAddonName(e.target.value)}
              className="flex-1 rounded-md border border-zinc-200 px-2 py-0.5 text-[11px] focus:outline-none font-medium"
            />
            <div className="flex items-center gap-0.5 shrink-0">
              <span className="text-[10px] text-zinc-400">₹</span>
              <input
                type="number"
                placeholder="0"
                value={newInlineAddonPrice || ""}
                onChange={(e) => setNewInlineAddonPrice(Math.max(0, Number(e.target.value)))}
                className="w-12 rounded-md border border-zinc-200 px-1 py-0.5 text-[11px] text-right focus:outline-none font-medium"
              />
            </div>
            <BrandButton
              onClick={() => handleAddNewAddonOptionInline(group.id)}
              className="px-2 py-0.5 rounded-sm text-[10px]"
            >
              Add
            </BrandButton>
          </div>
        </div>
      )}
    </div>
  );
}
