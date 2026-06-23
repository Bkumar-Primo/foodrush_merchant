import { cn } from "@/lib/utils";
import type { MenuItem } from "@/types";

type FoodType = MenuItem["foodType"];

interface FoodTypeIconProps {
  foodType: FoodType;
  size?: "sm" | "md";
}

function iconSize(size: "sm" | "md"): string {
  return size === "sm" ? "size-1.5" : "size-2";
}

export function FoodTypeIcon({ foodType, size = "sm" }: FoodTypeIconProps): React.JSX.Element {
  const dimension = iconSize(size);

  if (foodType === "veg") {
    return <span className={cn(dimension, "rounded-full bg-emerald-600")} />;
  }

  const isNonVeg = foodType === "non-veg";
  return (
    <svg
      className={cn(
        dimension,
        "shrink-0",
        isNonVeg ? "text-rose-600 fill-rose-600" : "text-amber-600 fill-amber-600",
      )}
      viewBox="0 0 10 10"
    >
      <title>{isNonVeg ? "Non-veg" : "Egg"}</title>
      <polygon points="5,1 10,9 0,9" />
    </svg>
  );
}
