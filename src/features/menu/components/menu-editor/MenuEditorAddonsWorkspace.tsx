import { MenuEditorAddonOptionsPanel } from "./MenuEditorAddonOptionsPanel";
import { MenuEditorAddonSidebar } from "./MenuEditorAddonSidebar";
import { MenuEditorCreateAddonGroupModal } from "./MenuEditorCreateAddonGroupModal";
import { MenuEditorToast } from "./MenuEditorToast";
import type { MenuEditorProps } from "./types";
import type { MenuEditorState } from "./useMenuEditor";

interface MenuEditorAddonsWorkspaceProps {
  editor: MenuEditorState;
  addonGroups: MenuEditorProps["addonGroups"];
  setAddonGroups: MenuEditorProps["setAddonGroups"];
}

export function MenuEditorAddonsWorkspace({
  editor,
  addonGroups,
  setAddonGroups,
}: MenuEditorAddonsWorkspaceProps): React.JSX.Element {
  return (
    <>
      <div className="flex-1 flex flex-row overflow-hidden w-full h-full bg-[#F9FAFB] dark:bg-zinc-955/20">
        <MenuEditorAddonSidebar
          addonGroups={addonGroups}
          filteredAddonGroups={editor.filteredAddonGroupsList}
          searchQuery={editor.searchQuery}
          onSearchChange={editor.setSearchQuery}
          selectedAddonGroupId={editor.selectedAddonGroupId}
          onSelectGroup={editor.setSelectedAddonGroupId}
          onBackToMenu={() => {
            editor.setActiveView("editor");
            editor.setSelectedAddonGroupId(null);
          }}
          onCreateGroup={editor.openCreateAddonGroup}
        />
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-white">
          <MenuEditorAddonOptionsPanel
            selectedGroup={editor.selectedAddonGroup}
            addonGroups={addonGroups}
            setAddonGroups={setAddonGroups}
            newOptionName={editor.newGlobalInlineAddonName}
            newOptionPrice={editor.newGlobalInlineAddonPrice}
            onNewOptionNameChange={editor.setNewGlobalInlineAddonName}
            onNewOptionPriceChange={editor.setNewGlobalInlineAddonPrice}
            onClearSelection={() => editor.setSelectedAddonGroupId(null)}
          />
        </div>
      </div>
      <MenuEditorCreateAddonGroupModal
        isOpen={editor.isCreatingGlobalGroup}
        groupName={editor.newAddonGroupName}
        options={editor.newAddonGroupOptions}
        prices={editor.newAddonGroupPrices}
        onGroupNameChange={editor.setNewAddonGroupName}
        onOptionsChange={editor.setNewAddonGroupOptions}
        onPricesChange={editor.setNewAddonGroupPrices}
        onClose={() => editor.setIsCreatingGlobalGroup(false)}
        onCreate={editor.handleCreateAddonGroup}
      />
      <MenuEditorToast message={editor.toastMessage} />
    </>
  );
}
