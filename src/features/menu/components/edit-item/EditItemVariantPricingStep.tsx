"use client";

import { BrandButton } from "@/components/common/BrandButton";
import { cn } from "@/lib/utils";
import { tokens } from "@/lib/utils/tokens";
import type { EditItemForm } from "./useEditItemForm";

interface EditItemVariantPricingStepProps {
  form: EditItemForm;
}

export function EditItemVariantPricingStep({
  form,
}: EditItemVariantPricingStepProps): React.JSX.Element {
  const {
    variantProperties,
    variantPrices,
    setVariantStep,
    setIsCreatingVariantInline,
    handleVariantPriceChange,
    handleSaveVariantsMultiple,
  } = form;

  return (
    <>
      <div className="flex items-center justify-between border-b border-zinc-100 pb-1.5">
        <span className="text-[10px] font-medium text-zinc-500 uppercase">Set Prices</span>
        <button
          type="button"
          onClick={() => setVariantStep(1)}
          className={cn("text-[10px] font-medium hover:underline", tokens.colors.brand)}
        >
          Edit properties
        </button>
      </div>

      <div className="space-y-4 max-h-64 overflow-y-auto pr-1">
        {variantProperties.map((prop) => (
          <div key={prop.id} className="space-y-2">
            <span className="text-[10px] font-medium text-zinc-650 uppercase block">
              {prop.name}
            </span>
            <div className="space-y-1.5">
              {prop.options
                .filter((o) => o.trim() !== "")
                .map((opt, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between py-1.5 border-b border-zinc-100"
                  >
                    <span className="text-xs font-medium text-zinc-700">{opt}</span>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] text-zinc-400">+ ₹</span>
                      <input
                        type="number"
                        placeholder="0"
                        value={variantPrices[prop.id]?.[opt] || ""}
                        onChange={(e) =>
                          handleVariantPriceChange(prop.id, opt, Number(e.target.value))
                        }
                        className="w-16 rounded-lg border border-zinc-200 bg-white px-2 py-1 text-xs text-right focus:outline-none font-medium"
                      />
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setIsCreatingVariantInline(false)}
          className="flex-1 py-2 border border-zinc-200 text-zinc-500 rounded-lg text-xs font-medium text-center"
        >
          Discard
        </button>
        <BrandButton
          onClick={handleSaveVariantsMultiple}
          className="flex-1 py-2 font-medium rounded-lg"
        >
          Save Variants
        </BrandButton>
      </div>
    </>
  );
}
