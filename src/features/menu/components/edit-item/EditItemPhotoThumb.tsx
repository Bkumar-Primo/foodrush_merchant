"use client";

import { Plus } from "lucide-react";
import { FieldLabel } from "@/components/common/FieldLabel";
import { cn } from "@/lib/utils";
import { tokens } from "@/lib/utils/tokens";

interface EditItemPhotoThumbProps {
  image: string;
  onClick: () => void;
}

export function EditItemPhotoThumb({ image, onClick }: EditItemPhotoThumbProps): React.JSX.Element {
  return (
    <div className="space-y-1.5">
      <FieldLabel block>Item Photos</FieldLabel>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onClick}
          className={cn(
            "w-16 h-16 rounded-xl border-2 border-dashed border-zinc-200 dark:border-zinc-800",
            tokens.colors.brandBorder,
            "hover:border-[#D4543C]/55 hover:bg-[#D4543C]/5 dark:hover:bg-[#D4543C]/10",
            "bg-zinc-50/30 dark:bg-zinc-950/20 overflow-hidden flex flex-col items-center justify-center shrink-0 transition-all cursor-pointer relative group",
          )}
        >
          {image ? (
            <>
              <img src={image} alt="dish" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-[9px] text-white font-medium">Edit</span>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center text-zinc-450 dark:text-zinc-500">
              <Plus className="h-4.5 w-4.5" />
            </div>
          )}
        </button>
        {!image && (
          <span className="text-xs text-zinc-400 dark:text-zinc-500 font-medium">
            Add a photo of this dish
          </span>
        )}
      </div>
    </div>
  );
}
