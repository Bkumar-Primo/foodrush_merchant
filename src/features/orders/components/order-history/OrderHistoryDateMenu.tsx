import { Calendar, ChevronDown } from "lucide-react";
import { OrderHistoryCalendarGrid } from "./OrderHistoryCalendarGrid";
import { OrderHistoryCalendarNav } from "./OrderHistoryCalendarNav";
import { OrderHistoryDatePresets } from "./OrderHistoryDatePresets";
import { OrderHistoryDateRangeInputs } from "./OrderHistoryDateRangeInputs";
import type { CalendarCell, DatePresetOrCustom } from "./types";

interface OrderHistoryDateMenuProps {
  showDateMenu: boolean;
  customStartDate: Date | null;
  customEndDate: Date | null;
  calendarMonth: number;
  calendarYear: number;
  calendarCells: CalendarCell[];
  onToggle: () => void;
  onCellClick: (date: Date) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onPresetSelect: (preset: DatePresetOrCustom, start: Date, end: Date) => void;
  onDone: () => void;
  dateLabel: string;
}

export function OrderHistoryDateMenu({
  showDateMenu,
  customStartDate,
  customEndDate,
  calendarMonth,
  calendarYear,
  calendarCells,
  onToggle,
  onCellClick,
  onPrevMonth,
  onNextMonth,
  onPresetSelect,
  onDone,
  dateLabel,
}: OrderHistoryDateMenuProps): React.JSX.Element {
  return (
    <div className="relative">
      <button
        type="button"
        onClick={onToggle}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer"
      >
        <Calendar className="h-3.5 w-3.5 text-zinc-400" />
        {dateLabel}
        <ChevronDown className="h-3 w-3 text-zinc-400" />
      </button>
      {showDateMenu && (
        <div className="absolute right-0 top-full mt-1.5 z-30 w-80 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl p-4 space-y-3 text-left">
          <OrderHistoryDateRangeInputs
            customStartDate={customStartDate}
            customEndDate={customEndDate}
          />
          <OrderHistoryCalendarNav
            calendarMonth={calendarMonth}
            calendarYear={calendarYear}
            onPrevMonth={onPrevMonth}
            onNextMonth={onNextMonth}
          />
          <OrderHistoryCalendarGrid
            calendarCells={calendarCells}
            customStartDate={customStartDate}
            customEndDate={customEndDate}
            onCellClick={onCellClick}
          />
          <OrderHistoryDatePresets
            onPresetSelect={(preset, start, end) => onPresetSelect(preset, start, end)}
            onDone={onDone}
          />
        </div>
      )}
    </div>
  );
}
