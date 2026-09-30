import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { useLanguageStore } from "@/store/language";
import { SUPPORTED_LANGUAGES, type SupportedLanguage } from "@/lib/i18n";
import { CheckIcon, ChevronDownIcon } from "@/components/icons";

const LANGUAGE_LABELS: Record<SupportedLanguage, string> = {
  en: "English",
  mk: "Македонски",
  sq: "Shqip",
};

export function LanguageSwitcher({ className }: { className?: string }) {
  const language = useLanguageStore((s) => s.language);
  const setLanguage = useLanguageStore((s) => s.setLanguage);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handlePointerDown(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [open]);

  return (
    <div ref={rootRef} className={clsx("relative", className)}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="press flex items-center gap-1 text-[11px] uppercase tracking-wider text-ink-soft hover:text-ink"
      >
        {language}
        <ChevronDownIcon width={11} height={11} className={clsx("transition-transform duration-200", open && "rotate-180")} />
      </button>

      {open ? (
        <ul
          role="listbox"
          className="animate-select-in absolute right-0 top-full z-50 mt-2 w-32 border border-line bg-cream py-1 shadow-xl"
        >
          {SUPPORTED_LANGUAGES.map((lang) => (
            <li key={lang}>
              <button
                role="option"
                aria-selected={lang === language}
                onClick={() => {
                  setLanguage(lang);
                  setOpen(false);
                }}
                className={clsx(
                  "flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-xs transition-colors",
                  lang === language ? "font-medium text-ink" : "text-ink-soft hover:bg-mist hover:text-ink",
                )}
              >
                {LANGUAGE_LABELS[lang]}
                {lang === language ? <CheckIcon width={12} height={12} className="text-taupe-dark" /> : null}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
