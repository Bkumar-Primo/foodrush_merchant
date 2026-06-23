import type { Order } from "@/types";

interface NewOrderItemsListProps {
  items: Order["items"];
}

export function NewOrderItemsList({ items }: NewOrderItemsListProps): React.JSX.Element {
  return (
    <div className="space-y-2.5 pt-0.5">
      {items.map((item) => (
        <div key={item.id} className="flex justify-between items-center text-xs">
          <div className="flex items-center">
            <div className="border border-emerald-500 rounded p-[1px] inline-flex items-center justify-center size-3 mr-2 shrink-0">
              <span className="h-1.5 w-1.5 rounded-lg bg-emerald-500" />
            </div>
            <span className="font-extrabold text-zinc-900 dark:text-zinc-100">
              {item.quantity} x {item.name}
            </span>
          </div>
          <span className="font-extrabold text-zinc-900 dark:text-zinc-100">
            ₹{item.price * item.quantity}.00
          </span>
        </div>
      ))}
    </div>
  );
}
