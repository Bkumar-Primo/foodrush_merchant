"use client";

import { cn } from "@/lib/utils";
import { tokens } from "@/lib/utils/tokens";

interface EditItemPhotoUploadTabProps {
  imageSearchError: string | null;
  isUploadingImage: boolean;
  image: string;
  handleUploadClick: () => void;
  removeImageBackground: boolean;
  setRemoveImageBackground: (value: boolean) => void;
}

export function EditItemPhotoUploadTab({
  imageSearchError,
  isUploadingImage,
  image,
  handleUploadClick,
  removeImageBackground,
  setRemoveImageBackground,
}: EditItemPhotoUploadTabProps): React.JSX.Element {
  return (
    <div className="space-y-4 py-2 flex flex-col items-center">
      <div className="w-full flex items-center gap-2">
        <button
          type="button"
          onClick={handleUploadClick}
          disabled={isUploadingImage}
          className={cn(
            "flex-1 border border-dashed text-xs font-medium py-2.5 rounded-lg transition-colors cursor-pointer text-center disabled:opacity-60 disabled:cursor-not-allowed",
            tokens.colors.brandBorder,
            tokens.colors.brandBgLight,
            tokens.colors.brand,
            "hover:bg-[#D4543C]/10",
          )}
        >
          {isUploadingImage ? "Uploading & optimizing…" : "+ Upload from PC"}
        </button>
      </div>

      <label className="w-full flex items-center gap-2 text-[11px] font-medium text-zinc-600 dark:text-zinc-300">
        <input
          type="checkbox"
          checked={removeImageBackground}
          onChange={(event) => setRemoveImageBackground(event.target.checked)}
          className="size-3.5 accent-[#D4543C]"
        />
        Remove background automatically (creates transparent PNG)
      </label>

      {isUploadingImage ? (
        <p className="text-[10px] text-zinc-500 font-medium">Compressing and saving to Vercel Blob…</p>
      ) : null}
      {imageSearchError && <p className="w-full text-[10px] text-amber-600 font-medium">{imageSearchError}</p>}

      <div className="relative w-full aspect-video bg-zinc-50 dark:bg-zinc-950 border border-zinc-150 dark:border-zinc-800 rounded-lg overflow-hidden flex items-center justify-center">
        {image ? (
          <>
            <div className="absolute inset-y-0 left-[20%] w-[60%] border-x border-dashed border-white/60 z-10 pointer-events-none" />
            <img src={image} alt="crop preview" className="w-full h-full object-cover" />
          </>
        ) : (
          <span className="text-zinc-400 text-xs font-medium">No photo selected</span>
        )}
      </div>
    </div>
  );
}
