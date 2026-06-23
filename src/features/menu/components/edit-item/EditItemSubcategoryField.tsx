"use client";

import { FieldLabel } from "@/components/common/FieldLabel";
import { TextField } from "@/components/common/TextField";
import { cn } from "@/lib/utils";
import { tokens } from "@/lib/utils/tokens";
import { EditItemChevronSelect } from "./EditItemChevronSelect";

interface EditItemSubcategoryFieldProps {
  subcategory: string;
  setSubcategory: (value: string) => void;
  isCreatingNewSubcategory: boolean;
  setIsCreatingNewSubcategory: (value: boolean) => void;
  subcategoryOptions: string[];
}

export function EditItemSubcategoryField({
  subcategory,
  setSubcategory,
  isCreatingNewSubcategory,
  setIsCreatingNewSubcategory,
  subcategoryOptions,
}: EditItemSubcategoryFieldProps): React.JSX.Element {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <FieldLabel>Menu Subcategory (Optional)</FieldLabel>
        {isCreatingNewSubcategory && (
          <button
            type="button"
            onClick={() => {
              setIsCreatingNewSubcategory(false);
              setSubcategory("");
            }}
            className={cn(
              "text-[10px] font-semibold hover:underline cursor-pointer",
              tokens.colors.brand,
            )}
          >
            Select existing subcategory
          </button>
        )}
      </div>
      {isCreatingNewSubcategory ? (
        <TextField
          type="text"
          placeholder="Enter new subcategory name"
          value={subcategory}
          onChange={(e) => setSubcategory(e.target.value)}
          className="font-medium"
        />
      ) : (
        <EditItemChevronSelect
          value={subcategory}
          onChange={(e) => {
            const val = e.target.value;
            if (val === "__new__") {
              setIsCreatingNewSubcategory(true);
              setSubcategory("");
            } else {
              setSubcategory(val);
            }
          }}
        >
          <option value="">None (No Subcategory)</option>
          {subcategoryOptions.map((sub) => (
            <option key={sub} value={sub}>
              {sub}
            </option>
          ))}
          <option value="__new__" className={cn("font-semibold", tokens.colors.brand)}>
            + Create New Subcategory...
          </option>
        </EditItemChevronSelect>
      )}
    </div>
  );
}
