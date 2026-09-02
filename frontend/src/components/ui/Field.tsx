import { type InputHTMLAttributes, type SelectHTMLAttributes, type TextareaHTMLAttributes, forwardRef } from "react";
import clsx from "clsx";

const fieldClass =
  "w-full border border-line bg-cream-soft px-4 py-3 text-sm text-ink placeholder:text-ink-soft/50 focus:border-ink focus:outline-none transition-colors";

interface WrapperProps {
  label?: string;
  error?: string;
  hint?: string;
  id: string;
}

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & WrapperProps>(
  ({ label, error, hint, id, className, ...props }, ref) => (
    <div className="w-full">
      {label ? (
        <label htmlFor={id} className="mb-1.5 block text-xs uppercase tracking-wider text-ink-soft">
          {label}
        </label>
      ) : null}
      <input id={id} ref={ref} className={clsx(fieldClass, error && "border-rust", className)} {...props} />
      {hint && !error ? <p className="mt-1 text-xs text-ink-soft">{hint}</p> : null}
      {error ? <p className="mt-1 text-xs text-rust">{error}</p> : null}
    </div>
  ),
);
Input.displayName = "Input";

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement> & WrapperProps>(
  ({ label, error, id, className, ...props }, ref) => (
    <div className="w-full">
      {label ? (
        <label htmlFor={id} className="mb-1.5 block text-xs uppercase tracking-wider text-ink-soft">
          {label}
        </label>
      ) : null}
      <textarea id={id} ref={ref} className={clsx(fieldClass, "min-h-32 resize-y", error && "border-rust", className)} {...props} />
      {error ? <p className="mt-1 text-xs text-rust">{error}</p> : null}
    </div>
  ),
);
Textarea.displayName = "Textarea";

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement> & WrapperProps>(
  ({ label, error, id, className, children, ...props }, ref) => (
    <div className="w-full">
      {label ? (
        <label htmlFor={id} className="mb-1.5 block text-xs uppercase tracking-wider text-ink-soft">
          {label}
        </label>
      ) : null}
      <select id={id} ref={ref} className={clsx(fieldClass, "appearance-none", error && "border-rust", className)} {...props}>
        {children}
      </select>
      {error ? <p className="mt-1 text-xs text-rust">{error}</p> : null}
    </div>
  ),
);
Select.displayName = "Select";
