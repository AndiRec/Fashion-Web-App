import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import clsx from "clsx";

const links = [
  { to: "/admin/products", label: "Products" },
  { to: "/admin/orders", label: "Orders" },
];

export function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="container-boutique py-12">
      <div className="mb-10 flex items-center justify-between">
        <h1 className="text-3xl">Admin</h1>
        <nav className="flex gap-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                clsx("px-4 py-2 text-xs uppercase tracking-wider", isActive ? "bg-ink text-cream" : "text-ink-soft hover:bg-mist")
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
      {children}
    </div>
  );
}
