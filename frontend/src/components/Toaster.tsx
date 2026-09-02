import clsx from "clsx";
import { useToastStore } from "@/store/toast";
import { AlertIcon, CheckIcon, XIcon } from "@/components/icons";

export function Toaster() {
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);

  return (
    <div className="fixed bottom-5 left-1/2 z-[100] flex w-full max-w-sm -translate-x-1/2 flex-col gap-2 px-4 sm:left-auto sm:right-5 sm:translate-x-0">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={clsx(
            "animate-fade-in flex items-center gap-3 border px-4 py-3 text-sm shadow-xl",
            toast.variant === "success" ? "border-ink bg-ink text-cream" : "border-rust bg-rust text-cream",
          )}
        >
          {toast.variant === "success" ? (
            <CheckIcon width={16} height={16} className="flex-shrink-0" />
          ) : (
            <AlertIcon width={16} height={16} className="flex-shrink-0" />
          )}
          <span className="flex-1">{toast.message}</span>
          <button onClick={() => dismiss(toast.id)} aria-label="Dismiss" className="flex-shrink-0 opacity-70 hover:opacity-100">
            <XIcon width={14} height={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
