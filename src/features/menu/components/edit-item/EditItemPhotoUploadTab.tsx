"use client";

import { Search } from "lucide-react";
import { FilterPill } from "@/components/common/FilterPill";
import { cn } from "@/lib/utils";
import { tokens } from "@/lib/utils/tokens";
import type { EditItemForm } from "./useEditItemForm";

interface EditItemPhotoUploadTabProps {
  imageSearchQuery: string;
  setImageSearchQuery: (q: string) => void;
  suggestedSearches: readonly string[];
  imageSearchError: string | null;
  isSearchingImages: boolean;
  searchResults: EditItemForm["searchResults"];
  selectedStockImage: string;
  image: string;
  selectStockImage: (url: string) => void;
  handleUploadClick: () => void;
}

export function EditItemPhotoUploadTab({
  imageSearchQuery,
  setImageSearchQuery,
  suggestedSearches,
  imageSearchError,
  isSearchingImages,
  searchResults,
  selectedStockImage,
  image,
  selectStockImage,
  handleUploadClick,
}: EditItemPhotoUploadTabProps): React.JSX.Element {
  return (
    <div className="space-y-4 py-2 flex flex-col items-center">
      <div className="w-full flex items-center gap-2">
        <button
          type="button"
          onClick={handleUploadClick}
          className={cn(
            "flex-1 border border-dashed text-xs font-semibold py-2.5 rounded-lg transition-colors cursor-pointer text-center",
            tokens.colors.brandBorder,
            tokens.colors.brandBgLight,
            tokens.colors.brand,
            "hover:bg-blue-50/40",
          )}
        >
          + Upload from PC
        </button>
      </div>

      <div className="w-full space-y-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
          <input
            type="text"
            placeholder="Search free images (food, drinks, anything)..."
            value={imageSearchQuery}
            onChange={(e) => setImageSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-zinc-200 pl-8 pr-3 py-1.5 text-xs focus:outline-none font-medium"
          />
        </div>

        {!imageSearchQuery.trim() && (
          <div className="flex flex-wrap gap-1.5">
            {suggestedSearches.map((term) => (
              <FilterPill key={term} onClick={() => setImageSearchQuery(term)}>
                {term}
              </FilterPill>
            ))}
          </div>
        )}

        <p className="text-[9px] text-zinc-400 font-medium">
          Free images from Wikimedia Commons &amp; TheMealDB
        </p>

        {imageSearchError && (
          <p className="text-[10px] text-amber-600 font-medium">{imageSearchError}</p>
        )}

        <div className="grid grid-cols-4 gap-1.5 max-h-40 overflow-y-auto p-1 bg-zinc-50 border border-zinc-150 rounded-lg min-h-[88px]">
          {isSearchingImages ? (
            <div className="col-span-4 flex items-center justify-center py-6 text-[10px] text-zinc-500 font-medium">
              Searching free images...
            </div>
          ) : searchResults.length === 0 ? (
            <div className="col-span-4 flex items-center justify-center py-6 text-[10px] text-zinc-500 font-medium text-center px-2">
              {imageSearchQuery.trim()
                ? `No images found for "${imageSearchQuery}". Try a different keyword.`
                : "Search any keyword or pick a suggestion above."}
            </div>
          ) : (
            searchResults.map((img) => (
              <button
                key={img.id}
                type="button"
                onClick={() => selectStockImage(img.url)}
                className={cn(
                  "relative aspect-square rounded-md overflow-hidden cursor-pointer border-2 transition-all p-0",
                  selectedStockImage === img.url || image === img.url
                    ? tokens.colors.brandBorder
                    : "border-transparent hover:scale-95",
                )}
                title={img.name}
              >
                <img
                  src={img.thumbnail ?? img.url}
                  alt={img.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </button>
            ))
          )}
        </div>
      </div>

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
