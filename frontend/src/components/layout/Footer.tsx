import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t border-line bg-cream-soft">
      <div className="container-boutique grid grid-cols-2 gap-10 py-16 sm:grid-cols-4">
        <div className="col-span-2 sm:col-span-1">
          <Link to="/">
            <img src="/images/ariafashion.png" alt="Aria Fashion" className="h-10 w-auto" />
          </Link>
          <p className="mt-3 max-w-xs text-sm text-ink-soft">
            A boutique in Struga crafting timeless, effortless pieces for everyday elegance.
          </p>
        </div>

        <div>
          <h4 className="eyebrow mb-4">Shop</h4>
          <ul className="space-y-2 text-sm text-ink-soft">
            <li><Link to="/shop?new_collection=1" className="hover:text-ink">New Collection</Link></li>
            <li><Link to="/shop" className="hover:text-ink">All Products</Link></li>
            <li><Link to="/shop?on_sale=1" className="hover:text-ink">Sale</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="eyebrow mb-4">Account</h4>
          <ul className="space-y-2 text-sm text-ink-soft">
            <li><Link to="/account" className="hover:text-ink">My Account</Link></li>
            <li><Link to="/account/orders" className="hover:text-ink">Order History</Link></li>
            <li><Link to="/login" className="hover:text-ink">Sign In</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="eyebrow mb-4">Visit Us</h4>
          <ul className="space-y-2 text-sm text-ink-soft">
            <li>Struga, North Macedonia</li>
            <li>Mon – Sat, 09:00 – 19:00</li>
            <li>hello@ariafashion.mk</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line py-6">
        <p className="container-boutique text-center text-xs text-ink-soft">
          © {new Date().getFullYear()} Aria Fashion, Struga. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
