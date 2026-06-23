import { AlertCircle, AlertTriangle, CircleCheck, Info } from "lucide-react";

export type NotificationType = "success" | "info" | "warning" | "error";

export function NotificationTypeIcon({ type }: { type: NotificationType }): React.JSX.Element {
  switch (type) {
    case "success":
      return <CircleCheck className="h-4 w-4 text-emerald-500 shrink-0" />;
    case "info":
      return <Info className="h-4 w-4 text-blue-500 shrink-0" />;
    case "warning":
      return <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />;
    case "error":
      return <AlertCircle className="h-4 w-4 text-rose-500 shrink-0" />;
  }
}

export function formatNotificationSeconds(totalSeconds: number): string {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}
