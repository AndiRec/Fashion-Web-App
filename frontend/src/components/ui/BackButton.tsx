import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import { ChevronLeftIcon } from "@/components/icons";

interface Props {
  /** Route to go to if there's no in-app history to go back to (e.g. arrived via a direct link). */
  fallback: string;
  label?: string;
  className?: string;
}

export function BackButton({ fallback, label = "Back", className }: Props) {
  const navigate = useNavigate();

  function handleClick() {
    // React Router stamps each history entry with an `idx`; 0 means this is
    // the first entry in this tab's session, so going back would leave the
    // app entirely (e.g. to whatever search result linked here) — use the
    // fallback route instead in that case.
    const idx = (window.history.state as { idx?: number } | null)?.idx ?? 0;
    if (idx > 0) {
      navigate(-1);
    } else {
      navigate(fallback);
    }
  }

  return (
    <button
      onClick={handleClick}
      className={clsx("press inline-flex items-center gap-1 text-xs text-ink-soft hover:text-ink", className)}
    >
      <ChevronLeftIcon width={14} height={14} />
      {label}
    </button>
  );
}
