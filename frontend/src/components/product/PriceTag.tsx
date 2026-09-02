import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/types";

export function PriceTag({ product, className = "" }: { product: Product; className?: string }) {
  if (!product.is_on_sale) {
    return <span className={className}>{formatPrice(product.price)}</span>;
  }

  return (
    <span className={`flex items-baseline gap-2 ${className}`}>
      <span className="text-rust">{formatPrice(product.sale_price)}</span>
      <span className="text-ink-soft/60 line-through">{formatPrice(product.price)}</span>
    </span>
  );
}
