"use client";

import { Check, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { tokens } from "@/lib/utils/tokens";

export function EditItemPhotoGuidelinesTab(): React.JSX.Element {
  return (
    <div className="space-y-4 py-2 text-left max-h-[300px] overflow-y-auto">
      <div className="space-y-2">
        <span className="text-xs font-medium text-emerald-650 flex items-center gap-1.5">
          <Check className="h-4.5 w-4.5" /> High-quality photo guidelines
        </span>
        <ul className="list-disc pl-5 text-[11px] text-zinc-500 space-y-1.5 font-medium">
          <li>Ensure lighting is bright, clear, and natural. Avoid harsh shadows.</li>
          <li>Angle the dish at 45 degrees to capture both height and toppings.</li>
          <li>Keep the background clean and minimalist. Avoid messy setups.</li>
          <li>Avoid pixelated, low-resolution, or blurred shots.</li>
          <li>No watermarks, overlay text, or branding on the picture.</li>
        </ul>
      </div>
      <div className="p-3 bg-zinc-50 border border-zinc-150 rounded-xl flex gap-2">
        <HelpCircle className={cn("h-4.5 w-4.5 shrink-0 mt-0.5", tokens.colors.brand)} />
        <p className="text-[10px] text-zinc-500 leading-relaxed font-medium">
          FoodRush review systems prioritize dishes with correct guidelines. Approved items gain up
          to 30% higher conversion rates.
        </p>
      </div>
    </div>
  );
}
