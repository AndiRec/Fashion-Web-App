import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import clsx from "clsx";
import { useLogout } from "@/hooks/useAuth";
import { LogoutIcon } from "@/components/icons";

const links = [
  { to: "/account", label: "Profile", end: true },
  { to: "/account/orders", label: "Order History", end: false },
  { to: "/account/addresses", label: "Addresses", end: false },
];

export function AccountLayout({ children }: { children: ReactNode }) {
  const logout = useLogout();

  return (
    <div className="container-boutique py-12">
      <div className="mb-10 flex items-center justify-between gap-4">
        <h1 className="text-3xl">My Account</h1>
        <button
          onClick={() => logout.mutate()}
          className="press flex items-center gap-1.5 text-xs uppercase tracking-wider text-ink-soft hover:text-ink"
        >
          <LogoutIcon width={15} height={15} />
          <span className="hidden sm:inline">Sign Out</span>
        </button>
      </div>
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[220px_1fr]">
        <nav className="flex flex-wrap gap-2 lg:flex-col lg:gap-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                clsx(
                  "whitespace-nowrap px-3 py-2 text-sm transition-colors",
                  isActive ? "bg-ink text-cream" : "text-ink-soft hover:bg-mist",
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div>{children}</div>
      </div>
    </div>
  );
}
