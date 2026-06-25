import type { DayOption, RestockDuration } from "./types";

export function buildNext7Days(): DayOption[] {
  const days: DayOption[] = [];
  const locale = "en-US";
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    days.push({
      dateStr: d.toISOString().split("T")[0],
      dayName:
        i === 0
          ? "Today"
          : i === 1
            ? "Tomorrow"
            : d.toLocaleDateString(locale, { weekday: "short" }),
      dayNum: d.getDate(),
      monthName: d.toLocaleDateString(locale, { month: "short" }),
    });
  }
  return days;
}

interface CustomTimeParams {
  selectedDay: string;
  selectedHour: string;
  selectedMinute: string;
  selectedAmPm: string;
}

export function computeBackInStockTime(
  duration: RestockDuration,
  custom?: CustomTimeParams,
): number | undefined {
  if (duration === "2h") return Date.now() + 2 * 60 * 60 * 1000;
  if (duration === "4h") return Date.now() + 4 * 60 * 60 * 1000;
  if (duration === "next-day") {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(9, 0, 0, 0);
    return tomorrow.getTime();
  }
  if (duration === "custom" && custom?.selectedDay) {
    const d = new Date(custom.selectedDay);
    let hourNum = parseInt(custom.selectedHour || "12", 10);
    const minNum = parseInt(custom.selectedMinute || "00", 10);
    if (custom.selectedAmPm === "PM" && hourNum < 12) hourNum += 12;
    if (custom.selectedAmPm === "AM" && hourNum === 12) hourNum = 0;
    d.setHours(hourNum, minNum, 0, 0);
    return d.getTime();
  }
  return undefined;
}
