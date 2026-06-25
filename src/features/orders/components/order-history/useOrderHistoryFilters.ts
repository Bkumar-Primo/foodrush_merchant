import { useMemo, useState } from "react";
import type { Order } from "@/types";
import { isTerminalOrder } from "../../utils/orderHistoryUtils";
import type { CalendarCell, DatePresetOrCustom, DateRange, StatusFilter } from "./types";

function buildDateRange(
  datePreset: DatePresetOrCustom | null,
  customStartDate: Date | null,
  customEndDate: Date | null,
): DateRange | null {
  if (!datePreset) return null;
  if (datePreset === "custom" && customStartDate && customEndDate) {
    return { start: customStartDate, end: customEndDate };
  }
  if (datePreset === "custom") return null;

  const end = new Date();
  end.setHours(23, 59, 59, 999);
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  if (datePreset === "yesterday") {
    start.setDate(start.getDate() - 1);
    end.setDate(end.getDate() - 1);
  } else if (datePreset === "7days") {
    start.setDate(start.getDate() - 6);
  } else if (datePreset === "30days") {
    start.setDate(start.getDate() - 29);
  }
  return { start, end };
}

function buildCalendarCells(calendarMonth: number, calendarYear: number): CalendarCell[] {
  const firstDayIndex = new Date(calendarYear, calendarMonth, 1).getDay();
  const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(calendarYear, calendarMonth, 0).getDate();

  const cells: CalendarCell[] = [];

  for (let i = firstDayIndex - 1; i >= 0; i--) {
    const d = new Date(calendarYear, calendarMonth - 1, daysInPrevMonth - i);
    cells.push({ date: d, isCurrentMonth: false });
  }

  for (let i = 1; i <= daysInMonth; i++) {
    const d = new Date(calendarYear, calendarMonth, i);
    cells.push({ date: d, isCurrentMonth: true });
  }

  const remaining = 42 - cells.length;
  for (let i = 1; i <= remaining; i++) {
    const d = new Date(calendarYear, calendarMonth + 1, i);
    cells.push({ date: d, isCurrentMonth: false });
  }

  return cells;
}

export function useOrderHistoryFilters(orders: Order[]) {
  const [searchQuery, setSearchQuery] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [datePreset, setDatePreset] = useState<DatePresetOrCustom | null>(null);
  const [showDateMenu, setShowDateMenu] = useState(false);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [customStartDate, setCustomStartDate] = useState<Date | null>(null);
  const [customEndDate, setCustomEndDate] = useState<Date | null>(null);
  const [calendarMonth, setCalendarMonth] = useState(10);
  const [calendarYear, setCalendarYear] = useState(2024);

  const dateRange = useMemo(
    () => buildDateRange(datePreset, customStartDate, customEndDate),
    [datePreset, customStartDate, customEndDate],
  );

  const calendarCells = useMemo(
    () => buildCalendarCells(calendarMonth, calendarYear),
    [calendarMonth, calendarYear],
  );

  const handleCellClick = (d: Date): void => {
    const clickedStart = new Date(d);
    clickedStart.setHours(0, 0, 0, 0);
    const clickedEnd = new Date(d);
    clickedEnd.setHours(23, 59, 59, 999);
    setDatePreset("custom");

    if (!customStartDate || (customStartDate && customEndDate)) {
      setCustomStartDate(clickedStart);
      setCustomEndDate(null);
    } else if (clickedStart < customStartDate) {
      setCustomStartDate(clickedStart);
      setCustomEndDate(null);
    } else {
      setCustomEndDate(clickedEnd);
    }
  };

  const handlePrevMonth = (): void => {
    if (calendarMonth === 0) {
      setCalendarMonth(11);
      setCalendarYear(calendarYear - 1);
    } else {
      setCalendarMonth(calendarMonth - 1);
    }
  };

  const handleNextMonth = (): void => {
    if (calendarMonth === 11) {
      setCalendarMonth(0);
      setCalendarYear(calendarYear + 1);
    } else {
      setCalendarMonth(calendarMonth + 1);
    }
  };

  const historyOrders = useMemo(() => {
    let list = orders.filter(isTerminalOrder);

    if (dateRange) {
      list = list.filter((o) => {
        const ts = o.updatedAt;
        return ts >= dateRange.start.getTime() && ts <= dateRange.end.getTime();
      });
    }

    if (statusFilter !== "all") {
      list = list.filter((o) => o.status === statusFilter);
    }

    if (appliedSearch.trim()) {
      const q = appliedSearch.trim().toLowerCase();
      list = list.filter(
        (o) => o.id.toLowerCase().includes(q) || o.id.slice(-4).toLowerCase().includes(q),
      );
    }

    return [...list].sort((a, b) => b.updatedAt - a.updatedAt);
  }, [orders, dateRange, statusFilter, appliedSearch]);

  const effectiveSelectedId = useMemo(() => {
    if (historyOrders.length === 0) return null;
    if (selectedId && historyOrders.some((o) => o.id === selectedId)) {
      return selectedId;
    }
    return historyOrders[0].id;
  }, [historyOrders, selectedId]);

  const selectedOrder = historyOrders.find((o) => o.id === effectiveSelectedId) ?? null;

  const applySearch = (): void => setAppliedSearch(searchQuery);

  return {
    searchQuery,
    setSearchQuery,
    applySearch,
    dateRange,
    datePreset,
    setDatePreset,
    showDateMenu,
    setShowDateMenu,
    statusFilter,
    setStatusFilter,
    showFilterMenu,
    setShowFilterMenu,
    customStartDate,
    customEndDate,
    setCustomStartDate,
    setCustomEndDate,
    calendarMonth,
    calendarYear,
    calendarCells,
    handleCellClick,
    handlePrevMonth,
    handleNextMonth,
    historyOrders,
    effectiveSelectedId,
    selectedOrder,
    setSelectedId,
  };
}
