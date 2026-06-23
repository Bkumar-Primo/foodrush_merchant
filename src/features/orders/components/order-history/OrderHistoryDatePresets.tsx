import { tokens } from "@/lib/utils/tokens";
import type { DatePreset } from "./types";

interface OrderHistoryDatePresetsProps {
  onPresetSelect: (preset: DatePreset, start: Date, end: Date) => void;
  onDone: () => void;
}

const PRESETS: { key: DatePreset; label: string }[] = [
  { key: "today", label: "Today" },
  { key: "yesterday", label: "Yesterday" },
  { key: "7days", label: "Last 7 days" },
  { key: "30days", label: "Last 30 days" },
];

function buildPresetRange(preset: DatePreset): { start: Date; end: Date } {
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  if (preset === "yesterday") {
    start.setDate(start.getDate() - 1);
    end.setDate(end.getDate() - 1);
  } else if (preset === "7days") {
    start.setDate(start.getDate() - 6);
  } else if (preset === "30days") {
    start.setDate(start.getDate() - 29);
  }
  return { start, end };
}

export function OrderHistoryDatePresets({
  onPresetSelect,
  onDone,
}: OrderHistoryDatePresetsProps): React.JSX.Element {
  return (
    <div className="border-t border-zinc-150 dark:border-zinc-800 pt-2 flex flex-wrap gap-1.5 justify-center">
      {PRESETS.map((preset) => (
        <button
          key={preset.key}
          type="button"
          onClick={() => {
            const { start, end } = buildPresetRange(preset.key);
            onPresetSelect(preset.key, start, end);
          }}
          className="px-2 py-0.5 rounded border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-955 text-[9px] font-semibold text-zinc-550 dark:text-zinc-450 hover:bg-zinc-50 dark:hover:bg-zinc-900 cursor-pointer"
        >
          {preset.label}
        </button>
      ))}
      <button
        type="button"
        onClick={onDone}
        className={`px-2 py-0.5 rounded ${tokens.colors.brandBg} text-white text-[9px] font-semibold cursor-pointer ml-auto`}
      >
        Done
      </button>
    </div>
  );
}
