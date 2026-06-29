import { useEffect, useMemo, useRef, useState } from "react";
import type { MenuItem, TempAddonGroup } from "@/types";
import { getMenuCategoriesFromInventory } from "../../constants";
import {
  DEFAULT_MENU_FILTERS,
  filterMenuItems,
  hasActiveFilters,
  type MenuFilters,
  matchesAddonSearch,
} from "../../utils/menuFilters";
import { createStockHandlers } from "./menuInventoryStockHandlers";
import type { InventoryTab, MenuInventoryProps } from "./types";
import { useRestockModal } from "./useRestockModal";

interface UseMenuInventoryParams {
  inventory: MenuItem[];
  onToggleStock: MenuInventoryProps["onToggleStock"];
  addonGroups: TempAddonGroup[];
  setAddonGroups: MenuInventoryProps["setAddonGroups"];
  controlledSearch?: string;
  controlledFilters?: MenuFilters;
  hideToolbar?: boolean;
}

export function useMenuInventory({
  inventory,
  onToggleStock,
  addonGroups,
  setAddonGroups,
  controlledSearch,
  controlledFilters,
  hideToolbar = false,
}: UseMenuInventoryParams) {
  const [activeTab, setActiveTab] = useState<InventoryTab>("dishes");
  const [localSearch, setLocalSearch] = useState("");
  const [localFilters, setLocalFilters] = useState<MenuFilters>(DEFAULT_MENU_FILTERS);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const filterPanelRef = useRef<HTMLDivElement>(null);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [expandedAddonGroups, setExpandedAddonGroups] = useState<string[]>([]);

  const restock = useRestockModal();
  const searchQuery = controlledSearch ?? localSearch;
  const filters = controlledFilters ?? localFilters;
  const showOwnToolbar = !hideToolbar;

  useEffect(() => {
    if (!showOwnToolbar) return;
    const handleClickOutside = (e: MouseEvent): void => {
      if (filterPanelRef.current && !filterPanelRef.current.contains(e.target as Node)) {
        setShowFilterPanel(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showOwnToolbar]);

  const filteredInventory = useMemo(
    () => filterMenuItems(inventory, searchQuery, filters),
    [inventory, searchQuery, filters],
  );

  const categoriesList = useMemo((): string[] => getMenuCategoriesFromInventory(inventory), [inventory]);

  useEffect(() => {
    const categories = getMenuCategoriesFromInventory(inventory);
    if (categories.length === 0) return;

    const firstCategory = categories[0];
    setExpandedCategories((prev) => {
      if (prev.length === 0 || !prev.some((category) => categories.includes(category))) {
        return [firstCategory];
      }
      return prev;
    });
  }, [inventory]);

  const stockHandlers = createStockHandlers({
    inventory,
    addonGroups,
    onToggleStock,
    setAddonGroups,
    openRestockModal: restock.openRestockModal,
  });

  const toggleCategoryExpand = (cat: string): void => {
    setExpandedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
    );
  };

  const toggleAddonGroupExpand = (groupId: string): void => {
    setExpandedAddonGroups((prev) =>
      prev.includes(groupId) ? prev.filter((g) => g !== groupId) : [...prev, groupId],
    );
  };

  const filteredCategories = categoriesList.filter((cat) => {
    const items = filteredInventory.filter((item) => item.category === cat);
    return items.length > 0;
  });

  const filteredAddonGroups = addonGroups.filter((g) => matchesAddonSearch(g, searchQuery));

  const displayExpandedCategories = useMemo(() => {
    if (!searchQuery.trim()) return expandedCategories;
    return Array.from(new Set([...expandedCategories, ...filteredCategories]));
  }, [expandedCategories, filteredCategories, searchQuery]);

  const displayExpandedAddonGroups = useMemo(() => {
    if (!searchQuery.trim() || activeTab !== "addons") return expandedAddonGroups;
    return Array.from(new Set([...expandedAddonGroups, ...filteredAddonGroups.map((g) => g.id)]));
  }, [expandedAddonGroups, filteredAddonGroups, searchQuery, activeTab]);

  const clearSearchOnTabChange = (): void => {
    if (showOwnToolbar) setLocalSearch("");
  };

  const handleConfirmOutOfStock = (): void => {
    stockHandlers.handleConfirmOutOfStock(
      restock.modalTarget,
      restock.selectedDuration,
      {
        selectedDay: restock.selectedDay,
        selectedHour: restock.selectedHour,
        selectedMinute: restock.selectedMinute,
        selectedAmPm: restock.selectedAmPm,
      },
      restock.closeRestockModal,
    );
  };

  return {
    activeTab,
    setActiveTab,
    localSearch,
    setLocalSearch,
    localFilters,
    setLocalFilters,
    showFilterPanel,
    setShowFilterPanel,
    filterPanelRef,
    showOwnToolbar,
    filteredInventory,
    filteredCategories,
    filteredAddonGroups,
    displayExpandedCategories,
    displayExpandedAddonGroups,
    toggleCategoryExpand,
    toggleAddonGroupExpand,
    handleToggleCategory: stockHandlers.handleToggleCategory,
    handleToggleItem: stockHandlers.handleToggleItem,
    handleToggleAddonGroup: stockHandlers.handleToggleAddonGroup,
    handleToggleAddonOption: stockHandlers.handleToggleAddonOption,
    handleConfirmOutOfStock,
    clearSearchOnTabChange,
    hasActiveFilters,
    restock,
  };
}
