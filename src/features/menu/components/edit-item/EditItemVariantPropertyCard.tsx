"use client";

import { Edit2, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { tokens } from "@/lib/utils/tokens";
import type { VariantPropertyItem } from "./types";

interface EditItemVariantPropertyCardProps {
  prop: VariantPropertyItem;
  canRemove: boolean;
  onNameChange: (id: string, name: string) => void;
  onRemove: (id: string) => void;
  onOptionChange: (propId: string, optIndex: number, text: string) => void;
  onRemoveOption: (propId: string, optIndex: number) => void;
  onAddOption: (propId: string) => void;
}

export function EditItemVariantPropertyCard({
  prop,
  canRemove,
  onNameChange,
  onRemove,
  onOptionChange,
  onRemoveOption,
  onAddOption,
}: EditItemVariantPropertyCardProps): React.JSX.Element {
  return (
    <div className="p-3 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900/60 relative space-y-3">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-1">
          <Edit2 className="h-3 w-3 text-zinc-400" />
          <input
            type="text"
            value={prop.name}
            onChange={(e) => onNameChange(prop.id, e.target.value)}
            className="text-xs font-semibold text-zinc-850 dark:text-zinc-200 bg-transparent border-b border-transparent hover:border-zinc-300 focus:border-indigo-500 focus:outline-none w-36"
          />
        </div>
        {canRemove && (
          <button
            type="button"
            onClick={() => onRemove(prop.id)}
            className="text-zinc-400 hover:text-red-500"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      <div className="space-y-1.5">
        {prop.options.map((opt, optIdx) => (
          <div key={optIdx} className="flex items-center gap-1.5">
            <span className="text-[9px] text-zinc-400 min-w-[65px] text-left shrink-0">
              {prop.name || "Option"} {optIdx + 1}
            </span>
            <input
              type="text"
              placeholder={`E.g. ${optIdx === 0 ? "Small" : optIdx === 1 ? "Medium" : "Option"}`}
              value={opt}
              onChange={(e) => onOptionChange(prop.id, optIdx, e.target.value)}
              className="flex-1 rounded-lg border border-zinc-200 bg-white px-2 py-1 text-xs focus:outline-none font-medium"
            />
            <button
              type="button"
              onClick={() => onRemoveOption(prop.id, optIdx)}
              disabled={prop.options.length <= 1}
              className="text-zinc-400 hover:text-red-500 disabled:opacity-20"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => onAddOption(prop.id)}
        className={cn(
          "text-[10px] font-semibold hover:underline flex items-center gap-0.5",
          tokens.colors.brand,
        )}
      >
        <Plus className="h-3 w-3" /> Add new {prop.name || "option"}
      </button>
    </div>
  );
}
