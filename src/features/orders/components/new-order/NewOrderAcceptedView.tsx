import { Check } from "lucide-react";

export function NewOrderAcceptedView(): React.JSX.Element {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 bg-white dark:bg-zinc-900 min-h-[280px]">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#249B5E]">
        <Check className="h-7 w-7 text-white stroke-[3]" />
      </div>
      <p className="mt-4 text-sm font-bold text-zinc-900 dark:text-white">Order accepted</p>
    </div>
  );
}
