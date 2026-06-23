"use client";

import { AlertCircle } from "lucide-react";
import { FieldLabel } from "@/components/common/FieldLabel";
import { TextField } from "@/components/common/TextField";
import { cn } from "@/lib/utils";
import { tokens } from "@/lib/utils/tokens";
import { EditItemChevronSelect } from "./EditItemChevronSelect";
import { EditItemSectionHeading } from "./EditItemSectionHeading";
import type { EditItemForm } from "./useEditItemForm";

interface EditItemPricingFieldsProps {
  form: EditItemForm;
}

export function EditItemPricingFields({ form }: EditItemPricingFieldsProps): React.JSX.Element {
  const {
    price,
    setPrice,
    packagingCharge,
    setPackagingCharge,
    customChargesList,
    setShowAddChargeModal,
  } = form;

  return (
    <div className="space-y-4 pt-4 border-t border-zinc-100 dark:border-zinc-900">
      <EditItemSectionHeading>Item Pricing</EditItemSectionHeading>

      <div
        className={cn(
          "flex gap-2.5 p-3 rounded-lg border text-zinc-655 dark:text-indigo-400",
          tokens.colors.brandBgLight,
          "border-blue-200/50 dark:border-indigo-900/30",
        )}
      >
        <AlertCircle className="h-4 w-4 text-indigo-555 shrink-0 mt-0.5" />
        <div className="space-y-0.5 text-left">
          <span className={cn(tokens.fontSizes.micro, "block")}>Price Tip!</span>
          <p className="text-[9.5px] leading-relaxed font-medium">
            Customers trust brands with fair pricing. Keep same prices across menus offered for
            online ordering and in-restaurant dining.
          </p>
        </div>
      </div>

      <div className="space-y-1.5">
        <FieldLabel block>Base Price (₹)</FieldLabel>
        <TextField
          type="number"
          placeholder="0"
          value={price || ""}
          onChange={(e) => setPrice(Math.max(0, Number(e.target.value)))}
          className="font-medium"
        />
      </div>

      <div className="space-y-1.5">
        <div className="flex justify-between items-center w-full">
          <FieldLabel block>Packaging Charges</FieldLabel>
          <span className={cn("text-[10px] hover:underline cursor-pointer", tokens.colors.brand)}>
            Guidelines
          </span>
        </div>
        <EditItemChevronSelect
          value={packagingCharge}
          onChange={(e) => {
            const val = e.target.value;
            if (val === "create-custom") {
              setShowAddChargeModal(true);
              setPackagingCharge(0);
            } else {
              setPackagingCharge(Number(val));
            }
          }}
        >
          <option value={0}>Enter packaging charges (₹0)</option>
          {customChargesList.map((charge) => (
            <option key={charge.id} value={charge.amount}>
              {charge.name}
            </option>
          ))}
          <option value="create-custom" className={cn("font-semibold", tokens.colors.brand)}>
            + Create a packaging charge
          </option>
        </EditItemChevronSelect>

        {packagingCharge > 0 && (
          <div className="flex items-center gap-1.5 text-[9px] font-medium text-amber-600 dark:text-amber-500 bg-amber-50/50 dark:bg-amber-950/15 border border-amber-250 px-2.5 py-1.5 rounded-lg w-full mt-2">
            <span className="shrink-0 size-2 bg-amber-500 rounded-full" />
            <span>Please make sure that your offline and online prices match</span>
          </div>
        )}
      </div>
    </div>
  );
}
