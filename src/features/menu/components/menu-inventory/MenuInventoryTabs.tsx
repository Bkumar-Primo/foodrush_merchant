import { tokens } from "@/lib/utils/tokens";
import type { InventoryTab } from "./types";

interface MenuInventoryTabsProps {
  activeTab: InventoryTab;
  onTabChange: (tab: InventoryTab) => void;
}

export function MenuInventoryTabs({
  activeTab,
  onTabChange,
}: MenuInventoryTabsProps): React.JSX.Element {
  const tabClass = (tab: InventoryTab): string =>
    `py-2 px-1 text-xs font-semibold border-b-2 -mb-[2px] transition-all cursor-pointer ${
      activeTab === tab
        ? `${tokens.colors.brandBorder} ${tokens.colors.brand}`
        : "border-transparent text-zinc-450 hover:text-zinc-800"
    }`;

  return (
    <div className="flex gap-6 border-b border-zinc-150 dark:border-zinc-850 shrink-0 mb-4">
      <button type="button" onClick={() => onTabChange("dishes")} className={tabClass("dishes")}>
        Dishes
      </button>
      <button type="button" onClick={() => onTabChange("addons")} className={tabClass("addons")}>
        Add Ons
      </button>
    </div>
  );
}
