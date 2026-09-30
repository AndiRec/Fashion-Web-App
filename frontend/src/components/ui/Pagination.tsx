import clsx from "clsx";
import { useTranslation } from "react-i18next";

export function Pagination({
  currentPage,
  lastPage,
  onChange,
}: {
  currentPage: number;
  lastPage: number;
  onChange: (page: number) => void;
}) {
  const { t } = useTranslation();
  if (lastPage <= 1) return null;

  const pages = Array.from({ length: lastPage }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === lastPage || Math.abs(p - currentPage) <= 1,
  );

  return (
    <div className="mt-16 flex items-center justify-center gap-2">
      <button
        disabled={currentPage === 1}
        onClick={() => onChange(currentPage - 1)}
        className="px-3 py-2 text-sm text-ink-soft disabled:opacity-30 hover:text-ink"
      >
        {t("common.prev")}
      </button>
      {pages.map((page, i) => (
        <span key={page} className="flex items-center">
          {i > 0 && pages[i - 1] !== page - 1 ? <span className="px-1 text-ink-soft">…</span> : null}
          <button
            onClick={() => onChange(page)}
            className={clsx(
              "flex h-9 w-9 items-center justify-center text-sm",
              page === currentPage ? "bg-ink text-cream" : "text-ink-soft hover:bg-mist",
            )}
          >
            {page}
          </button>
        </span>
      ))}
      <button
        disabled={currentPage === lastPage}
        onClick={() => onChange(currentPage + 1)}
        className="px-3 py-2 text-sm text-ink-soft disabled:opacity-30 hover:text-ink"
      >
        {t("common.next")}
      </button>
    </div>
  );
}
