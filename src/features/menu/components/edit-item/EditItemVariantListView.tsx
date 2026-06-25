"use client";

import { Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { tokens } from "@/lib/utils/tokens";
import type { VariantTemplate } from "./types";
import type { EditItemForm } from "./useEditItemForm";

const TEMPLATES: VariantTemplate[] = ["Size", "Quantity", "PrepType", "Base"];

const TEMPLATE_LABELS: Record<VariantTemplate, string> = {
  Size: "Size",
  Quantity: "Quantity",
  PrepType: "Preparation Type",
  Base: "Base",
};

const TEMPLATE_HINTS: Record<VariantTemplate, string> = {
  Size: "E.g. Small, Medium, Large",
  Quantity: "E.g. Quarter, Half, Full",
  PrepType: "E.g. Halal, Non halal",
  Base: "E.g. Thin, Thick crust",
};

interface EditItemVariantListViewProps {
  form: EditItemForm;
}

export function EditItemVariantListView({ form }: EditItemVariantListViewProps): React.JSX.Element {
  const { variants, handleRemoveVariant, startNewVariant, handleSelectTemplate } = form;

  return (
    <>
      {variants.length > 0 && (
        <div className="space-y-2">
          {variants.map((v) => (
            <div
              key={v.id}
              className="p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-lg flex items-center justify-between gap-4"
            >
              <div className="text-left space-y-0.5">
                <span className="text-xs font-medium text-zinc-850 dark:text-zinc-200">
                  {v.name}
                </span>
                <p className="text-[10px] font-medium text-zinc-450 dark:text-zinc-500">
                  {v.options.map((opt) => `${opt.name} (+₹${opt.price})`).join(", ")}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveVariant(v.id)}
                className="text-zinc-400 hover:text-red-500 cursor-pointer p-1"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={startNewVariant}
        className="border border-dashed border-zinc-205 dark:border-zinc-800/80 rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-zinc-50/50 w-full"
      >
        <span
          className={cn(
            "size-8 rounded-full flex items-center justify-center",
            tokens.colors.brandBgLight,
            tokens.colors.brand,
          )}
        >
          <Plus className="h-4 w-4" />
        </span>
        <span className={cn("text-xs font-medium", tokens.colors.brand)}>Create a new variant</span>
      </button>

      <div className="space-y-2.5 pt-1">
        <span className="text-[9.5px] font-medium text-zinc-400 uppercase tracking-wide block">
          Not sure about variant properties? Select from following templates
        </span>
        <div className="grid grid-cols-2 gap-3">
          {TEMPLATES.map((t) => (
            <div
              key={t}
              className="p-3 border border-zinc-150 dark:border-zinc-850 rounded-xl text-left bg-white dark:bg-zinc-900/30 flex flex-col justify-between h-24"
            >
              <div>
                <span className="text-xs font-medium text-zinc-800 dark:text-zinc-200 block">
                  {TEMPLATE_LABELS[t]}
                </span>
                <span className="text-[9px] text-zinc-400 leading-normal block mt-0.5 font-medium">
                  {TEMPLATE_HINTS[t]}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleSelectTemplate(t)}
                className={cn(
                  "text-[10px] font-medium hover:underline self-start mt-1 cursor-pointer",
                  tokens.colors.brand,
                )}
              >
                Add Property
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
