import { AlertCircle } from "lucide-react";

interface MenuEditorEmptyTabWorkspaceProps {
  tab: string;
}

export function MenuEditorEmptyTabWorkspace({
  tab,
}: MenuEditorEmptyTabWorkspaceProps): React.JSX.Element {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-20 text-center">
      <AlertCircle className="h-10 w-10 text-zinc-350 dark:text-zinc-650" />
      <h4 className="mt-4 text-sm font-medium text-zinc-800 dark:text-zinc-350">
        Tab Workspace Empty
      </h4>
      <p className="text-xs text-zinc-450 dark:text-zinc-500 max-w-xs mt-1">
        The {tab} settings can be configured via your merchant integration panels.
      </p>
    </div>
  );
}
