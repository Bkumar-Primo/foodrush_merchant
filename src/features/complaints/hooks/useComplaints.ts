import { useState } from "react";
import type { Complaint } from "@/types";

export const useComplaints = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([
    {
      id: "1",
      orderId: "3291",
      customerName: "Aarav Sharma",
      type: "Quality",
      text: "Food was delivered cold and container was leaking gravy.",
      status: "pending",
      time: "15m ago",
      item: "Butter Chicken Meal",
    },
    {
      id: "2",
      orderId: "4821",
      customerName: "Neha Gupta",
      type: "Missing Item",
      text: "Mango Lassi was missing from the bag.",
      status: "resolved",
      time: "2h ago",
      item: "Mango Lassi",
    },
    {
      id: "3",
      orderId: "1084",
      customerName: "Priyanka Patel",
      type: "Delivery Delay",
      text: "Delivery rider took 45 minutes after food was prepared.",
      status: "pending",
      time: "3h ago",
      item: "Special Veg Biryani",
    },
  ]);

  const resolveComplaint = (id: string) => {
    setComplaints((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: "resolved" as const } : c)),
    );
  };

  const totalTickets = complaints.length;
  const pendingTickets = complaints.filter((c) => c.status === "pending").length;
  const resolvedTickets = complaints.filter((c) => c.status === "resolved").length;

  return {
    complaints,
    resolveComplaint,
    totalTickets,
    pendingTickets,
    resolvedTickets,
  };
};

export default useComplaints;
