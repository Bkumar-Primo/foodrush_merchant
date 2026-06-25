import { FieldLabel } from "@/components/common/FieldLabel";
import { TextField } from "@/components/common/TextField";
import { tokens } from "@/lib/utils/tokens";
import type { DayOption } from "./types";

interface RestockModalCustomPickerProps {
  next7Days: DayOption[];
  selectedDay: string;
  selectedHour: string;
  selectedMinute: string;
  selectedAmPm: string;
  onDaySelect: (dateStr: string) => void;
  onHourChange: (hour: string) => void;
  onMinuteChange: (minute: string) => void;
  onAmPmChange: (ampm: string) => void;
}

export function RestockModalCustomPicker({
  next7Days,
  selectedDay,
  selectedHour,
  selectedMinute,
  selectedAmPm,
  onDaySelect,
  onHourChange,
  onMinuteChange,
  onAmPmChange,
}: RestockModalCustomPickerProps): React.JSX.Element {
  return (
    <div className="pl-7 space-y-3 animate-in fade-in slide-in-from-top-1 duration-150 py-2">
      <div className="space-y-1">
        <FieldLabel block>Select Date</FieldLabel>
        <div className="grid grid-cols-4 gap-1.5 max-h-24 overflow-y-auto pr-1">
          {next7Days.map((day) => (
            <div
              key={day.dateStr}
              onClick={(e) => {
                e.stopPropagation();
                onDaySelect(day.dateStr);
              }}
              className={`border rounded-lg p-1.5 flex flex-col items-center justify-center cursor-pointer transition-all ${
                selectedDay === day.dateStr
                  ? `${tokens.colors.brandBorder} ${tokens.colors.brandBgLight} ${tokens.colors.brand}`
                  : "border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/30"
              }`}
            >
              <span className="text-[9px] font-medium text-zinc-450 dark:text-zinc-550">
                {day.dayName}
              </span>
              <span className="text-xs font-medium leading-tight">{day.dayNum}</span>
              <span className="text-[8px] font-medium text-zinc-400">{day.monthName}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-1">
        <FieldLabel block>Select Time</FieldLabel>
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <div className="flex-1">
            <TextField
              type="text"
              maxLength={2}
              value={selectedHour}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "");
                if (val === "") {
                  onHourChange("");
                  return;
                }
                const num = parseInt(val, 10);
                if (num >= 0 && num <= 12) onHourChange(val);
              }}
              onBlur={() => {
                if (!selectedHour || parseInt(selectedHour, 10) < 1) {
                  onHourChange("12");
                } else {
                  onHourChange(selectedHour.padStart(2, "0"));
                }
              }}
              className="text-center py-1.5"
              placeholder="HH"
            />
          </div>

          <span className="text-zinc-400 font-medium">:</span>

          <div className="flex-1">
            <TextField
              type="text"
              maxLength={2}
              value={selectedMinute}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "");
                if (val === "") {
                  onMinuteChange("");
                  return;
                }
                const num = parseInt(val, 10);
                if (num >= 0 && num <= 59) onMinuteChange(val);
              }}
              onBlur={() => {
                if (!selectedMinute) {
                  onMinuteChange("00");
                } else {
                  onMinuteChange(selectedMinute.padStart(2, "0"));
                }
              }}
              className="text-center py-1.5"
              placeholder="MM"
            />
          </div>

          <div className="flex rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden h-[29px] shrink-0 font-medium text-xs">
            {(["AM", "PM"] as const).map((period) => (
              <button
                key={period}
                type="button"
                onClick={() => onAmPmChange(period)}
                className={`px-3 transition-colors cursor-pointer text-[10px] ${
                  selectedAmPm === period
                    ? `${tokens.colors.brandBg} text-white`
                    : "bg-white dark:bg-zinc-955 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900"
                } ${period === "PM" ? "border-l border-zinc-200 dark:border-zinc-800" : ""}`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
