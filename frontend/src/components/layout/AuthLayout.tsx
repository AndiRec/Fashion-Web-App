import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { BackButton } from "@/components/ui/BackButton";

export function AuthLayout({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4 py-12 sm:py-16">
      <div className="w-full max-w-md">
        <BackButton fallback="/" className="mb-6" />
        <Link to="/" className="mb-10 flex justify-center">
          <img src="/images/ariafashion.png" alt="Aria Fashion" className="h-14 w-auto" />
        </Link>
        <div className="border border-line bg-cream-soft p-8 sm:p-10">
          <h1 className="mb-2 text-center font-display text-2xl">{title}</h1>
          {subtitle ? <p className="mb-8 text-center text-sm text-ink-soft">{subtitle}</p> : <div className="mb-6" />}
          {children}
        </div>
      </div>
    </div>
  );
}
