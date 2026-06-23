import { Star } from "lucide-react";

interface OrderHistoryRatingBadgeProps {
  rating: number;
}

export function OrderHistoryRatingBadge({
  rating,
}: OrderHistoryRatingBadgeProps): React.JSX.Element {
  return (
    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#1C6B3C] text-white">
      {rating} <Star className="h-2.5 w-2.5 fill-white" />
    </span>
  );
}
