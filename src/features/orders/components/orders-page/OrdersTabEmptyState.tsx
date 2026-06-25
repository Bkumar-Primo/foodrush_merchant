import { ClipboardList } from "lucide-react";
import { ORDERS_PAGE_COPY } from "@/features/orders/constants";

interface OrdersTabEmptyStateProps {
  tabLabel: string;
}

export function OrdersTabEmptyState({ tabLabel }: OrdersTabEmptyStateProps): React.JSX.Element {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <ClipboardList className="h-12 w-12 text-zinc-300 dark:text-zinc-700 stroke-1" />
      <p className="mt-3 text-sm font-medium text-zinc-550 dark:text-zinc-400">
        {ORDERS_PAGE_COPY.emptyTitle(tabLabel)}
      </p>
      <p className="mt-1 text-xs font-medium text-zinc-400 dark:text-zinc-500">
        {ORDERS_PAGE_COPY.emptySubtitle}
      </p>
    </div>
  );
}
