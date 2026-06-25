"use client";

import { XIcon } from "lucide-react";
import type React from "react";
import { useState } from "react";

interface NeedMoreTimeModalProps {
  onClose: () => void;
  onSubmit: (extraTime: number) => Promise<void>;
}

export const NeedMoreTimeModal: React.FC<NeedMoreTimeModalProps> = ({ onClose, onSubmit }) => {
  const [extraTime, setExtraTime] = useState(10); // Default to 10 mins as requested
  const [isSubmitting, setIsSubmitting] = useState(false);

  const incrementTime = () => setExtraTime((prev) => Math.min(prev + 5, 60));
  const decrementTime = () => setExtraTime((prev) => Math.max(prev - 5, 5));

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await onSubmit(extraTime);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none">
      <div className="w-full max-w-[400px] bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200/80 dark:border-zinc-800/80 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-5 py-3.5 flex items-center justify-between border-b border-zinc-150 dark:border-zinc-800">
          <span className="font-medium text-sm text-zinc-900 dark:text-white">Need more time</span>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-650 dark:hover:text-zinc-200 cursor-pointer"
          >
            <XIcon className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <p className="text-[11px] font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
            Select extra preparation time
          </p>

          {/* Selector */}
          <div className="flex items-center w-full border border-zinc-250 dark:border-zinc-750 rounded-lg overflow-hidden h-9">
            <button
              onClick={decrementTime}
              disabled={isSubmitting}
              className="flex items-center justify-center hover:bg-zinc-50 dark:hover:bg-zinc-800 h-full w-14 text-base font-medium text-zinc-555 border-r border-zinc-200 dark:border-zinc-750 cursor-pointer transition-colors disabled:opacity-50"
            >
              -
            </button>
            <div className="flex-1 text-xs font-medium text-zinc-800 dark:text-zinc-200 h-full flex items-center justify-center bg-white dark:bg-zinc-900">
              {extraTime} mins
            </div>
            <button
              onClick={incrementTime}
              disabled={isSubmitting}
              className="flex items-center justify-center hover:bg-zinc-50 dark:hover:bg-zinc-800 h-full w-14 text-base font-medium text-zinc-555 border-l border-zinc-200 dark:border-zinc-750 cursor-pointer transition-colors disabled:opacity-50"
            >
              +
            </button>
          </div>

          {/* Action */}
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full h-10 bg-[#249B5E] hover:bg-[#1E8650] text-white rounded-md py-2.5 text-xs font-medium transition-all cursor-pointer text-center disabled:opacity-50 active:scale-[0.99] flex items-center justify-center"
          >
            {isSubmitting ? (
              <span className="flex h-4 items-center justify-center gap-1.5">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-white animate-dot-pulse [animation-delay:0ms]" />
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-white animate-dot-pulse [animation-delay:200ms]" />
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-white animate-dot-pulse [animation-delay:400ms]" />
              </span>
            ) : (
              "Submit"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NeedMoreTimeModal;
