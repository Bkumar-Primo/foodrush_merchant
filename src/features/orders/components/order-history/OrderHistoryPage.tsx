"use client";

import { Download } from "lucide-react";
import { exportOrdersCsv, formatShortDateRange } from "../../utils/orderHistoryUtils";
import { OrderHistoryDateMenu } from "./OrderHistoryDateMenu";
import { OrderHistoryDetail } from "./OrderHistoryDetail";
import { OrderHistoryFilterMenu } from "./OrderHistoryFilterMenu";
import { OrderHistoryListItem } from "./OrderHistoryListItem";
import { OrderHistorySearchBar } from "./OrderHistorySearchBar";
import type { OrderHistoryPageProps } from "./types";
import { useOrderHistoryFilters } from "./useOrderHistoryFilters";

export function OrderHistoryPage({ orders }: OrderHistoryPageProps): React.JSX.Element {
  const filters = useOrderHistoryFilters(orders);

  const dateLabel = filters.dateRange
    ? formatShortDateRange(filters.dateRange.start, filters.dateRange.end)
    : "Select Date";

  return (
    <div className="flex flex-col h-full bg-zinc-50/50 dark:bg-zinc-950/50">
      <div className="flex items-center justify-between px-6 py-4 shrink-0 bg-white dark:bg-zinc-900 border-b border-zinc-100 dark:border-zinc-800">
        <h2 className="text-lg font-medium text-zinc-900 dark:text-white">Order History</h2>
        <div className="flex items-center gap-2">
          <OrderHistoryDateMenu
            showDateMenu={filters.showDateMenu}
            customStartDate={filters.customStartDate}
            customEndDate={filters.customEndDate}
            calendarMonth={filters.calendarMonth}
            calendarYear={filters.calendarYear}
            calendarCells={filters.calendarCells}
            dateLabel={dateLabel}
            onToggle={() => {
              filters.setShowDateMenu(!filters.showDateMenu);
              filters.setShowFilterMenu(false);
            }}
            onCellClick={filters.handleCellClick}
            onPrevMonth={filters.handlePrevMonth}
            onNextMonth={filters.handleNextMonth}
            onPresetSelect={(preset, start, end) => {
              filters.setCustomStartDate(start);
              filters.setCustomEndDate(end);
              filters.setDatePreset(preset);
              filters.setShowDateMenu(false);
            }}
            onDone={() => filters.setShowDateMenu(false)}
          />

          <OrderHistoryFilterMenu
            statusFilter={filters.statusFilter}
            showFilterMenu={filters.showFilterMenu}
            onToggle={() => {
              filters.setShowFilterMenu(!filters.showFilterMenu);
              filters.setShowDateMenu(false);
            }}
            onStatusChange={(status) => {
              filters.setStatusFilter(status);
              filters.setShowFilterMenu(false);
            }}
          />

          <button
            type="button"
            onClick={() => exportOrdersCsv(filters.historyOrders)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer"
          >
            <Download className="h-3.5 w-3.5 text-zinc-400" />
            Download CSV
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-[38%] min-w-[320px] max-w-[420px] border-r border-zinc-200 dark:border-zinc-800 flex flex-col h-full overflow-hidden shrink-0 bg-[#F9FAFB] dark:bg-zinc-950">
          <OrderHistorySearchBar
            searchQuery={filters.searchQuery}
            onSearchChange={filters.setSearchQuery}
            onSearch={filters.applySearch}
          />
          {filters.historyOrders.length === 0 ? (
            <div className="flex-1 flex items-center justify-center p-8 text-center">
              <p className="text-xs text-zinc-500">No orders found for the selected filters.</p>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto">
              {filters.historyOrders.map((order) => (
                <OrderHistoryListItem
                  key={order.id}
                  order={order}
                  isSelected={filters.effectiveSelectedId === order.id}
                  onSelect={() => filters.setSelectedId(order.id)}
                />
              ))}
            </div>
          )}
        </div>

        <div className="flex-1 h-full overflow-hidden">
          {filters.selectedOrder ? (
            <OrderHistoryDetail order={filters.selectedOrder} />
          ) : (
            <div className="flex items-center justify-center h-full text-xs text-zinc-400">
              Select an order to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default OrderHistoryPage;
