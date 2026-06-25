"use client";

import { FieldLabel } from "@/components/common/FieldLabel";
import { FoodTypeIcon } from "@/components/common/FoodTypeIcon";
import { cn } from "@/lib/utils";
import type { FoodType } from "./types";

interface EditItemFoodTypeSelectorProps {
  value: FoodType;
  onChange: (type: FoodType) => void;
}

const FOOD_TYPES: FoodType[] = ["veg", "non-veg", "egg"];

function foodTypeActiveClasses(type: FoodType): string {
  switch (type) {
    case "veg":
      return "border-emerald-500 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-400";
    case "non-veg":
      return "border-rose-500 bg-rose-50 text-rose-800 dark:bg-rose-950/20 dark:text-rose-400";
    case "egg":
      return "border-amber-500 bg-amber-50 text-amber-800 dark:bg-amber-950/20 dark:text-amber-400";
  }
}

export function EditItemFoodTypeSelector({
  value,
  onChange,
}: EditItemFoodTypeSelectorProps): React.JSX.Element {
  return (
    <div className="space-y-1.5">
      <FieldLabel>Food Type</FieldLabel>
      <div className="flex items-center gap-3">
        {FOOD_TYPES.map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => onChange(type)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 border rounded-lg text-xs font-medium transition-all cursor-pointer",
              value === type
                ? foodTypeActiveClasses(type)
                : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-955 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900",
            )}
          >
            <span className="inline-flex items-center justify-center size-2 shrink-0">
              <FoodTypeIcon foodType={type} size="md" />
            </span>
            <span className="capitalize">{type}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
