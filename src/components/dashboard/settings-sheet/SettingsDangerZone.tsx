"use client";

import { RotateCcw } from "lucide-react";
import { clearLocalDatabase } from "@/lib/db";

interface SettingsDangerZoneProps {
  onResetComplete: () => void;
}

export function SettingsDangerZone({
  onResetComplete,
}: SettingsDangerZoneProps): React.JSX.Element {
  const handleResetDb = async () => {
    const confirmReset = window.confirm(
      "Are you sure you want to clear all simulation orders? This will reset the dashboard state.",
    );
    if (confirmReset) {
      await clearLocalDatabase();
      onResetComplete();
      alert("Database successfully reset!");
    }
  };

  return (
    <div className="space-y-4">
      <h4 className="text-xs font-bold text-red-500 uppercase tracking-widest">Danger Zone</h4>
      <div className="rounded-xl border border-red-200/50 bg-red-50/10 dark:border-red-900/30 dark:bg-red-950/10 p-4 space-y-3">
        <p className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-normal">
          Resets all local client simulations, database orders, and map vectors.
        </p>
        <button
          onClick={handleResetDb}
          className="flex items-center gap-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold px-3.5 py-2 transition-colors shadow-sm cursor-pointer"
        >
          <RotateCcw className="h-3.5 w-3.5" /> Reset Local Database
        </button>
      </div>
    </div>
  );
}
