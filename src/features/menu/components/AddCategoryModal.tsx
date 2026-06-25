"use client";

import { X } from "lucide-react";
import type React from "react";
import { useState } from "react";

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNext: (name: string) => void;
}

export const AddCategoryModal: React.FC<AddCategoryModalProps> = ({ isOpen, onClose, onNext }) => {
  const [categoryName, setCategoryName] = useState("");
  const maxLength = 45;

  if (!isOpen) return null;

  const handleNext = () => {
    if (categoryName.trim()) {
      onNext(categoryName.trim());
      setCategoryName("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && categoryName.trim()) {
      handleNext();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none">
      <div className="w-full max-w-[420px] bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-5 space-y-5 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-zinc-900 dark:text-white">Category name</h3>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Input */}
        <div className="relative">
          <input
            type="text"
            placeholder="Eg. Desserts"
            value={categoryName}
            maxLength={maxLength}
            onChange={(e) => setCategoryName(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full rounded-lg border border-zinc-250 dark:border-zinc-750 bg-white dark:bg-zinc-950 px-3 py-2.5 text-xs text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-primary transition-all pr-12"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-medium text-zinc-400 dark:text-zinc-550">
            {categoryName.length} / {maxLength}
          </span>
        </div>

        {/* Next Button */}
        <button
          onClick={handleNext}
          disabled={!categoryName.trim()}
          className={`w-full py-2 rounded-lg text-xs font-medium transition-all cursor-pointer text-center ${
            categoryName.trim()
              ? "bg-primary hover:bg-[#B8433A] text-primary-foreground"
              : "bg-zinc-150 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-550 cursor-not-allowed"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AddCategoryModal;
