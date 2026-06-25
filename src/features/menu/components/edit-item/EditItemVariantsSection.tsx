"use client";

import { EditItemVariantListView } from "./EditItemVariantListView";
import { EditItemVariantPricingStep } from "./EditItemVariantPricingStep";
import { EditItemVariantPropertiesStep } from "./EditItemVariantPropertiesStep";
import type { EditItemForm } from "./useEditItemForm";

interface EditItemVariantsSectionProps {
  form: EditItemForm;
}

export function EditItemVariantsSection({ form }: EditItemVariantsSectionProps): React.JSX.Element {
  const { isVariantsExpanded, setIsVariantsExpanded, isCreatingVariantInline, variantStep } = form;

  return (
    <div className="border-b border-zinc-100 dark:border-zinc-900 pb-4">
      <button
        type="button"
        onClick={() => setIsVariantsExpanded(!isVariantsExpanded)}
        className="w-full flex items-center justify-between py-2 text-left focus:outline-none cursor-pointer"
      >
        <h4 className="text-xs font-medium text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
          Variants
        </h4>
        <span className="text-sm font-medium text-zinc-400 hover:text-zinc-650">
          {isVariantsExpanded ? "—" : "+"}
        </span>
      </button>

      {isVariantsExpanded && (
        <div className="mt-2 space-y-4 animate-in fade-in slide-in-from-top-1 duration-100">
          <p className="text-[9.5px] text-zinc-500 leading-relaxed font-medium">
            You can offer variations of a item, such as size/ base/ crust, etc. When customers place
            an order, they must choose at least one from the defined variants.
          </p>

          {isCreatingVariantInline ? (
            <div className="p-4 border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-zinc-50/30 dark:bg-zinc-955/20 space-y-4">
              {variantStep === 1 ? (
                <EditItemVariantPropertiesStep form={form} />
              ) : (
                <EditItemVariantPricingStep form={form} />
              )}
            </div>
          ) : (
            <EditItemVariantListView form={form} />
          )}
        </div>
      )}
    </div>
  );
}
