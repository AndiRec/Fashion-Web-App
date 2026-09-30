import { useTranslation } from "react-i18next";
import { ProductCard } from "@/components/product/ProductCard";
import { EmptyState } from "@/components/ui/EmptyState";
import type { Product } from "@/lib/types";

export function ProductGrid({ products }: { products: Product[] }) {
  const { t } = useTranslation();
  if (products.length === 0) {
    return <EmptyState title={t("shop.noProductsFound")} description={t("shop.adjustFilters")} />;
  }

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
