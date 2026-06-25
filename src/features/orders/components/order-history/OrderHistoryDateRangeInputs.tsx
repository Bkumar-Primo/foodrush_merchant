function formatDisplayDate(date: Date | null): string {
  if (!date) return "Select Date";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

interface OrderHistoryDateRangeInputsProps {
  customStartDate: Date | null;
  customEndDate: Date | null;
}

export function OrderHistoryDateRangeInputs({
  customStartDate,
  customEndDate,
}: OrderHistoryDateRangeInputsProps): React.JSX.Element {
  return (
    <div className="grid grid-cols-2 gap-2">
      <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-2 text-center bg-zinc-50 dark:bg-zinc-950">
        <span className="text-[9px] font-medium text-zinc-450 dark:text-zinc-500 uppercase tracking-wider block">
          Start Date
        </span>
        <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
          {formatDisplayDate(customStartDate)}
        </span>
      </div>
      <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-2 text-center bg-zinc-50 dark:bg-zinc-955">
        <span className="text-[9px] font-medium text-zinc-450 dark:text-zinc-550 uppercase tracking-wider block">
          End Date
        </span>
        <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
          {formatDisplayDate(customEndDate)}
        </span>
      </div>
    </div>
  );
}
