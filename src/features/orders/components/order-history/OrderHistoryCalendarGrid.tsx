import { tokens } from "@/lib/utils/tokens";
import type { CalendarCell } from "./types";

interface OrderHistoryCalendarGridProps {
  calendarCells: CalendarCell[];
  customStartDate: Date | null;
  customEndDate: Date | null;
  onCellClick: (date: Date) => void;
}

function dayTime(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

export function OrderHistoryCalendarGrid({
  calendarCells,
  customStartDate,
  customEndDate,
  onCellClick,
}: OrderHistoryCalendarGridProps): React.JSX.Element {
  const startDayTime = customStartDate ? dayTime(customStartDate) : null;
  const endDayTime = customEndDate ? dayTime(customEndDate) : null;

  return (
    <>
      <div className="grid grid-cols-7 gap-y-1 text-center">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <span key={day} className="text-[9px] font-bold text-zinc-400">
            {day}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-1 text-center">
        {calendarCells.map((cell, idx) => {
          const cellDayTime = dayTime(cell.date);
          const isSelectedStart = startDayTime !== null && cellDayTime === startDayTime;
          const isSelectedEnd = endDayTime !== null && cellDayTime === endDayTime;
          const isInRange =
            startDayTime !== null &&
            endDayTime !== null &&
            cellDayTime >= startDayTime &&
            cellDayTime <= endDayTime;

          return (
            <div
              key={idx}
              onClick={() => onCellClick(cell.date)}
              className={`flex items-center justify-center p-1 cursor-pointer select-none text-[10px] relative ${
                cell.isCurrentMonth
                  ? "text-zinc-800 dark:text-zinc-200 font-semibold"
                  : "text-zinc-350 dark:text-zinc-650"
              }`}
            >
              {isInRange && !isSelectedStart && !isSelectedEnd && (
                <div className="absolute inset-y-0.5 inset-x-0 bg-blue-50/50 dark:bg-indigo-950/20" />
              )}
              <span
                className={`h-6 w-6 flex items-center justify-center rounded-full transition-all relative z-10 ${
                  isSelectedStart || isSelectedEnd
                    ? `${tokens.colors.brandBg} text-white font-bold`
                    : cell.isCurrentMonth
                      ? "hover:bg-zinc-100 dark:hover:bg-zinc-800"
                      : ""
                }`}
              >
                {cell.date.getDate()}
              </span>
            </div>
          );
        })}
      </div>
    </>
  );
}
