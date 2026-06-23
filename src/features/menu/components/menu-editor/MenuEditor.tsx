"use client";

import AddCategoryModal from "../AddCategoryModal";
import AddSubcategoryModal from "../AddSubcategoryModal";
import EditItemModal from "../EditItemModal";
import { MenuEditorTabs } from "./MenuEditorTabs";
import { MenuEditorToolbar } from "./MenuEditorToolbar";
import { MenuEditorWorkspace } from "./MenuEditorWorkspace";
import type { MenuEditorProps } from "./types";
import { useMenuEditor } from "./useMenuEditor";

export function MenuEditor({
  inventory,
  onToggleStock,
  onSaveItem,
  onAddCategory,
  onAddSubcategory,
  addonGroups,
  setAddonGroups,
}: MenuEditorProps): React.JSX.Element {
  const editor = useMenuEditor({ inventory, onSaveItem, addonGroups, setAddonGroups });

  return (
    <div className="flex flex-col h-full overflow-hidden text-left select-none">
      <MenuEditorTabs activeSubTab={editor.activeSubTab} onTabChange={editor.setActiveSubTab} />

      <MenuEditorToolbar
        searchQuery={editor.searchQuery}
        onSearchChange={editor.setSearchQuery}
        searchPlaceholder={editor.searchPlaceholder}
        showFilterPanel={editor.showFilterPanel}
        onToggleFilterPanel={() => editor.setShowFilterPanel((v) => !v)}
        filterPanelRef={editor.filterPanelRef}
        menuFilters={editor.menuFilters}
        onMenuFiltersChange={editor.setMenuFilters}
        onSubmit={() =>
          editor.triggerToast(
            "Changes Submitted Successfully!",
            "Your live online food ordering menu has been updated.",
          )
        }
      />

      <div className="mx-6 flex-1 flex flex-col bg-white dark:bg-zinc-900 rounded-md border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
        <MenuEditorWorkspace
          activeSubTab={editor.activeSubTab}
          editor={editor}
          inventory={inventory}
          onToggleStock={onToggleStock}
          addonGroups={addonGroups}
          setAddonGroups={setAddonGroups}
        />
      </div>

      <AddCategoryModal
        isOpen={editor.isAddCatOpen}
        onClose={() => editor.setIsAddCatOpen(false)}
        onNext={(name) => {
          onAddCategory(name);
          editor.setCustomCategories((prev) => [...prev, name]);
          editor.setIsAddCatOpen(false);
          editor.setSelectedCategory(name);
          editor.setExpandedCategories((prev) => [...prev, name]);
        }}
      />

      <AddSubcategoryModal
        isOpen={editor.isAddSubOpen}
        onClose={() => editor.setIsAddSubOpen(false)}
        onSkip={() => editor.setIsAddSubOpen(false)}
        onDone={(name) => {
          onAddSubcategory(editor.selectedCategory, name);
          editor.setCustomSubcategories((prev) => ({
            ...prev,
            [editor.selectedCategory]: [...(prev[editor.selectedCategory] ?? []), name],
          }));
          editor.setIsAddSubOpen(false);
        }}
      />

      <EditItemModal
        key={editor.selectedEditItem?.id ?? "new-item"}
        isOpen={editor.isEditItemOpen}
        item={editor.selectedEditItem}
        categories={editor.categoriesList}
        categorySubcategories={editor.categorySubcategories}
        onClose={() => editor.setIsEditItemOpen(false)}
        onSave={editor.handleSaveItemModal}
        addonGroups={addonGroups}
        setAddonGroups={setAddonGroups}
      />
    </div>
  );
}

export default MenuEditor;
