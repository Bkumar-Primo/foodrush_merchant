import { SlidersHorizontal } from "lucide-react";
import type { StatusFilter } from "./types";

interface OrderHistoryFilterMenuProps {
  statusFilter: StatusFilter;
  showFilterMenu: boolean;
  onToggle: () => void;
  onStatusChange: (status: StatusFilter) => void;
}

const STATUS_OPTIONS: StatusFilter[] = ["all", "delivered", "rejected"];

function statusLabel(status: StatusFilter): string {
  if (status === "all") return "All orders";
  return status;
}

export function OrderHistoryFilterMenu({
  statusFilter,
  showFilterMenu,
  onToggle,
  onStatusChange,
}: OrderHistoryFilterMenuProps): React.JSX.Element {
  return (
    <div className="relative">
      <button
        type="button"
        onClick={onToggle}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer"
      >
        <SlidersHorizontal className="h-3.5 w-3.5 text-zinc-400" />
        Filter
        {statusFilter !== "all" && <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />}
      </button>
      {showFilterMenu && (
        <div className="absolute right-0 top-full mt-1 z-20 w-36 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-lg py-1">
          {STATUS_OPTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => onStatusChange(s)}
              className={`w-full text-left px-3 py-2 text-xs font-medium capitalize hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer ${
                statusFilter === s ? "text-blue-600" : "text-zinc-700 dark:text-zinc-300"
              }`}
            >
              {statusLabel(s)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
