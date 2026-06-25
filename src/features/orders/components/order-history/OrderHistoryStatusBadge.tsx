import type { Order } from "@/types";

interface OrderHistoryStatusBadgeProps {
  status: Order["status"];
}

export function OrderHistoryStatusBadge({
  status,
}: OrderHistoryStatusBadgeProps): React.JSX.Element | null {
  if (status === "delivered") {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wide bg-[#0C9E9E] text-white">
        Delivered
      </span>
    );
  }
  if (status === "rejected") {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wide bg-[#E23744] text-white">
        Rejected
      </span>
    );
  }
  return null;
}
