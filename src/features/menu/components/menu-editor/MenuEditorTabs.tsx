import { MENU_EDITOR_TABS } from "@/features/menu/constants";
import { cn } from "@/lib/utils";
import { tokens } from "@/lib/utils/tokens";
import type { SubTab } from "./types";

interface MenuEditorTabsProps {
  activeSubTab: SubTab;
  onTabChange: (tab: SubTab) => void;
}

export function MenuEditorTabs({
  activeSubTab,
  onTabChange,
}: MenuEditorTabsProps): React.JSX.Element {
  return (
    <div className="border-b border-zinc-200 dark:border-zinc-800 px-6">
      <div className="flex items-center gap-6">
        {MENU_EDITOR_TABS.map((tab) => {
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "py-3 px-1 text-xs font-medium border-b-2 -mb-[2px] transition-all cursor-pointer",
                isActive
                  ? cn(tokens.colors.brandBorder, tokens.colors.brand)
                  : "border-transparent text-zinc-450 dark:text-zinc-500 hover:text-zinc-800",
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
