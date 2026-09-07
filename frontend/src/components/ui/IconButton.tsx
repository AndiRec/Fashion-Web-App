import { type ButtonHTMLAttributes, forwardRef } from "react";
import clsx from "clsx";

type Variant = "default" | "danger";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  label: string;
}

const variants: Record<Variant, string> = {
  default: "border-line text-ink-soft hover:border-ink hover:text-ink hover:bg-mist",
  danger: "border-line text-ink-soft hover:border-rust hover:text-rust hover:bg-rust/5",
};

export const IconButton = forwardRef<HTMLButtonElement, Props>(
  ({ variant = "default", label, className, children, ...props }, ref) => (
    <button
      ref={ref}
      aria-label={label}
      title={label}
      className={clsx(
        "inline-flex h-9 w-9 flex-shrink-0 items-center justify-center border bg-cream transition-[color,background-color,border-color,transform] duration-150 active:scale-90 disabled:cursor-not-allowed disabled:opacity-40 disabled:active:scale-100",
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  ),
);
IconButton.displayName = "IconButton";
