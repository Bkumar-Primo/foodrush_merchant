import { Bell } from "lucide-react";
import { NOTIFICATIONS_COPY } from "@/components/dashboard/constants";

export function NotificationsEmptyState(): React.JSX.Element {
  return (
    <div className="flex flex-col items-center justify-center h-48 text-center space-y-2">
      <Bell className="h-8 w-8 text-zinc-350 dark:text-zinc-650" />
      <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
        {NOTIFICATIONS_COPY.emptyTitle}
      </p>
      <p className="text-[10px] text-zinc-450 dark:text-zinc-500">
        {NOTIFICATIONS_COPY.emptyDescription}
      </p>
    </div>
  );
}
