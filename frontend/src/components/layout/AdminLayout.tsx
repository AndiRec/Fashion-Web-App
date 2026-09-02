import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import clsx from "clsx";
import { useLogout } from "@/hooks/useAuth";
import { useAuthStore } from "@/store/auth";
import { ClipboardIcon, DashboardIcon, ExternalLinkIcon, LogoutIcon, PackageIcon } from "@/components/icons";

const links = [
  { to: "/admin", label: "Dashboard", icon: DashboardIcon, end: true },
  { to: "/admin/products", label: "Products", icon: PackageIcon, end: false },
  { to: "/admin/orders", label: "Orders", icon: ClipboardIcon, end: false },
];

export function AdminLayout({ title, actions, children }: { title: string; actions?: ReactNode; children: ReactNode }) {
  const user = useAuthStore((s) => s.user);
  const logout = useLogout();

  return (
    <div className="flex min-h-screen bg-cream-soft">
      <aside className="hidden w-60 flex-shrink-0 flex-col border-r border-line bg-cream lg:flex">
        <div className="flex h-20 items-center border-b border-line px-6">
          <img src="/images/ariafashion.png" alt="Aria Fashion" className="h-8 w-auto" />
          <span className="eyebrow ml-2 !text-ink-soft">Admin</span>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
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
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-line bg-cream px-6 py-6 sm:px-10">
          <h1 className="font-display text-2xl text-ink lg:text-3xl">{title}</h1>
          {actions ? <div className="flex items-center gap-3">{actions}</div> : null}
        </header>
        <main className="px-6 py-8 sm:px-10">{children}</main>
      </div>
    </div>
  );
}
