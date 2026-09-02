import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuthStore } from "@/store/auth";
import { useUiStore } from "@/store/ui";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { BagIcon, HeartIcon, MenuIcon, UserIcon, XIcon } from "@/components/icons";

const navLinks = [
  { label: "New Collection", to: "/shop?new_collection=1" },
  { label: "Shop", to: "/shop" },
  { label: "Sale", to: "/shop?on_sale=1" },
  { label: "About", to: "/about" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const user = useAuthStore((s) => s.user);
  const { openCart, openWishlist } = useUiStore();
  const { data: cart } = useCart();
  const { data: wishlist } = useWishlist();

  const cartCount = cart?.reduce((sum, item) => sum + item.quantity, 0) ?? 0;
  const wishlistCount = wishlist?.length ?? 0;

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-cream/95 backdrop-blur">
      <div className="hidden bg-ink py-2 text-center text-[11px] uppercase tracking-[0.2em] text-cream sm:block">
        Boutique in Struga — free local pickup on every order
      </div>

      <div className="container-boutique flex h-20 items-center justify-between">
        <button className="lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Open menu">
          <MenuIcon />
        </button>

        <Link to="/" className="flex items-center gap-2">
          <img src="/images/ariafashion.png" alt="Aria Fashion" className="h-9 w-auto sm:h-11" />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.label}
              to={link.to}
              className="link-underline text-xs uppercase tracking-[0.15em] text-ink-soft hover:text-ink"
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-4 sm:gap-5">
          <Link to={user ? (user.is_admin ? "/admin/products" : "/account") : "/login"} aria-label="Account">
            <UserIcon />
          </Link>
          <button onClick={openWishlist} className="relative" aria-label="Wishlist">
            <HeartIcon />
            {wishlistCount > 0 ? (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-rust text-[9px] text-cream">
                {wishlistCount}
              </span>
            ) : null}
          </button>
          <button onClick={openCart} className="relative" aria-label="Cart">
            <BagIcon />
            {cartCount > 0 ? (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-ink text-[9px] text-cream">
                {cartCount}
              </span>
            ) : null}
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 bg-ink/40 lg:hidden" onClick={() => setMobileOpen(false)}>
          <div
            className="animate-slide-in-left h-full w-72 bg-cream p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={() => setMobileOpen(false)} aria-label="Close menu" className="mb-8">
              <XIcon />
            </button>
            <nav className="flex flex-col gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className="text-sm uppercase tracking-[0.15em] text-ink"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      ) : null}
    </header>
  );
}
