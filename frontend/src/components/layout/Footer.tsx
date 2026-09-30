import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/store/auth";

export function Footer() {
  const user = useAuthStore((s) => s.user);
  const { t } = useTranslation();

  return (
    <footer className="bg-taupe text-cream">
      <div className="container-boutique grid grid-cols-2 gap-10 py-16 sm:grid-cols-4">
        <div className="col-span-2 sm:col-span-1">
          <Link to="/">
            <img src="/images/ariafashion.png" alt="Aria Fashion" className="h-10 w-auto brightness-0 invert" />
          </Link>
          <p className="mt-3 max-w-xs text-sm text-cream/75">{t("footer.tagline")}</p>
        </div>

        <div>
          <h4 className="text-xs font-medium uppercase tracking-[0.2em] text-cream/60 mb-4">{t("footer.shop")}</h4>
          <ul className="space-y-2 text-sm text-cream/75">
            <li><Link to="/shop?new_collection=1" className="hover:text-cream">{t("footer.newCollection")}</Link></li>
            <li><Link to="/shop" className="hover:text-cream">{t("footer.allProducts")}</Link></li>
            <li><Link to="/shop?on_sale=1" className="hover:text-cream">{t("footer.sale")}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-medium uppercase tracking-[0.2em] text-cream/60 mb-4">{t("footer.account")}</h4>
          <ul className="space-y-2 text-sm text-cream/75">
            {user ? (
              <>
                <li><Link to="/account" className="hover:text-cream">{t("footer.myAccount")}</Link></li>
                <li><Link to="/account/orders" className="hover:text-cream">{t("footer.orderHistory")}</Link></li>
              </>
            ) : (
              <>
                <li><Link to="/login" className="hover:text-cream">{t("footer.signIn")}</Link></li>
                <li><Link to="/register" className="hover:text-cream">{t("footer.createAccount")}</Link></li>
              </>
            )}
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-medium uppercase tracking-[0.2em] text-cream/60 mb-4">{t("footer.visitUs")}</h4>
          <ul className="space-y-2 text-sm text-cream/75">
            <li>{t("footer.location")}</li>
            <li>{t("footer.hours")}</li>
            <li>hello@ariafashion.mk</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-cream/15 py-6">
        <p className="container-boutique text-center text-xs text-cream/60">
          {t("footer.copyright", { year: new Date().getFullYear() })}
        </p>
      </div>
    </footer>
  );
}
