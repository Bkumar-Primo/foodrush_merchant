import { Search, ToggleLeft, ToggleRight } from "lucide-react";
import React, { useState } from "react";
import { tokens } from "@/lib/utils/tokens";
import { MenuItem } from "@/types";

interface MenuInventoryProps {
  inventory: MenuItem[];
  onToggleStock: (id: string, inStock: boolean) => void;
}

export const MenuInventory: React.FC<MenuInventoryProps> = ({ inventory, onToggleStock }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = ["All", "Mains", "Rolls", "South Indian", "Biryanis", "Desserts", "Drinks"];

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div
      className={`rounded-2xl border ${tokens.colors.border} ${tokens.colors.cardBg} p-6 shadow-sm`}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className={`${tokens.fontSizes.heading} ${tokens.colors.textPrimary}`}>
            Menu & Inventory
          </h3>
          <p className={`${tokens.fontSizes.body} ${tokens.colors.textMuted} mt-0.5`}>
            Mark items out of stock to instantly disable them in the Client ordering catalog.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search menu..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full rounded-xl border ${tokens.colors.border} bg-zinc-50 pl-9 pr-4 py-2 text-sm text-zinc-955 focus:border-indigo-500 focus:bg-white focus:outline-none dark:bg-zinc-900/60 dark:text-zinc-50 dark:focus:border-indigo-500`}
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="mt-6 flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`rounded-lg px-4 py-1.5 text-xs font-bold transition-all cursor-pointer ${
              selectedCategory === cat
                ? `${tokens.colors.primaryBg} text-white shadow-sm`
                : `bg-zinc-100 ${tokens.colors.textSecondary} hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700`
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid List */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {filteredInventory.map((item) => (
          <div
            key={item.id}
            className={`flex flex-col justify-between rounded-xl border p-4 shadow-sm transition-all hover:shadow-md ${
              item.inStock
                ? `${tokens.colors.border} ${tokens.colors.cardBg}`
                : `${tokens.colors.border} bg-zinc-50/60 opacity-70 dark:bg-zinc-900/40`
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-2xl">{item.image}</span>
                <h4 className={`mt-2 ${tokens.fontSizes.cardTitle} ${tokens.colors.textPrimary}`}>
                  {item.name}
                </h4>
                <span className={`${tokens.fontSizes.body} ${tokens.colors.textMuted}`}>
                  {item.category}
                </span>
              </div>
              <span className={`${tokens.fontSizes.bodyBold} ${tokens.colors.primaryText}`}>
                ₹{item.price}
              </span>
            </div>

            <div
              className={`mt-6 flex items-center justify-between border-t ${tokens.colors.borderMuted} pt-3`}
            >
              <span
                className={`text-xs font-bold ${item.inStock ? `${tokens.colors.successText}` : `${tokens.colors.dangerText}`}`}
              >
                {item.inStock ? "Available" : "Out of Stock"}
              </span>

              <button
                onClick={() => onToggleStock(item.id, !item.inStock)}
                className={`${tokens.colors.textMuted} hover:text-zinc-750 dark:hover:text-zinc-200 cursor-pointer`}
              >
                {item.inStock ? (
                  <ToggleRight className="h-8 w-8 text-indigo-600" />
                ) : (
                  <ToggleLeft className="h-8 w-8 text-zinc-400" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default MenuInventory;
