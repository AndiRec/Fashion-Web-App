import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useWishlist } from "@/hooks/useWishlist";
import { ProductGrid } from "@/components/product/ProductGrid";
import { EmptyState } from "@/components/ui/EmptyState";
import { Spinner } from "@/components/ui/Spinner";
import { Button } from "@/components/ui/Button";
import { BackButton } from "@/components/ui/BackButton";

export function Wishlist() {
  const { t } = useTranslation();
  const { data: wishlist, isLoading } = useWishlist();

  if (isLoading) return <Spinner className="py-32" />;

  return (
    <div className="container-boutique py-12">
      <BackButton fallback="/shop" className="mb-5" />
      <h1 className="mb-10 text-3xl">{t("wishlist.title")}</h1>
      {!wishlist || wishlist.length === 0 ? (
        <EmptyState
          title={t("wishlist.emptyTitle")}
          description={t("wishlist.emptyDescription")}
          action={
            <Link to="/shop">
              <Button>{t("wishlist.exploreShop")}</Button>
            </Link>
          }
        />
      ) : (
        <ProductGrid products={wishlist.map((item) => item.product)} />
      )}
    </div>
  );
}
