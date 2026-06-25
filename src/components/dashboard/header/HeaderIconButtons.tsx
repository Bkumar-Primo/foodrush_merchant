"use client";

import { Bell, Settings } from "lucide-react";
import { useDashboardStore } from "@/stores/useDashboardStore";

interface HeaderIconButtonsProps {
  hasUnread: boolean;
  isUrgent: boolean;
}

export function HeaderIconButtons({
  hasUnread,
  isUrgent,
}: HeaderIconButtonsProps): React.JSX.Element {
  const { setSettingsOpen, setNotificationsOpen } = useDashboardStore();

  return (
    <div className="flex items-center gap-3 text-zinc-500 dark:text-zinc-400">
      <button
        onClick={() => setNotificationsOpen(true)}
        className="hover:text-zinc-800 dark:hover:text-zinc-200 cursor-pointer transition-colors relative"
        title="Open Notifications"
      >
        <Bell
          className={`h-4 w-4 ${isUrgent ? "animate-bounce text-red-600 dark:text-red-500" : ""}`}
        />
        {hasUnread && (
          <span className="absolute -top-1 -right-1 flex h-2 w-2">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isUrgent ? "bg-red-400" : "bg-[#F4A99A]"}`}
            />
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${isUrgent ? "bg-red-650" : "bg-primary"}`}
            />
          </span>
        )}
      </button>
      <button
        onClick={() => setSettingsOpen(true)}
        className="hover:text-zinc-800 dark:hover:text-zinc-200 cursor-pointer transition-colors"
        title="Open Settings"
      >
        <Settings className="h-4 w-4" />
      </button>
    </div>
  );
}
