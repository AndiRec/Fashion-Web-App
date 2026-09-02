import { Button } from "@/components/ui/Button";
import { AlertIcon } from "@/components/icons";

interface Props {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "default";
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger",
  loading,
  onConfirm,
  onCancel,
}: Props) {
  if (!open) return null;

  return (
    <div className="animate-fade-in fixed inset-0 z-[100] flex items-center justify-center bg-ink/50 px-4" onClick={onCancel}>
      <div className="w-full max-w-sm bg-cream p-6" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-start gap-3">
          {variant === "danger" ? (
            <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-rust/10 text-rust">
              <AlertIcon width={18} height={18} />
            </span>
          ) : null}
          <div>
            <h3 className="font-display text-lg text-ink">{title}</h3>
            {description ? <p className="mt-1 text-sm text-ink-soft">{description}</p> : null}
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="ghost" size="sm" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button variant={variant === "danger" ? "danger" : "primary"} size="sm" onClick={onConfirm} loading={loading}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
