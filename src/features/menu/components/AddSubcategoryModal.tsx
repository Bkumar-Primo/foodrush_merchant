"use client";

import { X } from "lucide-react";
import type React from "react";
import { useState } from "react";

interface AddSubcategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSkip: () => void;
  onDone: (name: string) => void;
}

export const AddSubcategoryModal: React.FC<AddSubcategoryModalProps> = ({
  isOpen,
  onClose,
  onSkip,
  onDone,
}) => {
  const [subName, setSubName] = useState("");

  if (!isOpen) return null;

  const handleDone = () => {
    if (subName.trim()) {
      onDone(subName.trim());
      setSubName("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && subName.trim()) {
      handleDone();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none">
      <div className="w-full max-w-[420px] bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-5 space-y-5 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-zinc-900 dark:text-white">Subcategory name</h3>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Input */}
        <div>
          <input
            type="text"
            placeholder="Eg. Ice Creams"
            value={subName}
            onChange={(e) => setSubName(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full rounded-lg border border-zinc-250 dark:border-zinc-750 bg-white dark:bg-zinc-955 px-3 py-2.5 text-xs text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={onSkip}
            className="flex-1 py-2 rounded-lg text-xs font-medium border border-[#2563EB] text-[#2563EB] hover:bg-blue-50/30 dark:hover:bg-blue-950/10 cursor-pointer text-center transition-all"
          >
            Skip
          </button>
          <button
            onClick={handleDone}
            disabled={!subName.trim()}
            className={`flex-1 py-2 rounded-lg text-xs font-medium text-center transition-all cursor-pointer ${
              subName.trim()
                ? "bg-[#2563EB] hover:bg-[#1D4ED8] text-white"
                : "bg-zinc-150 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-555 cursor-not-allowed"
            }`}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddSubcategoryModal;
