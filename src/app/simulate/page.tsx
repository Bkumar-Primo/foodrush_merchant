import type { Metadata } from "next";
import { SimulatorControl } from "@/features/simulator/components/SimulatorControl";

export const metadata: Metadata = {
  title: "FoodRush Order Simulator Controller",
  description: "Simulate orders in real-time from your phone to test operations.",
};

export default function SimulatePage(): React.JSX.Element {
  return <SimulatorControl />;
}
