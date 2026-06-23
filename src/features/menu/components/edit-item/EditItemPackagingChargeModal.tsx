"use client";

import { X } from "lucide-react";
import { BrandButton } from "@/components/common/BrandButton";
import { FieldLabel } from "@/components/common/FieldLabel";
import { TextField } from "@/components/common/TextField";
import type { EditItemForm } from "./useEditItemForm";

interface EditItemPackagingChargeModalProps {
  form: EditItemForm;
}

export function EditItemPackagingChargeModal({
  form,
}: EditItemPackagingChargeModalProps): React.JSX.Element | null {
  const {
    showAddChargeModal,
    setShowAddChargeModal,
    newChargeName,
    setNewChargeName,
    newChargeAmount,
    setNewChargeAmount,
    handleCreateCharge,
  } = form;

  if (!showAddChargeModal) return null;

  return (
    <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-6 select-none">
      <div className="w-full max-w-[380px] bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col p-5 space-y-4 animate-in fade-in zoom-in-95 duration-100">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-white text-left">
            Create custom packaging charge
          </h3>
          <button
            type="button"
            onClick={() => setShowAddChargeModal(false)}
            className="text-zinc-400 hover:text-zinc-650 dark:hover:text-zinc-200 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="text-[10px] text-zinc-450 leading-relaxed text-left">
          You will be taken to charges creation page. Any unsaved progress in the current page will
          be lost. (Save your custom packaging charge below to bind it to this session!)
        </p>

        <div className="space-y-1 text-left">
          <FieldLabel block>Charge Display Name</FieldLabel>
          <TextField
            type="text"
            placeholder="Eg. Premium Packing, Paper Bag"
            value={newChargeName}
            onChange={(e) => setNewChargeName(e.target.value)}
            className="py-1.5"
          />
        </div>

        <div className="space-y-1 text-left">
          <FieldLabel block>Charge Amount (₹)</FieldLabel>
          <TextField
            type="number"
            placeholder="0"
            value={newChargeAmount || ""}
            onChange={(e) => setNewChargeAmount(Math.max(0, Number(e.target.value)))}
            className="py-1.5"
          />
        </div>

        <BrandButton
          fullWidth
          onClick={handleCreateCharge}
          disabled={!newChargeName.trim() || newChargeAmount <= 0}
          className="py-2.5 font-semibold rounded-lg shadow-xs disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Create packaging charge
        </BrandButton>
      </div>
    </div>
  );
}
