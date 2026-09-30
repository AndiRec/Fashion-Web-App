import { type FormEvent, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import { useAuthStore } from "@/store/auth";
import { useUiStore } from "@/store/ui";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { useBumpOnChange } from "@/hooks/useBump";
import { BagIcon, HeartIcon, MenuIcon, SearchIcon, UserIcon, XIcon } from "@/components/icons";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export function Header() {
  const { t } = useTranslation();
  const navLinks = [
    { label: t("nav.newCollection"), to: "/shop?new_collection=1" },
    { label: t("nav.shop"), to: "/shop" },
    { label: t("nav.sale"), to: "/shop?on_sale=1" },
    { label: t("nav.about"), to: "/about" },
  ];
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const user = useAuthStore((s) => s.user);
  const { openCart, openWishlist } = useUiStore();
  const { data: cart } = useCart();
  const { data: wishlist } = useWishlist();

  const cartCount = cart?.reduce((sum, item) => sum + item.quantity, 0) ?? 0;
  const wishlistCount = wishlist?.length ?? 0;
  const cartBumping = useBumpOnChange(cartCount);
  const wishlistBumping = useBumpOnChange(wishlistCount);

  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
  }, [searchOpen]);

  function handleSearchSubmit(e: FormEvent) {
    e.preventDefault();
    if (!searchValue.trim()) return;
    navigate(`/shop?search=${encodeURIComponent(searchValue.trim())}`);
    setSearchOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-cream/95 backdrop-blur">
      <div className="hidden bg-ink py-2 text-center text-[11px] uppercase tracking-[0.2em] text-cream sm:block">
        {t("header.banner")}
      </div>

      <div className="container-boutique grid h-20 grid-cols-[auto_1fr_auto] items-center gap-4 lg:flex lg:justify-between">
        <button className="press lg:hidden" onClick={() => setMobileOpen(true)} aria-label={t("header.openMenu")}>
          <MenuIcon />
        </button>

        <Link to="/" className="flex items-center justify-self-center gap-2 lg:justify-self-auto">
          <img src="/images/ariafashion.png" alt="Aria Fashion" className="h-11 w-auto sm:h-14" />
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
          <LanguageSwitcher className="hidden lg:flex" />
          <button className="press" onClick={() => setSearchOpen((v) => !v)} aria-label={t("header.search")} aria-expanded={searchOpen}>
            <SearchIcon />
          </button>
          <Link to={user ? (user.is_admin ? "/admin" : "/account") : "/login"} aria-label={t("header.account")} className="press">
            <UserIcon />
          </Link>
          <button onClick={openWishlist} className="press relative" aria-label={t("header.wishlist")}>
            <HeartIcon />
            {wishlistCount > 0 ? (
              <span
                className={clsx(
                  "absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-rust text-[9px] text-cream",
                  wishlistBumping && "animate-bump",
                )}
              >
                {wishlistCount}
              </span>
            ) : null}
          </button>
          <button onClick={openCart} className="press relative" aria-label={t("header.cart")}>
            <BagIcon />
            {cartCount > 0 ? (
              <span
                className={clsx(
                  "absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-ink text-[9px] text-cream",
                  cartBumping && "animate-bump",
                )}
              >
                {cartCount}
              </span>
            ) : null}
          </button>
        </div>
      </div>

      {searchOpen ? (
        <div className="border-t border-line bg-cream">
          <form onSubmit={handleSearchSubmit} className="container-boutique flex items-center gap-3 py-4">
            <SearchIcon width={18} height={18} className="flex-shrink-0 text-ink-soft" />
            <input
              ref={searchInputRef}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder={t("header.searchPlaceholder")}
              className="w-full bg-transparent text-sm text-ink placeholder:text-ink-soft/50 focus:outline-none"
            />
            <button type="button" onClick={() => setSearchOpen(false)} aria-label={t("header.closeSearch")} className="text-ink-soft">
              <XIcon width={16} height={16} />
            </button>
          </form>
        </div>
      ) : null}

      {mobileOpen
        ? createPortal(
            // Rendered into document.body rather than nested in <header>: the
            // header's backdrop-blur makes it the containing block for any
            // position:fixed descendant (that's how backdrop-filter works per
            // spec), which was collapsing this overlay down to the header's
            // own ~80px height instead of the full viewport — the nav links
            // simply overflowed past that short, solid box with no
            // background behind them, reading as "transparent".
            <div className="fixed inset-0 z-50 bg-ink/40 lg:hidden" onClick={() => setMobileOpen(false)}>
              <div
                className="animate-slide-in-left h-full w-72 overflow-y-auto bg-cream p-6 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <button onClick={() => setMobileOpen(false)} aria-label={t("header.closeMenu")} className="press mb-8">
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
                <LanguageSwitcher className="mt-8 border-t border-line pt-6" />
              </div>
            </div>,
            document.body,
          )
        : null}
    </header>
  );
}
