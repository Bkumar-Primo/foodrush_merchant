"use client";

import { MenuInventoryAddonGroupAccordion } from "./MenuInventoryAddonGroupAccordion";
import { MenuInventoryCategoryAccordion } from "./MenuInventoryCategoryAccordion";
import { MenuInventoryTabs } from "./MenuInventoryTabs";
import { MenuInventoryToolbar } from "./MenuInventoryToolbar";
import { RestockModal } from "./RestockModal";
import type { MenuInventoryProps } from "./types";
import { useMenuInventory } from "./useMenuInventory";

export function MenuInventory({
  inventory,
  onToggleStock,
  addonGroups,
  setAddonGroups,
  searchQuery: controlledSearch,
  filters: controlledFilters,
  hideToolbar = false,
}: MenuInventoryProps): React.JSX.Element {
  const inv = useMenuInventory({
    inventory,
    onToggleStock,
    addonGroups,
    setAddonGroups,
    controlledSearch,
    controlledFilters,
    hideToolbar,
  });

  const handleTabChange = (tab: "dishes" | "addons"): void => {
    inv.setActiveTab(tab);
    inv.clearSearchOnTabChange();
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white dark:bg-zinc-950 text-left select-none text-zinc-900 dark:text-zinc-150">
      {inv.showOwnToolbar && (
        <MenuInventoryToolbar
          localSearch={inv.localSearch}
          onSearchChange={inv.setLocalSearch}
          showFilterPanel={inv.showFilterPanel}
          onToggleFilterPanel={() => inv.setShowFilterPanel(!inv.showFilterPanel)}
          filterPanelRef={inv.filterPanelRef}
          localFilters={inv.localFilters}
          onFiltersChange={inv.setLocalFilters}
          hasActiveFilters={inv.hasActiveFilters(inv.localFilters)}
        />
      )}

      <MenuInventoryTabs activeTab={inv.activeTab} onTabChange={handleTabChange} />

      <div className="flex-1 overflow-y-auto space-y-3 pb-6">
        {inv.activeTab === "dishes" ? (
          inv.filteredCategories.length === 0 ? (
            <div className="text-center py-12 text-xs text-zinc-500">
              No dishes match your search or filters.
            </div>
          ) : (
            inv.filteredCategories.map((cat) => {
              const catItems = inv.filteredInventory.filter((item) => item.category === cat);
              const isExpanded = inv.displayExpandedCategories.includes(cat);
              const isCategoryActive =
                catItems.length === 0 || catItems.some((item) => item.inStock);

              return (
                <MenuInventoryCategoryAccordion
                  key={cat}
                  category={cat}
                  items={catItems}
                  isExpanded={isExpanded}
                  isCategoryActive={isCategoryActive}
                  onToggleCategory={() => inv.handleToggleCategory(cat, isCategoryActive)}
                  onToggleExpand={() => inv.toggleCategoryExpand(cat)}
                  onToggleItem={inv.handleToggleItem}
                />
              );
            })
          )
        ) : inv.filteredAddonGroups.length === 0 ? (
          <div className="text-center py-12 text-xs text-zinc-500">
            No add-on groups match your search.
          </div>
        ) : (
          inv.filteredAddonGroups.map((group) => {
            const isExpanded = inv.displayExpandedAddonGroups.includes(group.id);
            const isGroupActive =
              group.options.length === 0 || group.options.some((o) => o.inStock !== false);

            return (
              <MenuInventoryAddonGroupAccordion
                key={group.id}
                group={group}
                isExpanded={isExpanded}
                isGroupActive={isGroupActive}
                onToggleGroup={() => inv.handleToggleAddonGroup(group.id, isGroupActive)}
                onToggleExpand={() => inv.toggleAddonGroupExpand(group.id)}
                onToggleOption={(optId, optName, inStock) =>
                  inv.handleToggleAddonOption(group.id, optId, optName, inStock)
                }
              />
            );
          })
        )}
      </div>

      {inv.restock.modalTarget && (
        <RestockModal
          onClose={inv.restock.closeRestockModal}
          onConfirm={inv.handleConfirmOutOfStock}
          selectedDuration={inv.restock.selectedDuration}
          onDurationSelect={inv.restock.setSelectedDuration}
          next7Days={inv.restock.next7Days}
          selectedDay={inv.restock.selectedDay}
          selectedHour={inv.restock.selectedHour}
          selectedMinute={inv.restock.selectedMinute}
          selectedAmPm={inv.restock.selectedAmPm}
          onDaySelect={inv.restock.setSelectedDay}
          onHourChange={inv.restock.setSelectedHour}
          onMinuteChange={inv.restock.setSelectedMinute}
          onAmPmChange={inv.restock.setSelectedAmPm}
        />
      )}
    </div>
  );
}

export default MenuInventory;
