import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useProduct } from "@/hooks/useProducts";
import { useAddToCart } from "@/hooks/useCart";
import { useToggleWishlist, useWishlist } from "@/hooks/useWishlist";
import { useBumpOnChange } from "@/hooks/useBump";
import { useToastStore } from "@/store/toast";
import { useUiStore } from "@/store/ui";
import { getErrorMessage } from "@/lib/api";
import { categoryLabel } from "@/lib/format";
import { PriceTag } from "@/components/product/PriceTag";
import { Button } from "@/components/ui/Button";
import { BackButton } from "@/components/ui/BackButton";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { ChevronLeftIcon, ChevronRightIcon, HeartIcon, XIcon, ZoomInIcon } from "@/components/icons";
import clsx from "clsx";

export function ProductDetail() {
  const { id } = useParams();
  const { data: product, isLoading } = useProduct(id);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const galleryRef = useRef<HTMLDivElement>(null);
  const imageCount = product?.images.length ?? 0;

  function scrollToImage(index: number) {
    const el = galleryRef.current;
    if (!el) return;
    el.scrollTo({ left: index * el.clientWidth, behavior: "smooth" });
    setActiveImage(index);
  }

  function goToImage(index: number) {
    if (imageCount === 0) return;
    scrollToImage(((index % imageCount) + imageCount) % imageCount);
  }

  function handleGalleryScroll() {
    const el = galleryRef.current;
    if (!el || el.clientWidth === 0) return;
    setActiveImage(Math.round(el.scrollLeft / el.clientWidth));
  }

  useEffect(() => {
    if (!lightboxOpen) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowLeft") goToImage(activeImage - 1);
      if (e.key === "ArrowRight") goToImage(activeImage + 1);
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightboxOpen, activeImage, imageCount]);

  const addToCart = useAddToCart();
  const toggleWishlist = useToggleWishlist();
  const { data: wishlist } = useWishlist();
  const push = useToastStore((s) => s.push);
  const openCart = useUiStore((s) => s.openCart);
  const isWishlisted = wishlist?.some((item) => item.product.id === product?.id) ?? false;
  const justWishlisted = useBumpOnChange(isWishlisted);

  if (isLoading) {
    return (
      <div className="container-boutique py-12">
        <Skeleton className="mb-8 h-3 w-32" />
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <Skeleton className="aspect-[3/4] w-full" />
          <div className="space-y-4 lg:pt-4">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-11 w-full max-w-sm" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container-boutique">
        <EmptyState
          title="Product not found"
          description="This item may have been removed or is no longer available."
          action={
            <Link to="/shop">
              <Button>Back to Shop</Button>
            </Link>
          }
        />
      </div>
    );
  }

  const variant = product.variants.find((v) => v.size === selectedSize);
  const outOfStock = (product.total_stock ?? 0) <= 0;

  function handleAddToCart() {
    if (!selectedSize) {
      push("Please select a size.", "error");
      return;
    }
    // Give feedback immediately rather than waiting on the network — the
    // cache is already updated optimistically by the mutation itself.
    push("Added to your bag.");
    openCart();
    addToCart.mutate(
      { productId: product!.id, size: selectedSize, product },
      { onError: (err) => push(getErrorMessage(err), "error") },
    );
  }

  function handleWishlist() {
    if (!product) return;
    toggleWishlist.mutate(product, { onError: (err) => push(getErrorMessage(err), "error") });
  }

  return (
    <div className="container-boutique py-12">
      <div className="mb-5">
        <BackButton fallback="/shop" />
      </div>
      <nav className="mb-8 hidden text-xs text-ink-soft sm:block">
        <Link to="/shop" className="hover:text-ink">
          Shop
        </Link>
        <span className="mx-2">/</span>
        <span>{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div>
          <div className="relative">
            <div
              ref={galleryRef}
              onScroll={handleGalleryScroll}
              className="flex aspect-[3/4] w-full snap-x snap-mandatory overflow-x-auto scroll-smooth bg-mist [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {product.images.length > 0 ? (
                product.images.map((img) => (
                  <div key={img.id} className="group/image relative w-full flex-shrink-0 snap-center">
                    <img
                      src={img.url}
                      alt={product.name}
                      onClick={() => setLightboxOpen(true)}
                      className="h-full w-full cursor-zoom-in object-cover"
                    />
                    <div className="pointer-events-none absolute bottom-3 right-3 hidden items-center justify-center rounded-full bg-cream/90 p-2 opacity-0 shadow-sm backdrop-blur transition-opacity duration-200 group-hover/image:opacity-100 sm:flex">
                      <ZoomInIcon width={16} height={16} className="text-ink" />
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex w-full flex-shrink-0 snap-center items-center justify-center text-ink-soft/40">
                  Aria Fashion
                </div>
              )}
            </div>

            {imageCount > 1 ? (
              <>
                <button
                  onClick={() => goToImage(activeImage - 1)}
                  aria-label="Previous photo"
                  className="press absolute left-3 top-1/2 hidden -translate-y-1/2 items-center justify-center rounded-full bg-cream/90 p-2 text-ink shadow-sm backdrop-blur hover:bg-cream sm:flex"
                >
                  <ChevronLeftIcon width={20} height={20} />
                </button>
                <button
                  onClick={() => goToImage(activeImage + 1)}
                  aria-label="Next photo"
                  className="press absolute right-3 top-1/2 hidden -translate-y-1/2 items-center justify-center rounded-full bg-cream/90 p-2 text-ink shadow-sm backdrop-blur hover:bg-cream sm:flex"
                >
                  <ChevronRightIcon width={20} height={20} />
                </button>
              </>
            ) : null}
          </div>

          {product.images.length > 1 ? (
            <>
              {/* Swipe position dots — mobile */}
              <div className="mt-3 flex justify-center gap-1.5 sm:hidden">
                {product.images.map((img, i) => (
                  <button
                    key={img.id}
                    onClick={() => scrollToImage(i)}
                    aria-label={`View photo ${i + 1} of ${product.images.length}`}
                    className={clsx(
                      "h-1.5 rounded-full transition-all duration-200",
                      i === activeImage ? "w-6 bg-ink" : "w-1.5 bg-ink/25",
                    )}
                  />
                ))}
              </div>

              {/* Click-to-jump thumbnails — desktop */}
              <div className="mt-3 hidden gap-3 sm:flex">
                {product.images.map((img, i) => (
                  <button
                    key={img.id}
                    onClick={() => scrollToImage(i)}
                    className={clsx("h-20 w-16 overflow-hidden border", i === activeImage ? "border-ink" : "border-transparent")}
                  >
                    <img src={img.url} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            </>
          ) : null}
        </div>

        <div className="lg:pt-4">
          <p className="eyebrow mb-2">{categoryLabel(product.category)}</p>
          <h1 className="mb-4 text-3xl">{product.name}</h1>
          <PriceTag product={product} className="mb-6 text-lg" />

          <p className="mb-8 text-sm leading-relaxed text-ink-soft">{product.description}</p>

          <div className="mb-8">
            <h3 className="eyebrow mb-3">Size</h3>
            <div className="flex flex-wrap gap-2">
              {product.variants.map((v) => (
                <button
                  key={v.id}
                  disabled={v.stock < 1}
                  onClick={() => setSelectedSize(v.size)}
                  className={clsx(
                    "flex h-11 w-11 items-center justify-center border text-sm transition-colors",
                    v.stock < 1
                      ? "border-line text-ink-soft/30 line-through"
                      : selectedSize === v.size
                        ? "border-ink bg-ink text-cream"
                        : "border-line text-ink hover:border-ink",
                  )}
                >
                  {v.size}
                </button>
              ))}
            </div>
            {variant && variant.stock <= 5 && variant.stock > 0 ? (
              <p className="mt-2 text-xs text-rust">Only {variant.stock} left in size {variant.size}</p>
            ) : null}
          </div>

          <div className="flex gap-3">
            <Button size="lg" className="flex-1" onClick={handleAddToCart} loading={addToCart.isPending} disabled={outOfStock}>
              {outOfStock ? "Sold Out" : "Add to Bag"}
            </Button>
            <button
              onClick={handleWishlist}
              aria-label="Toggle wishlist"
              aria-pressed={isWishlisted}
              className="press flex h-[52px] w-[52px] flex-shrink-0 items-center justify-center border border-ink"
            >
              <HeartIcon
                filled={isWishlisted}
                className={clsx(isWishlisted && "text-rust", justWishlisted && "animate-bump")}
              />
            </button>
          </div>

          <dl className="mt-10 space-y-2 border-t border-line pt-6 text-xs text-ink-soft">
            {product.color ? (
              <div className="flex justify-between">
                <dt>Color</dt>
                <dd className="capitalize text-ink">{product.color}</dd>
              </div>
            ) : null}
            <div className="flex justify-between">
              <dt>Category</dt>
              <dd className="text-ink">{categoryLabel(product.category)}</dd>
            </div>
          </dl>
        </div>
      </div>

      {lightboxOpen && imageCount > 0 ? (
        <div className="fixed inset-0 z-50 bg-ink/95" onClick={() => setLightboxOpen(false)}>
          <button
            onClick={() => setLightboxOpen(false)}
            aria-label="Close"
            className="press absolute right-4 top-4 text-cream sm:right-6 sm:top-6"
          >
            <XIcon width={26} height={26} />
          </button>

          {imageCount > 1 ? (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToImage(activeImage - 1);
                }}
                aria-label="Previous photo"
                className="press absolute left-2 top-1/2 -translate-y-1/2 text-cream sm:left-6"
              >
                <ChevronLeftIcon width={32} height={32} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToImage(activeImage + 1);
                }}
                aria-label="Next photo"
                className="press absolute right-2 top-1/2 -translate-y-1/2 text-cream sm:right-6"
              >
                <ChevronRightIcon width={32} height={32} />
              </button>
            </>
          ) : null}

          <div className="flex h-full w-full items-center justify-center p-6 sm:p-16" onClick={(e) => e.stopPropagation()}>
            <img
              src={product.images[activeImage]?.url}
              alt={product.name}
              className="max-h-full max-w-full object-contain"
            />
          </div>

          {imageCount > 1 ? (
            <p className="absolute bottom-5 left-1/2 -translate-x-1/2 text-xs tracking-wide text-cream/70">
              {activeImage + 1} / {imageCount}
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
