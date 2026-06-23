import { Edit2 } from "lucide-react";
import { FoodTypeIcon } from "@/components/common/FoodTypeIcon";
import { VerifiedBadge } from "@/components/common/VerifiedBadge";
import { cn } from "@/lib/utils";
import { tokens } from "@/lib/utils/tokens";
import type { MenuItem } from "@/types";

interface MenuEditorItemRowProps {
  item: MenuItem;
  onEdit: (item: MenuItem) => void;
}

export function MenuEditorItemRow({ item, onEdit }: MenuEditorItemRowProps): React.JSX.Element {
  return (
    <div className="py-4 px-6 flex items-center justify-between gap-4 bg-white dark:bg-zinc-900 transition-colors group">
      <button
        type="button"
        onClick={() => onEdit(item)}
        className="flex items-center gap-4 min-w-0 flex-1 text-left cursor-pointer hover:bg-zinc-50/50 dark:hover:bg-zinc-950/20 -my-4 -ml-6 py-4 pl-6 pr-2"
      >
        <ItemThumbnail image={item.image} name={item.name} />
        <div className="text-left min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <FoodTypeBadge foodType={item.foodType} />
            <span className="text-xs font-semibold text-zinc-900 dark:text-white truncate">
              {item.name}
            </span>
            {item.price > 150 && <VerifiedBadge className={tokens.colors.brand} />}
          </div>
          <div className="flex items-center gap-1 text-[10px] font-semibold text-zinc-450 dark:text-zinc-500 mt-1">
            <span>₹{item.price}</span>
            {item.customisable && (
              <>
                <span>|</span>
                <span className="text-zinc-500">customisable</span>
              </>
            )}
          </div>
        </div>
      </button>

      <button
        type="button"
        onClick={() => onEdit(item)}
        className="text-zinc-400 group-hover:text-[#2563EB] p-1 rounded-lg border border-transparent group-hover:border-zinc-200 dark:group-hover:border-zinc-800 transition-colors shrink-0"
      >
        <Edit2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

interface ItemThumbnailProps {
  image: string;
  name: string;
}

function ItemThumbnail({ image, name }: ItemThumbnailProps): React.JSX.Element {
  return (
    <div className="w-14 h-14 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 overflow-hidden flex items-center justify-center shrink-0">
      {image.startsWith("http") ? (
        <img src={image} alt={name} className="w-full h-full object-cover" />
      ) : (
        <span className="text-2xl">{image}</span>
      )}
    </div>
  );
}

interface FoodTypeBadgeProps {
  foodType: MenuItem["foodType"];
}

function FoodTypeBadge({ foodType }: FoodTypeBadgeProps): React.JSX.Element {
  const borderClass =
    foodType === "veg"
      ? "border-emerald-500 bg-emerald-50/50"
      : foodType === "non-veg"
        ? "border-rose-600 bg-rose-50/50"
        : "border-amber-500 bg-amber-50/50";

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center border size-3 rounded-xs shrink-0",
        borderClass,
      )}
    >
      <FoodTypeIcon foodType={foodType} />
    </span>
  );
}
