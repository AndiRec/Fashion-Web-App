import {
  Children,
  isValidElement,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import clsx from "clsx";
import { CheckIcon, ChevronDownIcon } from "@/components/icons";

interface OptionData {
  value: string;
  label: ReactNode;
  disabled?: boolean;
}

function extractOptions(children: ReactNode): OptionData[] {
  const options: OptionData[] = [];
  Children.forEach(children, (child) => {
    if (isValidElement<{ value?: unknown; children?: ReactNode; disabled?: boolean }>(child) && child.type === "option") {
      options.push({
        value: String(child.props.value ?? ""),
        label: child.props.children,
        disabled: child.props.disabled,
      });
    }
  });
  return options;
}

interface Props {
  id: string;
  label?: string;
  error?: string;
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  /** Accepted for drop-in compatibility with the old native-select call sites; this widget is always controlled. */
  required?: boolean;
}

const triggerBase =
  "flex w-full cursor-pointer items-center justify-between gap-2 border bg-cream-soft px-4 py-3 text-sm text-ink transition-colors focus:outline-none focus:ring-1 focus:ring-ink/10 disabled:cursor-not-allowed disabled:opacity-50";

export function Select({ id, label, error, value, onChange, children, className, disabled, required: _required }: Props) {
  const options = extractOptions(children);
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(0);
  const [panelStyle, setPanelStyle] = useState({ top: 0, left: 0, width: 0, maxWidth: 320 });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLUListElement>(null);

  const selected = options.find((o) => o.value === value);

  function updatePosition() {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return;
    // The panel must be at least as wide as the trigger (for visual
    // alignment) but grows to fit its longest label — it should never be
    // narrower than that content, unlike a native <select> popup would be.
    const maxWidth = Math.max(rect.width, Math.min(360, window.innerWidth - rect.left - 16));
    setPanelStyle({ top: rect.bottom + 4, left: rect.left, width: rect.width, maxWidth });
  }

  function openPanel() {
    if (disabled || options.length === 0) return;
    updatePosition();
    const idx = options.findIndex((o) => o.value === value);
    setHighlighted(idx >= 0 ? idx : 0);
    setOpen(true);
  }

  function closePanel(refocus?: boolean) {
    setOpen(false);
    if (refocus) triggerRef.current?.focus();
  }

  function selectOption(option: OptionData) {
    if (option.disabled) return;
    onChange(option.value);
    closePanel(true);
  }

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(e: MouseEvent) {
      const target = e.target as Node;
      if (triggerRef.current?.contains(target) || panelRef.current?.contains(target)) return;
      closePanel();
    }
    function handleScrollOrResize() {
      updatePosition();
    }

    document.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener("resize", handleScrollOrResize);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (open) {
      panelRef.current?.querySelector<HTMLElement>(`[data-index="${highlighted}"]`)?.scrollIntoView({ block: "nearest" });
    }
  }, [open, highlighted]);

  function handleKeyDown(e: KeyboardEvent<HTMLButtonElement>) {
    if (!open) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openPanel();
      }
      return;
    }

    switch (e.key) {
      case "Escape":
        e.preventDefault();
        closePanel(true);
        break;
      case "ArrowDown":
        e.preventDefault();
        setHighlighted((i) => Math.min(i + 1, options.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlighted((i) => Math.max(i - 1, 0));
        break;
      case "Home":
        e.preventDefault();
        setHighlighted(0);
        break;
      case "End":
        e.preventDefault();
        setHighlighted(options.length - 1);
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (options[highlighted]) selectOption(options[highlighted]);
        break;
      case "Tab":
        closePanel();
        break;
    }
  }

  return (
    <div className="w-full">
      {label ? (
        <label htmlFor={id} className="mb-1.5 block text-xs uppercase tracking-wider text-ink-soft">
          {label}
        </label>
      ) : null}

      <button
        ref={triggerRef}
        id={id}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => (open ? closePanel() : openPanel())}
        onKeyDown={handleKeyDown}
        className={clsx(triggerBase, error && "border-rust", !error && "border-line hover:border-ink/40", className)}
      >
        <span className="truncate">{selected?.label ?? " "}</span>
        <ChevronDownIcon
          width={14}
          height={14}
          className={clsx("flex-shrink-0 text-ink-soft transition-transform duration-200", open && "rotate-180")}
        />
      </button>

      {error ? <p className="mt-1 text-xs text-rust">{error}</p> : null}

      {open
        ? createPortal(
            <ul
              ref={panelRef}
              role="listbox"
              aria-labelledby={id}
              style={{
                position: "fixed",
                top: panelStyle.top,
                left: panelStyle.left,
                minWidth: panelStyle.width,
                width: "max-content",
                maxWidth: panelStyle.maxWidth,
              }}
              className="animate-select-in z-[100] max-h-64 overflow-y-auto border border-line bg-cream py-1 shadow-xl"
            >
              {options.map((option, i) => {
                const isSelected = option.value === value;
                return (
                  <li
                    key={option.value}
                    data-index={i}
                    role="option"
                    aria-selected={isSelected}
                    onMouseEnter={() => setHighlighted(i)}
                    onClick={() => selectOption(option)}
                    className={clsx(
                      "flex cursor-pointer items-center justify-between gap-3 px-4 py-2.5 text-sm transition-colors",
                      option.disabled
                        ? "cursor-not-allowed text-ink-soft/40"
                        : i === highlighted
                          ? "bg-mist text-ink"
                          : "text-ink-soft",
                      isSelected && !option.disabled && "font-medium text-ink",
                    )}
                  >
                    <span className="truncate">{option.label}</span>
                    {isSelected ? <CheckIcon width={14} height={14} className="flex-shrink-0 text-taupe-dark" /> : null}
                  </li>
                );
              })}
            </ul>,
            document.body,
          )
        : null}
    </div>
  );
}
