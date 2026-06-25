import { ChevronLeft, ChevronRight } from "lucide-react";

interface OrderHistoryCalendarNavProps {
  calendarMonth: number;
  calendarYear: number;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

export function OrderHistoryCalendarNav({
  calendarMonth,
  calendarYear,
  onPrevMonth,
  onNextMonth,
}: OrderHistoryCalendarNavProps): React.JSX.Element {
  return (
    <div className="flex items-center justify-between py-1">
      <button
        type="button"
        onClick={onPrevMonth}
        className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg cursor-pointer"
      >
        <ChevronLeft className="h-4 w-4 text-zinc-500" />
      </button>
      <span className="text-xs font-medium text-zinc-800 dark:text-zinc-200">
        {new Date(calendarYear, calendarMonth).toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        })}
      </span>
      <button
        type="button"
        onClick={onNextMonth}
        className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg cursor-pointer"
      >
        <ChevronRight className="h-4 w-4 text-zinc-500" />
      </button>
    </div>
  );
}
