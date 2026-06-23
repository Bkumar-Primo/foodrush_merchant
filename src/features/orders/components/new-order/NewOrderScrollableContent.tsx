import type { RefObject } from "react";
import type { Order } from "@/types";
import { NewOrderBillingSection } from "./NewOrderBillingSection";
import { NewOrderCutleryWarning } from "./NewOrderCutleryWarning";
import { NewOrderItemsList } from "./NewOrderItemsList";
import { NewOrderPrepTimeSection } from "./NewOrderPrepTimeSection";
import { NewOrderScrollIndicator } from "./NewOrderScrollIndicator";
import type { OrderBilling } from "./types";

interface NewOrderScrollableContentProps {
  order: Order;
  billing: OrderBilling;
  prepTime: number;
  showScrollIndicator: boolean;
  scrollRef: RefObject<HTMLDivElement | null>;
  onScroll: () => void;
  onScrollDown: () => void;
  onIncrementPrepTime: () => void;
  onDecrementPrepTime: () => void;
}

export function NewOrderScrollableContent({
  order,
  billing,
  prepTime,
  showScrollIndicator,
  scrollRef,
  onScroll,
  onScrollDown,
  onIncrementPrepTime,
  onDecrementPrepTime,
}: NewOrderScrollableContentProps): React.JSX.Element {
  return (
    <div className="relative flex-1 min-h-0 flex flex-col">
      <div
        ref={scrollRef}
        onScroll={onScroll}
        className="overflow-y-auto max-h-[210px] divide-y divide-zinc-155 dark:divide-zinc-800 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        <div className="px-4 py-3 space-y-3">
          <NewOrderCutleryWarning />
          <NewOrderItemsList items={order.items} />
        </div>

        <NewOrderBillingSection itemCount={order.items.length} billing={billing} />

        <NewOrderPrepTimeSection
          prepTime={prepTime}
          onIncrement={onIncrementPrepTime}
          onDecrement={onDecrementPrepTime}
        />
      </div>

      {showScrollIndicator && <NewOrderScrollIndicator onScrollDown={onScrollDown} />}
    </div>
  );
}
