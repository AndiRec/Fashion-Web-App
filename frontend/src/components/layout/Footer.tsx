import { Link } from "react-router-dom";
import { useAuthStore } from "@/store/auth";

export function Footer() {
  const user = useAuthStore((s) => s.user);

  return (
    <footer className="bg-taupe text-cream">
      <div className="container-boutique grid grid-cols-2 gap-10 py-16 sm:grid-cols-4">
        <div className="col-span-2 sm:col-span-1">
          <Link to="/">
            <img src="/images/ariafashion.png" alt="Aria Fashion" className="h-10 w-auto brightness-0 invert" />
          </Link>
          <p className="mt-3 max-w-xs text-sm text-cream/75">
            A boutique in Struga crafting timeless, effortless pieces for everyday elegance.
          </p>
        </div>

        <div>
          <h4 className="text-xs font-medium uppercase tracking-[0.2em] text-cream/60 mb-4">Shop</h4>
          <ul className="space-y-2 text-sm text-cream/75">
            <li><Link to="/shop?new_collection=1" className="hover:text-cream">New Collection</Link></li>
            <li><Link to="/shop" className="hover:text-cream">All Products</Link></li>
            <li><Link to="/shop?on_sale=1" className="hover:text-cream">Sale</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-medium uppercase tracking-[0.2em] text-cream/60 mb-4">Account</h4>
          <ul className="space-y-2 text-sm text-cream/75">
            {user ? (
              <>
                <li><Link to="/account" className="hover:text-cream">My Account</Link></li>
                <li><Link to="/account/orders" className="hover:text-cream">Order History</Link></li>
              </>
            ) : (
              <>
                <li><Link to="/login" className="hover:text-cream">Sign In</Link></li>
                <li><Link to="/register" className="hover:text-cream">Create Account</Link></li>
              </>
            )}
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-medium uppercase tracking-[0.2em] text-cream/60 mb-4">Visit Us</h4>
          <ul className="space-y-2 text-sm text-cream/75">
            <li>Struga, North Macedonia</li>
            <li>Mon – Sat, 09:00 – 19:00</li>
            <li>hello@ariafashion.mk</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-cream/15 py-6">
        <p className="container-boutique text-center text-xs text-cream/60">
          © {new Date().getFullYear()} Aria Fashion, Struga. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
