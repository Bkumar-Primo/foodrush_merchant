import { Edit2 } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import { FoodTypeIcon } from "@/components/common/FoodTypeIcon";
import { VerifiedBadge } from "@/components/common/VerifiedBadge";
import { resolveFoodCategoryImagePath } from "@/lib/constants/food-category-images";
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
        <ItemThumbnail image={item.image} name={item.name} category={item.category} />
        <div className="text-left min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <FoodTypeBadge foodType={item.foodType} />
            <span className="text-xs font-medium text-zinc-900 dark:text-white truncate">
              {item.name}
            </span>
            {item.price > 150 && <VerifiedBadge className={tokens.colors.brand} />}
          </div>
          <div className="flex items-center gap-1 text-[10px] font-medium text-zinc-450 dark:text-zinc-500 mt-1">
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
        className="text-zinc-400 group-hover:text-primary p-1 rounded-lg border border-transparent group-hover:border-zinc-200 dark:group-hover:border-zinc-800 transition-colors shrink-0"
      >
        <Edit2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

interface ItemThumbnailProps {
  image: string;
  name: string;
  category: string;
}

function ItemThumbnail({ image, name, category }: ItemThumbnailProps): React.JSX.Element {
  const categoryImage = resolveFoodCategoryImagePath(category);
  const [remoteFailed, setRemoteFailed] = useState(false);
  const showRemote = useMemo(
    () => image.startsWith("http") && !remoteFailed,
    [image, remoteFailed],
  );

  return (
    <div className="w-14 h-14 rounded-xl bg-[#F5F2EE] dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 overflow-hidden shrink-0">
      {showRemote ? (
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
          onError={() => setRemoteFailed(true)}
        />
      ) : (
        <Image
          src={categoryImage}
          alt={name}
          width={48}
          height={48}
          className="w-full h-full object-cover"
        />
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
