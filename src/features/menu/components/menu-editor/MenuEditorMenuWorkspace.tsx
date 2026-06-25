import { MenuEditorCategoryList } from "./MenuEditorCategoryList";
import { MenuEditorItemList } from "./MenuEditorItemList";
import { MenuEditorToast } from "./MenuEditorToast";
import type { MenuEditorProps } from "./types";
import type { MenuEditorState } from "./useMenuEditor";

interface MenuEditorMenuWorkspaceProps {
  editor: MenuEditorState;
  inventory: MenuEditorProps["inventory"];
}

export function MenuEditorMenuWorkspace({
  editor,
  inventory,
}: MenuEditorMenuWorkspaceProps): React.JSX.Element {
  return (
    <>
      <div className="flex-1 flex flex-row overflow-hidden w-full h-full bg-[#F9FAFB] dark:bg-zinc-950/20">
        <MenuEditorCategoryList
          visibleCategories={editor.visibleCategories}
          filteredInventory={editor.filteredInventory}
          inventory={inventory}
          customSubcategories={editor.customSubcategories}
          selectedCategory={editor.selectedCategory}
          selectedSubcategory={editor.selectedSubcategory}
          displayExpandedCategories={editor.displayExpandedCategories}
          activeCategoryDropdown={editor.activeCategoryDropdown}
          onSelectCategory={editor.setSelectedCategory}
          onSelectSubcategory={(cat, sub) => {
            editor.setSelectedCategory(cat);
            editor.setSelectedSubcategory(sub);
          }}
          onToggleExpand={editor.toggleExpand}
          onCategoryDropdownChange={editor.setActiveCategoryDropdown}
          onAddCategory={() => editor.setIsAddCatOpen(true)}
          onAddSubcategory={() => editor.setIsAddSubOpen(true)}
          onRenameCategory={editor.handleRenameCategory}
          onDeleteCategory={editor.handleDeleteCategory}
          onGoToAddons={() => editor.setActiveView("addons")}
        />
        <MenuEditorItemList
          resolvedCategory={editor.resolvedCategory}
          selectedSubcategory={editor.selectedSubcategory}
          activeItems={editor.activeItems}
          searchQuery={editor.searchQuery}
          menuFilters={editor.menuFilters}
          onAddItem={editor.handleAddNewItemClick}
          onEditItem={editor.handleEditClick}
        />
      </div>
      <MenuEditorToast message={editor.toastMessage} />
    </>
  );
}
