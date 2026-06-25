import { Printer } from "lucide-react";

interface NewOrderPrepTimeSectionProps {
  prepTime: number;
  onIncrement: () => void;
  onDecrement: () => void;
}

export function NewOrderPrepTimeSection({
  prepTime,
  onIncrement,
  onDecrement,
}: NewOrderPrepTimeSectionProps): React.JSX.Element {
  return (
    <div className="px-4 py-3 space-y-2.5 bg-white dark:bg-zinc-900">
      <div className="flex justify-between items-center">
        <span className="text-[9.5px] font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
          Set food preparation time
        </span>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            className="inline-flex items-center gap-1 border border-[#F4A99A] hover:bg-[#D4543C]/10 text-primary dark:border-[#D4543C]/40 dark:hover:bg-[#D4543C]/15 px-2 py-0.5 rounded text-[9.5px] font-medium cursor-pointer transition-colors"
          >
            <Printer className="h-3 w-3" /> KOT
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1 border border-[#F4A99A] hover:bg-[#D4543C]/10 text-primary dark:border-[#D4543C]/40 dark:hover:bg-[#D4543C]/15 px-2 py-0.5 rounded text-[9.5px] font-medium cursor-pointer transition-colors"
          >
            <Printer className="h-3 w-3" /> ORDER
          </button>
        </div>
      </div>

      <div className="flex items-center w-full border border-zinc-250 dark:border-zinc-750 rounded-lg overflow-hidden h-8">
        <button
          type="button"
          onClick={onDecrement}
          className="flex items-center justify-center hover:bg-zinc-50 dark:hover:bg-zinc-800 h-full w-12 text-sm font-medium text-zinc-555 border-r border-zinc-250 dark:border-zinc-750 cursor-pointer transition-colors"
        >
          -
        </button>
        <div className="flex-1 text-xs font-medium text-zinc-800 dark:text-zinc-200 h-full flex items-center justify-center bg-white dark:bg-zinc-900">
          {prepTime} mins
        </div>
        <button
          type="button"
          onClick={onIncrement}
          className="flex items-center justify-center hover:bg-zinc-50 dark:hover:bg-zinc-800 h-full w-12 text-sm font-medium text-zinc-555 border-l border-zinc-250 dark:border-zinc-750 cursor-pointer transition-colors"
        >
          +
        </button>
      </div>
    </div>
  );
}
