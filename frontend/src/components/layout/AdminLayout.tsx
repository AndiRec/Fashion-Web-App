import { type ReactNode, useState } from "react";
import { createPortal } from "react-dom";
import { NavLink } from "react-router-dom";
import clsx from "clsx";
import { useLogout } from "@/hooks/useAuth";
import { useAuthStore } from "@/store/auth";
import {
  ClipboardIcon,
  DashboardIcon,
  ExternalLinkIcon,
  LogoutIcon,
  MenuIcon,
  PackageIcon,
  XIcon,
} from "@/components/icons";

const links = [
  { to: "/admin", label: "Dashboard", icon: DashboardIcon, end: true },
  { to: "/admin/products", label: "Products", icon: PackageIcon, end: false },
  { to: "/admin/orders", label: "Orders", icon: ClipboardIcon, end: false },
];

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex-1 space-y-1 p-4">
      {links.map((link) => {
        const Icon = link.icon;
        return (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            onClick={onNavigate}
            className={({ isActive }) =>
              clsx(
                "flex items-center gap-3 px-3 py-2.5 text-sm transition-colors",
                isActive ? "bg-ink text-cream" : "text-ink-soft hover:bg-mist hover:text-ink",
              )
            }
          >
            <Icon width={17} height={17} />
            {link.label}
          </NavLink>
        );
      })}
    </nav>
  );
}

export function AdminLayout({ title, actions, children }: { title: string; actions?: ReactNode; children: ReactNode }) {
  const user = useAuthStore((s) => s.user);
  const logout = useLogout();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-cream-soft">
      <aside className="hidden w-60 flex-shrink-0 flex-col border-r border-line bg-cream lg:flex">
        <div className="flex h-20 items-center border-b border-line px-6">
          <img src="/images/ariafashion.png" alt="Aria Fashion" className="h-8 w-auto" />
          <span className="eyebrow ml-2 !text-ink-soft">Admin</span>
        </div>

        <NavLinks />

        <div className="space-y-1 border-t border-line p-4">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 px-3 py-2.5 text-sm text-ink-soft hover:bg-mist hover:text-ink"
          >
            <ExternalLinkIcon width={17} height={17} />
            View Store
          </a>
          <button
            onClick={() => logout.mutate()}
            className="flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm text-ink-soft hover:bg-mist hover:text-ink"
          >
            <LogoutIcon width={17} height={17} />
            Sign Out
          </button>
        </div>

        <div className="border-t border-line p-4 text-xs text-ink-soft">
          Signed in as <span className="text-ink">{user?.name}</span>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-line bg-cream px-4 py-4 sm:px-10 sm:py-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileNavOpen(true)}
              aria-label="Open admin menu"
              className="press -ml-1 p-1 lg:hidden"
            >
              <MenuIcon />
            </button>
            <h1 className="font-display text-xl text-ink sm:text-2xl lg:text-3xl">{title}</h1>
          </div>
          {actions ? <div className="flex items-center gap-3">{actions}</div> : null}
        </header>
        <main className="px-4 py-6 sm:px-10 sm:py-8">{children}</main>
      </div>

      {mobileNavOpen
        ? createPortal(
            <div className="fixed inset-0 z-50 bg-ink/40 lg:hidden" onClick={() => setMobileNavOpen(false)}>
              <div
                className="animate-slide-in-left flex h-full w-72 flex-col bg-cream shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex h-20 items-center justify-between border-b border-line px-6">
                  <img src="/images/ariafashion.png" alt="Aria Fashion" className="h-8 w-auto" />
                  <button onClick={() => setMobileNavOpen(false)} aria-label="Close menu" className="press text-ink-soft">
                    <XIcon width={18} height={18} />
                  </button>
                </div>

                <NavLinks onNavigate={() => setMobileNavOpen(false)} />

                <div className="space-y-1 border-t border-line p-4">
                  <a
                    href="/"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 px-3 py-2.5 text-sm text-ink-soft hover:bg-mist hover:text-ink"
                  >
                    <ExternalLinkIcon width={17} height={17} />
                    View Store
                  </a>
                  <button
                    onClick={() => logout.mutate()}
                    className="flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm text-ink-soft hover:bg-mist hover:text-ink"
                  >
                    <LogoutIcon width={17} height={17} />
                    Sign Out
                  </button>
                </div>

                <div className="border-t border-line p-4 text-xs text-ink-soft">
                  Signed in as <span className="text-ink">{user?.name}</span>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
