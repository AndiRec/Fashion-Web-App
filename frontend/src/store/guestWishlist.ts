import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product, WishlistItem } from "@/lib/types";

interface GuestWishlistState {
  items: WishlistItem[];
  toggleItem: (product: Product) => void;
  removeItem: (id: number) => void;
  clear: () => void;
}

/**
 * Wishlist for visitors who aren't signed in yet. Persisted to localStorage,
 * merged into the real (server) wishlist on sign-in — see mergeGuestState()
 * in hooks/useAuth.ts.
 */
export const useGuestWishlistStore = create<GuestWishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      toggleItem: (product) => {
        const exists = get().items.some((item) => item.product.id === product.id);
        set({
          items: exists
            ? get().items.filter((item) => item.product.id !== product.id)
            : [...get().items, { id: -Date.now(), product }],
        });
      },
      removeItem: (id) => set({ items: get().items.filter((item) => item.id !== id) }),
      clear: () => set({ items: [] }),
    }),
    { name: "aria-guest-wishlist" },
  ),
);
