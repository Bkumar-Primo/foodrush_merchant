import type { Metadata } from "next";
import { SimulatorControl } from "@/features/simulator/components/SimulatorControl";
import { BRAND_METADATA } from "@/lib/constants";

export const metadata: Metadata = {
  title: BRAND_METADATA.simulateTitle,
  description: BRAND_METADATA.simulateDescription,
};

export default function SimulatePage(): React.JSX.Element {
  return <SimulatorControl />;
}
