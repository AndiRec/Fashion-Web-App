import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, Product } from "@/lib/types";

function unitPriceOf(product: Product) {
  return product.is_on_sale ? product.sale_price : product.price;
}

interface GuestCartState {
  items: CartItem[];
  addItem: (product: Product, size: string) => void;
  updateQuantity: (id: number, quantity: number) => void;
  removeItem: (id: number) => void;
  clear: () => void;
}

/**
 * Cart for visitors who aren't signed in yet. Persisted to localStorage so
 * it survives a refresh, and merged into the real (server) cart the moment
 * they sign in — see mergeGuestState() in hooks/useAuth.ts.
 */
export const useGuestCartStore = create<GuestCartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, size) => {
        const variant = product.variants.find((v) => v.size === size);
        const maxStock = variant?.stock ?? Infinity;
        const existing = get().items.find((item) => item.product.id === product.id && item.size === size);

        if (existing) {
          const quantity = Math.min(existing.quantity + 1, maxStock);
          set({
            items: get().items.map((item) =>
              item.id === existing.id ? { ...item, quantity, line_total: unitPriceOf(product) * quantity } : item,
            ),
          });
          return;
        }

        const optimisticItem: CartItem = {
          id: -Date.now(),
          quantity: 1,
          size: size as CartItem["size"],
          available_stock: variant?.stock ?? null,
          product,
          line_total: unitPriceOf(product),
        };
        set({ items: [...get().items, optimisticItem] });
      },
      updateQuantity: (id, quantity) =>
        set({
          items: get().items.map((item) =>
            item.id === id ? { ...item, quantity, line_total: unitPriceOf(item.product) * quantity } : item,
          ),
        }),
      removeItem: (id) => set({ items: get().items.filter((item) => item.id !== id) }),
      clear: () => set({ items: [] }),
    }),
    { name: "aria-guest-cart" },
  ),
);
