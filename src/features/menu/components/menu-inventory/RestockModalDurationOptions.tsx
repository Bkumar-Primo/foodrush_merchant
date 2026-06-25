import { FieldLabel } from "@/components/common/FieldLabel";
import { tokens } from "@/lib/utils/tokens";
import { RestockModalCustomPicker } from "./RestockModalCustomPicker";
import type { DayOption, RestockDuration } from "./types";

interface RestockModalDurationOptionsProps {
  selectedDuration: RestockDuration | null;
  onDurationSelect: (duration: RestockDuration) => void;
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

const DURATION_OPTIONS: { value: RestockDuration; label: string }[] = [
  { value: "2h", label: "2 Hours" },
  { value: "4h", label: "4 Hours" },
  { value: "next-day", label: "Next business day" },
  { value: "custom", label: "Custom date & time (upto 7 days)" },
];

export function RestockModalDurationOptions({
  selectedDuration,
  onDurationSelect,
  next7Days,
  selectedDay,
  selectedHour,
  selectedMinute,
  selectedAmPm,
  onDaySelect,
  onHourChange,
  onMinuteChange,
  onAmPmChange,
}: RestockModalDurationOptionsProps): React.JSX.Element {
  return (
    <>
      <FieldLabel block>Auto turn on item after</FieldLabel>
      <div className="space-y-3.5 py-1 text-left">
        {DURATION_OPTIONS.map((opt) => (
          <div key={opt.value} className="space-y-2">
            <div
              onClick={() => onDurationSelect(opt.value)}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div
                className={`size-4 rounded-full border flex items-center justify-center transition-all ${
                  selectedDuration === opt.value
                    ? tokens.colors.brandBorder
                    : "border-zinc-300 dark:border-zinc-700 group-hover:border-zinc-450"
                }`}
              >
                {selectedDuration === opt.value && (
                  <span className={`size-2.5 rounded-full ${tokens.colors.brandBg}`} />
                )}
              </div>
              <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                {opt.label}
              </span>
            </div>

            {opt.value === "custom" && selectedDuration === "custom" && (
              <RestockModalCustomPicker
                next7Days={next7Days}
                selectedDay={selectedDay}
                selectedHour={selectedHour}
                selectedMinute={selectedMinute}
                selectedAmPm={selectedAmPm}
                onDaySelect={onDaySelect}
                onHourChange={onHourChange}
                onMinuteChange={onMinuteChange}
                onAmPmChange={onAmPmChange}
              />
            )}
          </div>
        ))}
      </div>
    </>
  );
}
