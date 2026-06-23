import { BrandButton } from "@/components/common/BrandButton";
import { SearchInput } from "@/components/common/SearchInput";

interface OrderHistorySearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearch: () => void;
}

export function OrderHistorySearchBar({
  searchQuery,
  onSearchChange,
  onSearch,
}: OrderHistorySearchBarProps): React.JSX.Element {
  return (
    <div className="flex items-center gap-2 px-4 py-3 shrink-0 border-b border-zinc-150 dark:border-zinc-850 bg-white dark:bg-zinc-900">
      <SearchInput
        placeholder="Enter full order ID to search"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSearch()}
        wrapperClassName="flex-1"
        className="py-1.5"
      />
      <BrandButton
        variant="orderOutline"
        onClick={onSearch}
        className="px-4 py-1.5 text-zinc-400 hover:text-zinc-600"
      >
        Search
      </BrandButton>
    </div>
  );
}
