"use client";

import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { tokens } from "@/lib/utils/tokens";
import { EditItemAddonGroupRow } from "./EditItemAddonGroupRow";
import type { EditItemForm } from "./useEditItemForm";

interface EditItemAddonsSectionProps {
  form: EditItemForm;
}

export function EditItemAddonsSection({ form }: EditItemAddonsSectionProps): React.JSX.Element {
  const {
    isAddonsExpanded,
    setIsAddonsExpanded,
    mappedAddons,
    searchAddonQuery,
    setSearchAddonQuery,
    filteredAddonGroups,
    setShowAddAddonGroupModal,
  } = form;

  return (
    <div className="pb-4">
      <button
        type="button"
        onClick={() => setIsAddonsExpanded(!isAddonsExpanded)}
        className="w-full flex items-center justify-between py-2 text-left focus:outline-none cursor-pointer"
      >
        <h4 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
          Map Addons
        </h4>
        <span className="text-sm font-semibold text-zinc-400 hover:text-zinc-650">
          {isAddonsExpanded ? "—" : "+"}
        </span>
      </button>

      {isAddonsExpanded && (
        <div className="mt-2 space-y-4 animate-in fade-in slide-in-from-top-1 duration-100">
          <p className="text-[9.5px] text-zinc-500 leading-relaxed font-medium">
            Add-ons enhance the customer experience by offering extra choices like toppings or
            desserts.
          </p>

          {mappedAddons.length > 0 && (
            <div className="p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-150 dark:border-zinc-850 rounded-lg text-left space-y-1">
              <span className="text-[9px] font-semibold text-zinc-455 uppercase block">
                Currently Mapped Addons
              </span>
              <p className="text-[10px] font-medium text-zinc-700 dark:text-zinc-300">
                {mappedAddons.map((a) => `${a.name} (+₹${a.price})`).join(", ")}
              </p>
            </div>
          )}

          <div className="space-y-3 bg-zinc-50/50 dark:bg-zinc-950/20 p-4 border border-zinc-150 dark:border-zinc-850 rounded-2xl">
            <div className="flex items-center justify-between gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Search addon group..."
                  value={searchAddonQuery}
                  onChange={(e) => setSearchAddonQuery(e.target.value)}
                  className="w-full rounded-lg border border-zinc-200 bg-white px-7 py-1 text-xs focus:outline-none font-medium"
                />
              </div>
              <button
                type="button"
                onClick={() => setShowAddAddonGroupModal(true)}
                className={cn(
                  "text-[10px] font-semibold hover:underline shrink-0",
                  tokens.colors.brand,
                )}
              >
                + Create New Group
              </button>
            </div>

            <div className="space-y-3 max-h-72 overflow-y-auto">
              {filteredAddonGroups.map((group) => (
                <EditItemAddonGroupRow key={group.id} group={group} form={form} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
