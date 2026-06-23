import { useEffect, useMemo, useRef, useState } from "react";
import { deleteInventoryItem } from "@/lib/db";
import type { MenuItem } from "@/types";
import {
  DEFAULT_MENU_FILTERS,
  filterMenuItems,
  hasActiveFilters,
  type MenuFilters,
  matchesAddonSearch,
} from "../../utils/menuFilters";
import type { EditorView, MenuEditorProps, SubTab, ToastMessage } from "./types";

const DEFAULT_CATEGORIES = [
  "Litti Chokha",
  "Vada Pav",
  "Bread",
  "Meals And Combos",
  "Today's Special",
] as const;

export function useMenuEditor({
  inventory,
  onSaveItem,
  addonGroups,
  setAddonGroups,
}: Pick<MenuEditorProps, "inventory" | "onSaveItem" | "addonGroups" | "setAddonGroups">) {
  const [activeSubTab, setActiveSubTab] = useState<SubTab>("editor");
  const [searchQuery, setSearchQuery] = useState("");
  const [menuFilters, setMenuFilters] = useState<MenuFilters>(DEFAULT_MENU_FILTERS);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const filterPanelRef = useRef<HTMLDivElement>(null);
  const [selectedCategory, setSelectedCategory] = useState("Litti Chokha");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<string[]>(["Litti Chokha"]);
  const [customCategories, setCustomCategories] = useState<string[]>([]);
  const [customSubcategories, setCustomSubcategories] = useState<Record<string, string[]>>({});
  const [isAddCatOpen, setIsAddCatOpen] = useState(false);
  const [isAddSubOpen, setIsAddSubOpen] = useState(false);
  const [isEditItemOpen, setIsEditItemOpen] = useState(false);
  const [selectedEditItem, setSelectedEditItem] = useState<MenuItem | null>(null);
  const [activeCategoryDropdown, setActiveCategoryDropdown] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<EditorView>("editor");
  const [selectedAddonGroupId, setSelectedAddonGroupId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<ToastMessage | null>(null);
  const [newGlobalInlineAddonName, setNewGlobalInlineAddonName] = useState("");
  const [newGlobalInlineAddonPrice, setNewGlobalInlineAddonPrice] = useState(0);
  const [newAddonGroupName, setNewAddonGroupName] = useState("");
  const [newAddonGroupOptions, setNewAddonGroupOptions] = useState<string[]>([
    "Option 1",
    "Option 2",
  ]);
  const [newAddonGroupPrices, setNewAddonGroupPrices] = useState<Record<string, number>>({});
  const [isCreatingGlobalGroup, setIsCreatingGlobalGroup] = useState(false);

  const categoriesList = useMemo(() => {
    const list = new Set<string>();
    for (const item of inventory) {
      if (item.category) list.add(item.category);
    }
    for (const cat of customCategories) list.add(cat);
    for (const cat of DEFAULT_CATEGORIES) list.add(cat);
    return Array.from(list);
  }, [inventory, customCategories]);

  const filteredInventory = useMemo(
    () => filterMenuItems(inventory, searchQuery, menuFilters),
    [inventory, searchQuery, menuFilters],
  );

  const visibleCategories = useMemo(() => {
    if (!searchQuery.trim() && !hasActiveFilters(menuFilters)) return categoriesList;
    return categoriesList.filter((cat) => {
      if (cat.toLowerCase().includes(searchQuery.trim().toLowerCase())) return true;
      return filteredInventory.some((item) => item.category === cat);
    });
  }, [categoriesList, filteredInventory, searchQuery, menuFilters]);

  const filteredAddonGroupsList = useMemo(
    () => addonGroups.filter((g) => matchesAddonSearch(g, searchQuery)),
    [addonGroups, searchQuery],
  );

  const categorySubcategories = useMemo(() => {
    const map: Record<string, string[]> = {};
    for (const cat of categoriesList) {
      const subsFromInventory = new Set(
        inventory
          .filter((item) => item.category === cat && item.subcategory)
          .flatMap((item) => (item.subcategory ? [item.subcategory] : [])),
      );
      const customSubs = customSubcategories[cat] ?? [];
      map[cat] = Array.from(new Set([...customSubs, ...subsFromInventory]));
    }
    return map;
  }, [categoriesList, inventory, customSubcategories]);

  const resolvedCategory = useMemo(() => {
    if (visibleCategories.length === 0) return selectedCategory;
    return visibleCategories.includes(selectedCategory) ? selectedCategory : visibleCategories[0];
  }, [visibleCategories, selectedCategory]);

  const displayExpandedCategories = useMemo(() => {
    if (!searchQuery.trim() && !hasActiveFilters(menuFilters)) return expandedCategories;
    return Array.from(new Set([...expandedCategories, ...visibleCategories]));
  }, [expandedCategories, visibleCategories, searchQuery, menuFilters]);

  const activeItems = useMemo(
    () =>
      filteredInventory.filter((item) => {
        const matchesCategory = item.category === resolvedCategory;
        const matchesSubcategory = !selectedSubcategory || item.subcategory === selectedSubcategory;
        return matchesCategory && matchesSubcategory;
      }),
    [filteredInventory, resolvedCategory, selectedSubcategory],
  );

  const selectedAddonGroup = useMemo(
    () => addonGroups.find((g) => g.id === selectedAddonGroupId) ?? null,
    [addonGroups, selectedAddonGroupId],
  );

  const searchPlaceholder = useMemo((): string => {
    if (activeSubTab === "inventory") return "Search dishes or add-ons";
    if (activeView === "addons") return "Search addon groups";
    return "Search dishes, categories...";
  }, [activeSubTab, activeView]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent): void => {
      if (filterPanelRef.current && !filterPanelRef.current.contains(e.target as Node)) {
        setShowFilterPanel(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleExpand = (cat: string): void => {
    setExpandedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
    );
  };

  const handleRenameCategory = async (oldName: string, newName: string): Promise<void> => {
    setCustomCategories((prev) => prev.map((c) => (c === oldName ? newName : c)));
    setCustomSubcategories((prev) => {
      const next = { ...prev };
      if (next[oldName]) {
        next[newName] = next[oldName];
        delete next[oldName];
      }
      return next;
    });
    const itemsToUpdate = inventory.filter((item) => item.category === oldName);
    for (const item of itemsToUpdate) {
      await onSaveItem({ ...item, category: newName });
    }
    setSelectedCategory(newName);
  };

  const handleDeleteCategory = async (catName: string): Promise<void> => {
    setCustomCategories((prev) => prev.map((c) => (c === catName ? "" : c)).filter(Boolean));
    setCustomSubcategories((prev) => {
      const next = { ...prev };
      delete next[catName];
      return next;
    });
    const itemsToDelete = inventory.filter((item) => item.category === catName);
    for (const item of itemsToDelete) {
      await deleteInventoryItem(item.id);
    }
    const nextCat = categoriesList.find((c) => c !== catName) ?? "Litti Chokha";
    setSelectedCategory(nextCat);
    setSelectedSubcategory(null);
  };

  const triggerToast = (title: string, desc: string): void => {
    setToastMessage({ title, desc });
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleEditClick = (item: MenuItem): void => {
    setSelectedEditItem(item);
    setIsEditItemOpen(true);
  };

  const handleAddNewItemClick = (): void => {
    setSelectedEditItem(null);
    setIsEditItemOpen(true);
  };

  const handleSaveItemModal = (updatedItem: MenuItem): void => {
    onSaveItem(updatedItem);
    setIsEditItemOpen(false);
  };

  const openCreateAddonGroup = (): void => {
    setNewAddonGroupName("");
    setNewAddonGroupOptions(["Option 1", "Option 2"]);
    setNewAddonGroupPrices({});
    setIsCreatingGlobalGroup(true);
  };

  const handleCreateAddonGroup = (group: (typeof addonGroups)[number]): void => {
    setAddonGroups([...addonGroups, group]);
    setIsCreatingGlobalGroup(false);
    setSelectedAddonGroupId(group.id);
  };

  return {
    activeSubTab,
    setActiveSubTab,
    searchQuery,
    setSearchQuery,
    searchPlaceholder,
    menuFilters,
    setMenuFilters,
    showFilterPanel,
    setShowFilterPanel,
    filterPanelRef,
    selectedCategory,
    setSelectedCategory,
    selectedSubcategory,
    setSelectedSubcategory,
    expandedCategories,
    setExpandedCategories,
    customCategories,
    setCustomCategories,
    customSubcategories,
    setCustomSubcategories,
    isAddCatOpen,
    setIsAddCatOpen,
    isAddSubOpen,
    setIsAddSubOpen,
    isEditItemOpen,
    setIsEditItemOpen,
    selectedEditItem,
    activeCategoryDropdown,
    setActiveCategoryDropdown,
    activeView,
    setActiveView,
    selectedAddonGroupId,
    setSelectedAddonGroupId,
    toastMessage,
    newGlobalInlineAddonName,
    setNewGlobalInlineAddonName,
    newGlobalInlineAddonPrice,
    setNewGlobalInlineAddonPrice,
    newAddonGroupName,
    setNewAddonGroupName,
    newAddonGroupOptions,
    setNewAddonGroupOptions,
    newAddonGroupPrices,
    setNewAddonGroupPrices,
    isCreatingGlobalGroup,
    setIsCreatingGlobalGroup,
    categoriesList,
    filteredInventory,
    visibleCategories,
    filteredAddonGroupsList,
    categorySubcategories,
    resolvedCategory,
    displayExpandedCategories,
    activeItems,
    selectedAddonGroup,
    toggleExpand,
    handleRenameCategory,
    handleDeleteCategory,
    triggerToast,
    handleEditClick,
    handleAddNewItemClick,
    handleSaveItemModal,
    openCreateAddonGroup,
    handleCreateAddonGroup,
  };
}

export type MenuEditorState = ReturnType<typeof useMenuEditor>;
