"use client";

import { DashboardLayoutClient } from "../DashboardLayoutClient";
import { DashboardMainContent } from "../DashboardMainContent";

/** Full dashboard stack — use when not wrapped by `(dashboard)/layout`. */
export function MerchantDashboard(): React.JSX.Element {
  return (
    <DashboardLayoutClient>
      <DashboardMainContent />
    </DashboardLayoutClient>
  );
}

export default MerchantDashboard;
