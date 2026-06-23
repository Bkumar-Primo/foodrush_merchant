import { X } from "lucide-react";
import { BrandButton } from "@/components/common/BrandButton";
import { RestockModalDurationOptions } from "./RestockModalDurationOptions";
import type { DayOption, RestockDuration } from "./types";

interface RestockModalProps {
  onClose: () => void;
  onConfirm: () => void;
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

export function RestockModal({
  onClose,
  onConfirm,
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
}: RestockModalProps): React.JSX.Element {
  const isConfirmDisabled = !selectedDuration || (selectedDuration === "custom" && !selectedDay);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-xs select-none">
      <div className="w-full max-w-[460px] bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-6 flex flex-col space-y-4 animate-in fade-in zoom-in-95 duration-100">
        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
            When will this be back in stock?
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-650 dark:hover:text-zinc-200 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <RestockModalDurationOptions
          selectedDuration={selectedDuration}
          onDurationSelect={onDurationSelect}
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

        <div className="pt-2">
          <BrandButton
            fullWidth
            onClick={onConfirm}
            disabled={isConfirmDisabled}
            className="py-2.5 disabled:opacity-80"
          >
            confirm
          </BrandButton>
        </div>
      </div>
    </div>
  );
}
