"use client";

import { ChevronDown, Play, Square } from "lucide-react";
import { isRingtoneOption, RINGTONE_MAP, type RingtoneOption } from "@/stores/useDashboardStore";

interface SettingsRingtonePickerProps {
  soundEnabled: boolean;
  selectedRingtone: string;
  isPlaying: boolean;
  onRingtoneChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onPreview: () => void;
}

export function SettingsRingtonePicker({
  soundEnabled,
  selectedRingtone,
  isPlaying,
  onRingtoneChange,
  onPreview,
}: SettingsRingtonePickerProps): React.JSX.Element {
  return (
    <div className="space-y-1.5 pl-6 pt-1">
      <label
        htmlFor="ringtone-select"
        className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider"
      >
        Select ringtone
      </label>
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <select
            id="ringtone-select"
            value={selectedRingtone}
            onChange={onRingtoneChange}
            disabled={!soundEnabled}
            className="w-full appearance-none rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 pl-3 pr-8 py-2 text-xs font-semibold text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {(
              Object.entries(RINGTONE_MAP) as [RingtoneOption, { label: string; file: string }][]
            ).map(([key, { label }]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
        </div>
        <button
          onClick={onPreview}
          disabled={!soundEnabled}
          className={`flex items-center justify-center h-8 w-8 rounded-lg border transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shrink-0 ${
            isPlaying
              ? "bg-[#22c55e] border-[#22c55e] text-white hover:bg-[#16a34a]"
              : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300"
          }`}
          title={isPlaying ? "Stop preview" : "Preview ringtone"}
        >
          {isPlaying ? (
            <Square className="h-3 w-3 fill-current" />
          ) : (
            <Play className="h-3.5 w-3.5" />
          )}
        </button>
      </div>
    </div>
  );
}

export { isRingtoneOption };
