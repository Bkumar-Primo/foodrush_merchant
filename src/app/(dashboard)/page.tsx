import { DashboardMainContent } from "@/components/dashboard/DashboardMainContent";

export const unstable_instant = {
  prefetch: "static",
  unstable_disableValidation: true,
};

export default function DashboardPage(): React.JSX.Element {
  return <DashboardMainContent />;
}
