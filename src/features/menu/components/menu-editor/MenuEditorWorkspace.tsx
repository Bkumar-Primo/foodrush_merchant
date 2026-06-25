import MenuInventory from "../MenuInventory";
import { MenuEditorAddonsWorkspace } from "./MenuEditorAddonsWorkspace";
import { MenuEditorEmptyTabWorkspace } from "./MenuEditorEmptyTabWorkspace";
import { MenuEditorMenuWorkspace } from "./MenuEditorMenuWorkspace";
import type { MenuEditorProps } from "./types";
import type { MenuEditorState } from "./useMenuEditor";

interface MenuEditorWorkspaceProps {
  activeSubTab: MenuEditorState["activeSubTab"];
  editor: MenuEditorState;
  inventory: MenuEditorProps["inventory"];
  onToggleStock: MenuEditorProps["onToggleStock"];
  addonGroups: MenuEditorProps["addonGroups"];
  setAddonGroups: MenuEditorProps["setAddonGroups"];
}

export function MenuEditorWorkspace({
  activeSubTab,
  editor,
  inventory,
  onToggleStock,
  addonGroups,
  setAddonGroups,
}: MenuEditorWorkspaceProps): React.JSX.Element {
  if (activeSubTab === "inventory") {
    return (
      <div className="flex-1 overflow-y-auto p-6 bg-white dark:bg-zinc-950">
        <MenuInventory
          inventory={inventory}
          onToggleStock={onToggleStock}
          addonGroups={addonGroups}
          setAddonGroups={setAddonGroups}
          searchQuery={editor.searchQuery}
          filters={editor.menuFilters}
          hideToolbar
        />
      </div>
    );
  }

  if (activeSubTab !== "editor") {
    return <MenuEditorEmptyTabWorkspace tab={activeSubTab} />;
  }

  if (editor.activeView === "addons") {
    return (
      <MenuEditorAddonsWorkspace
        editor={editor}
        addonGroups={addonGroups}
        setAddonGroups={setAddonGroups}
      />
    );
  }

  return <MenuEditorMenuWorkspace editor={editor} inventory={inventory} />;
}
