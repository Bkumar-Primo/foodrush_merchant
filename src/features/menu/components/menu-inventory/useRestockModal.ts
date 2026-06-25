import { useMemo, useState } from "react";
import { buildNext7Days } from "./restockUtils";
import type { DayOption, RestockDuration, RestockModalTarget } from "./types";

export function useRestockModal() {
  const [modalTarget, setModalTarget] = useState<RestockModalTarget | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<RestockDuration | null>(null);
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedHour, setSelectedHour] = useState("12");
  const [selectedMinute, setSelectedMinute] = useState("00");
  const [selectedAmPm, setSelectedAmPm] = useState("PM");

  const next7Days = useMemo((): DayOption[] => buildNext7Days(), []);

  const openRestockModal = (type: RestockModalTarget["type"], id: string, name: string): void => {
    setModalTarget({ type, id, name });
    setSelectedDuration(null);
    setSelectedDay(next7Days[0]?.dateStr ?? "");
    setSelectedHour("12");
    setSelectedMinute("00");
    setSelectedAmPm("PM");
  };

  const closeRestockModal = (): void => setModalTarget(null);

  return {
    modalTarget,
    selectedDuration,
    setSelectedDuration,
    selectedDay,
    setSelectedDay,
    selectedHour,
    setSelectedHour,
    selectedMinute,
    setSelectedMinute,
    selectedAmPm,
    setSelectedAmPm,
    next7Days,
    openRestockModal,
    closeRestockModal,
  };
}
