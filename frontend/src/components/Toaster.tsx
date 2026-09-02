import clsx from "clsx";
import { useToastStore } from "@/store/toast";
import { XIcon } from "@/components/icons";

export function Toaster() {
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);

  return (
    <div className="fixed bottom-5 left-1/2 z-[100] flex w-full max-w-sm -translate-x-1/2 flex-col gap-2 px-4 sm:left-auto sm:right-5 sm:translate-x-0">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={clsx(
            "animate-fade-in flex items-center justify-between gap-3 border px-4 py-3 text-sm shadow-lg",
            toast.variant === "success" ? "border-ink bg-ink text-cream" : "border-rust bg-rust text-cream",
          )}
        >
          <span>{toast.message}</span>
          <button onClick={() => dismiss(toast.id)} aria-label="Dismiss">
            <XIcon width={14} height={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
