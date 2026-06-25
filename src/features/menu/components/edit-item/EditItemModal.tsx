"use client";

import { X } from "lucide-react";
import { BrandButton } from "@/components/common/BrandButton";
import { Sheet, SheetClose, SheetContent } from "@/components/ui/sheet";
import { EditItemAddonGroupModal } from "./EditItemAddonGroupModal";
import { EditItemAddonsSection } from "./EditItemAddonsSection";
import { EditItemBasicFields } from "./EditItemBasicFields";
import { EditItemPackagingChargeModal } from "./EditItemPackagingChargeModal";
import { EditItemPhotoModal } from "./EditItemPhotoModal";
import { EditItemPricingFields } from "./EditItemPricingFields";
import { EditItemVariantsSection } from "./EditItemVariantsSection";
import type { EditItemModalProps } from "./types";
import { useEditItemForm } from "./useEditItemForm";

const NUMBER_INPUT_STYLES = `
  input[type="number"]::-webkit-outer-spin-button,
  input[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  input[type="number"] {
    -moz-appearance: textfield;
  }
`;

export function EditItemModal({
  isOpen,
  item,
  categories,
  categorySubcategories,
  onClose,
  onSave,
  addonGroups,
  setAddonGroups,
}: EditItemModalProps): React.JSX.Element {
  const form = useEditItemForm({
    isOpen,
    item,
    categories,
    categorySubcategories,
    onClose,
    onSave,
    addonGroups,
    setAddonGroups,
  });

  const { name, handleSave } = form;
  const canSave = Boolean(name.trim());

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <style>{NUMBER_INPUT_STYLES}</style>

      <SheetContent
        side="right"
        showCloseButton={false}
        className="w-full sm:max-w-[560px] flex flex-col p-0 h-full overflow-hidden bg-white dark:bg-zinc-955 border-l border-zinc-200 dark:border-zinc-850"
      >
        <div className="flex-1 flex flex-col h-full bg-white dark:bg-zinc-900 select-none relative">
          <div className="px-6 py-2.5 border-b border-zinc-100 dark:border-zinc-900 flex items-center justify-between shrink-0">
            <h2 className="text-base font-medium text-zinc-900 dark:text-white">
              {item ? `Edit: ${item.name}` : "Add Item Details"}
            </h2>
            <SheetClose asChild>
              <button
                type="button"
                className="text-zinc-550 hover:text-zinc-800 dark:hover:text-zinc-200 cursor-pointer p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <X className="h-5 w-5" />
              </button>
            </SheetClose>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6 text-left">
            <EditItemBasicFields form={form} categories={categories} />
            <EditItemPricingFields form={form} />
            <div className="space-y-4 pt-4 border-t border-zinc-100 dark:border-zinc-900">
              <EditItemVariantsSection form={form} />
              <EditItemAddonsSection form={form} />
            </div>
          </div>

          <div className="px-6 py-4 border-t border-zinc-150 dark:border-zinc-850 bg-white dark:bg-zinc-900 flex items-center justify-end gap-3 shrink-0">
            <SheetClose asChild>
              <button
                type="button"
                className="px-4 py-2 text-xs font-medium text-red-500 hover:bg-red-50/50 dark:hover:bg-red-955/15 rounded-lg transition-colors cursor-pointer"
              >
                Discard
              </button>
            </SheetClose>
            <BrandButton onClick={handleSave} disabled={!canSave} className="px-5 py-2 rounded-lg">
              Save Changes
            </BrandButton>
          </div>

          <EditItemPackagingChargeModal form={form} />
          <EditItemAddonGroupModal form={form} />
          <EditItemPhotoModal form={form} />
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default EditItemModal;
