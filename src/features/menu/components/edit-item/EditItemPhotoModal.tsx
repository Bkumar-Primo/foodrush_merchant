"use client";

import { BrandButton } from "@/components/common/BrandButton";
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
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
    "flex-1 px-3 py-2 border-b-2 text-xs font-medium transition-all cursor-pointer text-center",
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
    imageSearchError,
    isUploadingImage,
    image,
    removeImageBackground,
    setRemoveImageBackground,
  } = form;

  const setTab = (tab: PhotoTab): void => setPhotoTab(tab);

  return (
    <Sheet open={showPhotoModal} onOpenChange={setShowPhotoModal}>
      <SheetContent side="right" showCloseButton={false} className="w-full sm:max-w-lg p-0">
        <SheetHeader className="px-5 py-4 border-b border-zinc-150 dark:border-zinc-800 shrink-0 flex flex-row items-center justify-between">
          <SheetTitle className="text-base font-medium text-zinc-900 dark:text-white">Map photo</SheetTitle>
          <SheetClose asChild>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md border border-zinc-200 dark:border-zinc-700 px-2 py-1 text-xs font-medium text-zinc-500 hover:text-zinc-700 dark:text-zinc-300 dark:hover:text-zinc-100 bg-transparent"
            >
              Close
            </button>
          </SheetClose>
        </SheetHeader>

        <div className="flex border-b border-zinc-150 dark:border-zinc-800 px-5 gap-1">
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

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {photoTab === "guidelines" ? (
            <EditItemPhotoGuidelinesTab />
          ) : (
            <EditItemPhotoUploadTab
              imageSearchError={imageSearchError}
              isUploadingImage={isUploadingImage}
              image={image}
              handleUploadClick={handleUploadClick}
              removeImageBackground={removeImageBackground}
              setRemoveImageBackground={setRemoveImageBackground}
            />
          )}
        </div>

        <div className="px-5 py-4 border-t border-zinc-150 dark:border-zinc-800 shrink-0">
          <BrandButton
            fullWidth
            onClick={() => setShowPhotoModal(false)}
            disabled={!image || isUploadingImage}
            className={cn(
              "py-2.5 rounded-lg font-medium",
              !image &&
                "bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-555 cursor-not-allowed",
            )}
          >
            Map image
          </BrandButton>
        </div>
      </SheetContent>
    </Sheet>
  );
}
