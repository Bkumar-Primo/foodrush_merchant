import { ArrowLeft } from "lucide-react";
import { SearchInput } from "@/components/common/SearchInput";
import { cn } from "@/lib/utils";
import { tokens } from "@/lib/utils/tokens";
import type { TempAddonGroup } from "@/types";

interface MenuEditorAddonSidebarProps {
  addonGroups: TempAddonGroup[];
  filteredAddonGroups: TempAddonGroup[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedAddonGroupId: string | null;
  onSelectGroup: (groupId: string) => void;
  onBackToMenu: () => void;
  onCreateGroup: () => void;
}

export function MenuEditorAddonSidebar({
  addonGroups,
  filteredAddonGroups,
  searchQuery,
  onSearchChange,
  selectedAddonGroupId,
  onSelectGroup,
  onBackToMenu,
  onCreateGroup,
}: MenuEditorAddonSidebarProps): React.JSX.Element {
  return (
    <div className="w-[38%] border-r border-zinc-150 dark:border-zinc-950 bg-white flex flex-col h-full overflow-hidden shrink-0">
      <div className="bg-[#F5FBFC] px-4 py-3 border-b border-zinc-150 dark:border-zinc-950 flex justify-between items-center shrink-0">
        <span className="text-xs font-medium text-zinc-900 dark:text-white">
          Add Ons ({addonGroups.length})
        </span>
        <button
          type="button"
          onClick={onBackToMenu}
          className={cn(
            "text-[10px] font-semibold hover:underline flex items-center gap-0.5 shrink-0",
            tokens.colors.brand,
          )}
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Menu
        </button>
      </div>

      <div className="p-3 border-b border-zinc-100 bg-white space-y-2.5 shrink-0">
        <div className="flex items-center justify-between gap-2">
          <SearchInput
            placeholder="Search addon group"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            wrapperClassName="flex-1"
            className="pl-8 py-1"
          />
          <button
            type="button"
            onClick={onCreateGroup}
            className={cn(
              "text-[10px] font-semibold hover:underline shrink-0",
              tokens.colors.brand,
            )}
          >
            + Create New Group
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto divide-y divide-zinc-100">
        {filteredAddonGroups.map((group) => (
          <AddonGroupRow
            key={group.id}
            group={group}
            isSelected={selectedAddonGroupId === group.id}
            onCustomize={() => onSelectGroup(group.id)}
          />
        ))}
      </div>
    </div>
  );
}

interface AddonGroupRowProps {
  group: TempAddonGroup;
  isSelected: boolean;
  onCustomize: () => void;
}

function AddonGroupRow({ group, isSelected, onCustomize }: AddonGroupRowProps): React.JSX.Element {
  const optionsSummary = group.options.map((o) => `${o.name} (₹${o.price})`).join(", ");

  return (
    <div
      className={cn(
        "p-4 flex items-start justify-between gap-3 hover:bg-zinc-50/50 transition-colors",
        isSelected && "bg-blue-50/15",
      )}
    >
      <div className="flex items-start gap-2.5 min-w-0 text-left">
        <input
          type="checkbox"
          checked
          readOnly
          className={cn("mt-0.5 h-3.5 w-3.5 border-zinc-300 rounded shrink-0", tokens.colors.brand)}
        />
        <div className="min-w-0">
          <span className="text-xs font-semibold text-zinc-800 block truncate">{group.name}</span>
          <span className="text-[10px] text-zinc-450 block truncate">{optionsSummary}</span>
        </div>
      </div>
      <button
        type="button"
        onClick={onCustomize}
        className="text-[10px] font-semibold text-zinc-800 hover:text-[#2563EB] shrink-0"
      >
        Customize
      </button>
    </div>
  );
}
