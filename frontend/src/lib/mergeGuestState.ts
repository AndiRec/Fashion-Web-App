import { api } from "@/lib/api";
import { useGuestCartStore } from "@/store/guestCart";
import { useGuestWishlistStore } from "@/store/guestWishlist";
import type { WishlistItem } from "@/lib/types";

/**
 * Folds whatever a visitor added to their cart/wishlist before signing in
 * into their real account, then clears the local guest state. Call this
 * right after setSession() so the auth token is already in place.
 */
export async function mergeGuestState(): Promise<void> {
  const cartItems = useGuestCartStore.getState().items;
  const wishlistItems = useGuestWishlistStore.getState().items;

  if (cartItems.length === 0 && wishlistItems.length === 0) return;

  for (const item of cartItems) {
    for (let i = 0; i < item.quantity; i++) {
      try {
        await api.post(`/cart/${item.product.id}`, { size: item.size });
      } catch {
        // Out of stock or otherwise rejected — skip rather than block sign-in.
      }
    }
  }

  if (wishlistItems.length > 0) {
    try {
      const existing = (await api.get<WishlistItem[]>("/wishlist")).data;
      const existingIds = new Set(existing.map((item) => item.product.id));

      for (const item of wishlistItems) {
        if (!existingIds.has(item.product.id)) {
          await api.post(`/wishlist/${item.product.id}/toggle`);
        }
      }
    } catch {
      // Best-effort merge; a failure here shouldn't block sign-in.
    }
  }

  useGuestCartStore.getState().clear();
  useGuestWishlistStore.getState().clear();
}
