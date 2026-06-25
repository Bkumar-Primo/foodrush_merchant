"use client";

import { Plus } from "lucide-react";
import { BrandButton } from "@/components/common/BrandButton";
import { cn } from "@/lib/utils";
import { tokens } from "@/lib/utils/tokens";
import { EditItemVariantPropertyCard } from "./EditItemVariantPropertyCard";
import type { EditItemForm } from "./useEditItemForm";

interface EditItemVariantPropertiesStepProps {
  form: EditItemForm;
}

export function EditItemVariantPropertiesStep({
  form,
}: EditItemVariantPropertiesStepProps): React.JSX.Element {
  const {
    variantProperties,
    setIsCreatingVariantInline,
    handlePropertyNameChange,
    handleRemovePropertyBlock,
    handleOptionTextChangeForProperty,
    handleRemoveOptionFromProperty,
    handleAddOptionToProperty,
    handleAddNewPropertyBlock,
    handleProceedToPricingMultiple,
  } = form;

  return (
    <>
      <div className="flex items-center justify-between border-b border-zinc-100 pb-1.5">
        <span className="text-[10px] font-medium text-zinc-500 uppercase">Define Properties</span>
        <button
          type="button"
          onClick={() => setIsCreatingVariantInline(false)}
          className="text-[10px] font-medium text-red-500 hover:underline"
        >
          Cancel
        </button>
      </div>

      <div className="space-y-4">
        {variantProperties.map((prop) => (
          <EditItemVariantPropertyCard
            key={prop.id}
            prop={prop}
            canRemove={variantProperties.length > 1}
            onNameChange={handlePropertyNameChange}
            onRemove={handleRemovePropertyBlock}
            onOptionChange={handleOptionTextChangeForProperty}
            onRemoveOption={handleRemoveOptionFromProperty}
            onAddOption={handleAddOptionToProperty}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={handleAddNewPropertyBlock}
        className="border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl p-3 flex items-center justify-center gap-1.5 cursor-pointer hover:bg-zinc-50/50 w-full"
      >
        <Plus className={cn("h-3.5 w-3.5", tokens.colors.brand)} />
        <span className={cn("text-[11px] font-medium", tokens.colors.brand)}>Add new property</span>
      </button>

      <BrandButton
        fullWidth
        onClick={handleProceedToPricingMultiple}
        className="py-2 font-medium rounded-lg"
      >
        Enter prices and review
      </BrandButton>
    </>
  );
}
