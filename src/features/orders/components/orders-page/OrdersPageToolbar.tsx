"use client";

import { ChevronDown } from "lucide-react";
import { SearchInput } from "@/components/common/SearchInput";
import type { OrdersSortBy } from "./useOrdersPage";

interface OrdersPageToolbarProps {
  sortBy: OrdersSortBy;
  searchQuery: string;
  onSortChange: (sortBy: OrdersSortBy) => void;
  onSearchChange: (query: string) => void;
}

export function OrdersPageToolbar({
  sortBy,
  searchQuery,
  onSortChange,
  onSearchChange,
}: OrdersPageToolbarProps): React.JSX.Element {
  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as OrdersSortBy)}
          className="appearance-none rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 pl-3 pr-8 py-1.5 text-xs font-semibold text-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-1 focus:ring-zinc-400 cursor-pointer"
        >
          <option value="placed_at">Sort: Newest First</option>
          <option value="order_id">Sort: Order ID</option>
        </select>
        <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
      </div>

      <SearchInput
        placeholder="Search by the 4 digit order ID"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-[220px] py-1.5 text-xs font-medium"
        wrapperClassName="w-[220px]"
      />
    </div>
  );
}
