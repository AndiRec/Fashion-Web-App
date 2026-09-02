import { create } from "zustand";

interface UiState {
  cartOpen: boolean;
  wishlistOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  openWishlist: () => void;
  closeWishlist: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  cartOpen: false,
  wishlistOpen: false,
  openCart: () => set({ cartOpen: true, wishlistOpen: false }),
  closeCart: () => set({ cartOpen: false }),
  openWishlist: () => set({ wishlistOpen: true, cartOpen: false }),
  closeWishlist: () => set({ wishlistOpen: false }),
}));
