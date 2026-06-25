import type { useDashboardStore } from "@/stores/useDashboardStore";

declare global {
  interface Window {
    dashboardStore?: typeof useDashboardStore;
  }
}
