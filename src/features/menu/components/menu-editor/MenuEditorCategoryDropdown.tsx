import { MoreVertical } from "lucide-react";

interface MenuEditorCategoryDropdownProps {
  category: string;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  onRename: (oldName: string, newName: string) => void;
  onDelete: (categoryName: string) => void;
  onAddSubcategory: () => void;
}

export function MenuEditorCategoryDropdown({
  category,
  isOpen,
  onToggle,
  onClose,
  onRename,
  onDelete,
  onAddSubcategory,
}: MenuEditorCategoryDropdownProps): React.JSX.Element {
  return (
    <div className="relative">
      <button
        type="button"
        onClick={onToggle}
        className="text-zinc-400 hover:text-zinc-650 dark:hover:text-zinc-200 p-0.5 cursor-pointer"
      >
        <MoreVertical className="h-4 w-4" />
      </button>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={onClose} />
          <div className="absolute right-0 mt-1 w-36 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-lg py-1 z-50 text-left">
            <button
              type="button"
              onClick={() => {
                onClose();
                const newName = prompt(`Rename "${category}" category:`, category);
                if (newName?.trim() && newName.trim() !== category) {
                  onRename(category, newName.trim());
                }
              }}
              className="w-full text-left px-3 py-1.5 text-xs text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900 font-medium"
            >
              Rename
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                if (confirm(`Delete "${category}" category and all its items?`)) {
                  onDelete(category);
                }
              }}
              className="w-full text-left px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-955/20 font-medium"
            >
              Delete Category
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onAddSubcategory();
              }}
              className="w-full text-left px-3 py-1.5 text-xs text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-900 font-medium"
            >
              Add Subcategory
            </button>
          </div>
        </>
      )}
    </div>
  );
}
