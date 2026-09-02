import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import clsx from "clsx";
import { useLogout } from "@/hooks/useAuth";

const links = [
  { to: "/account", label: "Profile", end: true },
  { to: "/account/orders", label: "Order History", end: false },
  { to: "/account/addresses", label: "Addresses", end: false },
];

export function AccountLayout({ children }: { children: ReactNode }) {
  const logout = useLogout();

  return (
    <div className="container-boutique py-12">
      <h1 className="mb-10 text-3xl">My Account</h1>
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[220px_1fr]">
        <nav className="flex gap-2 overflow-x-auto lg:flex-col lg:gap-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                clsx(
                  "whitespace-nowrap px-3 py-2 text-sm",
                  isActive ? "bg-ink text-cream" : "text-ink-soft hover:bg-mist",
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
          <button
            onClick={() => logout.mutate()}
            className="whitespace-nowrap px-3 py-2 text-left text-sm text-ink-soft hover:bg-mist"
          >
            Sign Out
          </button>
        </nav>
        <div>{children}</div>
      </div>
    </div>
  );
}
