import { Link } from "react-router-dom";
import { useUiStore } from "@/store/ui";
import { useRemoveWishlistItem, useWishlist } from "@/hooks/useWishlist";
import { useToastStore } from "@/store/toast";
import { getErrorMessage } from "@/lib/api";
import { PriceTag } from "@/components/product/PriceTag";
import { TrashIcon, XIcon } from "@/components/icons";

export function WishlistDrawer() {
  const { wishlistOpen, closeWishlist } = useUiStore();
  const { data: wishlist, isLoading } = useWishlist();
  const removeItem = useRemoveWishlistItem();
  const push = useToastStore((s) => s.push);

  if (!wishlistOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-ink/40" onClick={closeWishlist}>
      <div
        className="animate-slide-in-right ml-auto flex h-full w-full max-w-md flex-col bg-cream shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-line px-6 py-5">
          <h2 className="font-display text-xl">Wishlist</h2>
          <button onClick={closeWishlist} aria-label="Close wishlist">
            <XIcon />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {isLoading ? (
            <p className="text-sm text-ink-soft">Loading…</p>
          ) : !wishlist || wishlist.length === 0 ? (
            <p className="py-12 text-center text-sm text-ink-soft">No favorites yet.</p>
          ) : (
            <ul className="space-y-6">
              {wishlist.map((item) => (
                <li key={item.id} className="flex gap-4">
                  <Link to={`/products/${item.product.id}`} onClick={closeWishlist} className="h-24 w-20 flex-shrink-0 bg-mist">
                    {item.product.images[0] ? (
                      <img src={item.product.images[0].url} alt={item.product.name} className="h-full w-full object-cover" />
                    ) : null}
                  </Link>
                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm text-ink">{item.product.name}</p>
                      <button
                        onClick={() =>
                          removeItem.mutate(item.id, { onError: (err) => push(getErrorMessage(err), "error") })
                        }
                        aria-label="Remove item"
                        className="text-ink-soft hover:text-rust"
                      >
                        <TrashIcon width={16} height={16} />
                      </button>
                    </div>
                    <PriceTag product={item.product} className="text-sm" />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
