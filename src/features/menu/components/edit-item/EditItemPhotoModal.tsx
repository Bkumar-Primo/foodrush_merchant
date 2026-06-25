"use client";

import { X } from "lucide-react";
import { BrandButton } from "@/components/common/BrandButton";
import { cn } from "@/lib/utils";
import { tokens } from "@/lib/utils/tokens";
import { EditItemPhotoGuidelinesTab } from "./EditItemPhotoGuidelinesTab";
import { EditItemPhotoUploadTab } from "./EditItemPhotoUploadTab";
import type { PhotoTab } from "./types";
import type { EditItemForm } from "./useEditItemForm";

interface EditItemPhotoModalProps {
  form: EditItemForm;
}

function photoTabClasses(active: boolean): string {
  return cn(
    "px-4 py-1.5 border-b-2 text-xs font-medium transition-all cursor-pointer",
    active
      ? cn(tokens.colors.brandBorder, tokens.colors.brand)
      : "border-transparent text-zinc-450 hover:text-zinc-700",
  );
}

export function EditItemPhotoModal({ form }: EditItemPhotoModalProps): React.JSX.Element | null {
  const {
    showPhotoModal,
    setShowPhotoModal,
    photoTab,
    setPhotoTab,
    fileInputRef,
    handleUploadClick,
    handleFileChange,
    imageSearchQuery,
    setImageSearchQuery,
    suggestedSearches,
    imageSearchError,
    isSearchingImages,
    searchResults,
    selectedStockImage,
    image,
    selectStockImage,
  } = form;

  if (!showPhotoModal) return null;

  const setTab = (tab: PhotoTab): void => setPhotoTab(tab);

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-xs select-none">
      <div className="w-full max-w-[460px] bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col p-5 space-y-4 animate-in fade-in zoom-in-95 duration-100">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-zinc-900 dark:text-white">Map photo</h3>
          <button
            type="button"
            onClick={() => setShowPhotoModal(false)}
            className="text-zinc-400 hover:text-zinc-650 dark:hover:text-zinc-200 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex border-b border-zinc-150 dark:border-zinc-800">
          <button
            type="button"
            onClick={() => setTab("guidelines")}
            className={photoTabClasses(photoTab === "guidelines")}
          >
            Photo guidelines
          </button>
          <button
            type="button"
            onClick={() => setTab("upload")}
            className={photoTabClasses(photoTab === "upload")}
          >
            Upload photos
          </button>
        </div>

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />

        {photoTab === "guidelines" ? (
          <EditItemPhotoGuidelinesTab />
        ) : (
          <EditItemPhotoUploadTab
            imageSearchQuery={imageSearchQuery}
            setImageSearchQuery={setImageSearchQuery}
            suggestedSearches={suggestedSearches}
            imageSearchError={imageSearchError}
            isSearchingImages={isSearchingImages}
            searchResults={searchResults}
            selectedStockImage={selectedStockImage}
            image={image}
            selectStockImage={selectStockImage}
            handleUploadClick={handleUploadClick}
          />
        )}

        <BrandButton
          fullWidth
          onClick={() => setShowPhotoModal(false)}
          disabled={!image}
          className={cn(
            "py-2.5 rounded-lg font-medium",
            !image &&
              "bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-555 cursor-not-allowed",
          )}
        >
          Map image
        </BrandButton>
      </div>
    </div>
  );
}
