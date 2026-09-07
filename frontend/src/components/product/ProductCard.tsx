import type { MouseEvent } from "react";
import { Link } from "react-router-dom";
import clsx from "clsx";
import { useToggleWishlist, useWishlist } from "@/hooks/useWishlist";
import { useToastStore } from "@/store/toast";
import { useBumpOnChange } from "@/hooks/useBump";
import { getErrorMessage } from "@/lib/api";
import { HeartIcon } from "@/components/icons";
import { PriceTag } from "@/components/product/PriceTag";
import { categoryLabel } from "@/lib/format";
import type { Product } from "@/lib/types";

export function ProductCard({ product }: { product: Product }) {
  const { data: wishlist } = useWishlist();
  const toggleWishlist = useToggleWishlist();
  const push = useToastStore((s) => s.push);

  const isWishlisted = wishlist?.some((item) => item.product.id === product.id) ?? false;
  const justWishlisted = useBumpOnChange(isWishlisted);
  const image = product.images[0]?.url;
  const soldOut = (product.total_stock ?? 1) <= 0;

  function handleWishlist(e: MouseEvent) {
    e.preventDefault();
    toggleWishlist.mutate(product, {
      onError: (err) => push(getErrorMessage(err), "error"),
    });
  }

  return (
    <Link to={`/products/${product.id}`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden bg-mist">
        {image ? (
          <img
            src={image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-ink-soft/40">Aria Fashion</div>
        )}

        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {product.new_collection ? (
            <span className="bg-ink px-2.5 py-1 text-[10px] uppercase tracking-wider text-cream">New</span>
          ) : null}
          {product.is_on_sale ? (
            <span className="bg-rust px-2.5 py-1 text-[10px] uppercase tracking-wider text-cream">
              -{product.discount_percentage}%
            </span>
          ) : null}
          {soldOut ? (
            <span className="bg-cream px-2.5 py-1 text-[10px] uppercase tracking-wider text-ink">Sold out</span>
          ) : null}
        </div>

        <button
          onClick={handleWishlist}
          aria-label="Toggle wishlist"
          aria-pressed={isWishlisted}
          className="press absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-cream/90 text-ink opacity-100 backdrop-blur transition-opacity duration-200 hover:bg-cream sm:opacity-0 sm:group-hover:opacity-100"
        >
          <HeartIcon
            filled={isWishlisted}
            width={16}
            height={16}
            className={clsx(isWishlisted && "text-rust", justWishlisted && "animate-bump")}
          />
        </button>
      </div>

      <div className="mt-3 space-y-1">
        <p className="eyebrow">{categoryLabel(product.category)}</p>
        <h3 className="text-sm text-ink">{product.name}</h3>
        <PriceTag product={product} className="text-sm" />
      </div>
    </Link>
  );
}
