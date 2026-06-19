import { Suspense } from "react";
import MerchantDashboard from "@/components/layouts/MerchantDashboard";

export const unstable_instant = {
  prefetch: "static",
  unstable_disableValidation: true,
};

export default function Home() {
  return (
    <Suspense fallback={<div>Loading dashboard...</div>}>
      <MerchantDashboard />
    </Suspense>
  );
}
