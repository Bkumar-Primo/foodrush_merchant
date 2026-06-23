import { ClipboardList } from "lucide-react";

interface OrdersTabEmptyStateProps {
  tabLabel: string;
}

export function OrdersTabEmptyState({ tabLabel }: OrdersTabEmptyStateProps): React.JSX.Element {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <ClipboardList className="h-12 w-12 text-zinc-300 dark:text-zinc-700 stroke-1" />
      <p className="mt-3 text-sm font-black text-zinc-550 dark:text-zinc-400">
        No orders in {tabLabel}
      </p>
      <p className="mt-1 text-xs font-bold text-zinc-400 dark:text-zinc-500">
        Orders will appear here when their status changes
      </p>
    </div>
  );
}
