import clsx from "clsx";
import { useLanguageStore } from "@/store/language";
import { SUPPORTED_LANGUAGES } from "@/lib/i18n";

export function LanguageSwitcher({ className }: { className?: string }) {
  const language = useLanguageStore((s) => s.language);
  const setLanguage = useLanguageStore((s) => s.setLanguage);

  return (
    <div className={clsx("flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-ink-soft", className)}>
      {SUPPORTED_LANGUAGES.map((lang, i) => (
        <span key={lang} className="flex items-center gap-1.5">
          {i > 0 ? <span className="text-line">/</span> : null}
          <button
            onClick={() => setLanguage(lang)}
            aria-pressed={lang === language}
            className={clsx("press", lang === language ? "text-ink font-medium" : "hover:text-ink")}
          >
            {lang}
          </button>
        </span>
      ))}
    </div>
  );
}
