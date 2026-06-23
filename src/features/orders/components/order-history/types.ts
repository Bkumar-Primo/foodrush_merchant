import type { Order } from "@/types";

export interface OrderHistoryPageProps {
  orders: Order[];
}

export type DatePreset = "today" | "yesterday" | "7days" | "30days";

export type DatePresetOrCustom = DatePreset | "custom";

export type StatusFilter = "all" | "delivered" | "rejected";

export interface DateRange {
  start: Date;
  end: Date;
}

export interface CalendarCell {
  date: Date;
  isCurrentMonth: boolean;
}
