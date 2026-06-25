interface NewOrderRejectConfirmProps {
  onCancel: () => void;
  onConfirm: () => void;
}

export function NewOrderRejectConfirm({
  onCancel,
  onConfirm,
}: NewOrderRejectConfirmProps): React.JSX.Element {
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none">
      <div className="w-full max-w-[350px] bg-white dark:bg-zinc-900 rounded-xl p-5 shadow-2xl border border-zinc-200 dark:border-zinc-800 space-y-4 animate-in fade-in zoom-in-95 duration-100">
        <h3 className="text-sm font-medium text-zinc-900 dark:text-white">Reject Order?</h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
          Are you sure you want to reject this order? This action cannot be undone.
        </p>
        <div className="flex items-center gap-3 justify-end pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-3.5 py-1.5 border border-zinc-300 dark:border-zinc-700 rounded-md text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-md text-xs font-medium cursor-pointer"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}
