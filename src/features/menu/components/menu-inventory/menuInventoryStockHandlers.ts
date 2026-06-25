import type { MenuItem, TempAddonGroup } from "@/types";
import { computeBackInStockTime } from "./restockUtils";
import type { RestockDuration, RestockModalTarget } from "./types";

interface StockActionParams {
  inventory: MenuItem[];
  addonGroups: TempAddonGroup[];
  onToggleStock: (id: string, inStock: boolean, backInStockTime?: number) => void;
  setAddonGroups: React.Dispatch<React.SetStateAction<TempAddonGroup[]>>;
  openRestockModal: (type: RestockModalTarget["type"], id: string, name: string) => void;
}

export function createStockHandlers({
  inventory,
  addonGroups,
  onToggleStock,
  setAddonGroups,
  openRestockModal,
}: StockActionParams) {
  const handleToggleCategory = (catName: string, currentInStock: boolean): void => {
    if (currentInStock) {
      openRestockModal("category", catName, `${catName} category`);
    } else {
      inventory
        .filter((item) => item.category === catName)
        .forEach((item) => onToggleStock(item.id, true));
    }
  };

  const handleToggleItem = (itemId: string, itemName: string, currentInStock: boolean): void => {
    if (currentInStock) {
      openRestockModal("dish", itemId, itemName);
    } else {
      onToggleStock(itemId, true);
    }
  };

  const handleToggleAddonGroup = (groupId: string, currentInStock: boolean): void => {
    const group = addonGroups.find((g) => g.id === groupId);
    if (!group) return;
    if (currentInStock) {
      openRestockModal("addon-group", groupId, `${group.name} group`);
    } else {
      setAddonGroups(
        addonGroups.map((g) =>
          g.id === groupId
            ? {
                ...g,
                options: g.options.map((o) => ({
                  ...o,
                  inStock: true,
                  backInStockTime: undefined,
                })),
              }
            : g,
        ),
      );
    }
  };

  const handleToggleAddonOption = (
    groupId: string,
    optId: string,
    optName: string,
    currentInStock: boolean,
  ): void => {
    if (currentInStock) {
      openRestockModal("addon-option", `${groupId}::${optId}`, optName);
    } else {
      setAddonGroups(
        addonGroups.map((g) =>
          g.id === groupId
            ? {
                ...g,
                options: g.options.map((o) =>
                  o.id === optId ? { ...o, inStock: true, backInStockTime: undefined } : o,
                ),
              }
            : g,
        ),
      );
    }
  };

  const handleConfirmOutOfStock = (
    modalTarget: RestockModalTarget | null,
    selectedDuration: RestockDuration | null,
    custom: {
      selectedDay: string;
      selectedHour: string;
      selectedMinute: string;
      selectedAmPm: string;
    },
    closeModal: () => void,
  ): void => {
    if (!modalTarget || !selectedDuration) return;

    const backInStockTime = computeBackInStockTime(selectedDuration, custom);

    if (modalTarget.type === "dish") {
      onToggleStock(modalTarget.id, false, backInStockTime);
    } else if (modalTarget.type === "category") {
      inventory
        .filter((item) => item.category === modalTarget.id)
        .forEach((item) => onToggleStock(item.id, false, backInStockTime));
    } else if (modalTarget.type === "addon-group") {
      setAddonGroups(
        addonGroups.map((g) =>
          g.id === modalTarget.id
            ? {
                ...g,
                options: g.options.map((o) => ({
                  ...o,
                  inStock: false,
                  backInStockTime,
                })),
              }
            : g,
        ),
      );
    } else if (modalTarget.type === "addon-option") {
      const [groupId, optId] = modalTarget.id.split("::");
      setAddonGroups(
        addonGroups.map((g) =>
          g.id === groupId
            ? {
                ...g,
                options: g.options.map((o) =>
                  o.id === optId ? { ...o, inStock: false, backInStockTime } : o,
                ),
              }
            : g,
        ),
      );
    }

    closeModal();
  };

  return {
    handleToggleCategory,
    handleToggleItem,
    handleToggleAddonGroup,
    handleToggleAddonOption,
    handleConfirmOutOfStock,
  };
}
