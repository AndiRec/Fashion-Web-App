import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/auth";
import { useGuestWishlistStore } from "@/store/guestWishlist";
import type { Product, WishlistItem } from "@/lib/types";

const WISHLIST_KEY = ["wishlist"];

export function useWishlist() {
  const token = useAuthStore((s) => s.token);
  const guestItems = useGuestWishlistStore((s) => s.items);

  const serverQuery = useQuery({
    queryKey: WISHLIST_KEY,
    queryFn: async () => (await api.get<WishlistItem[]>("/wishlist")).data,
    enabled: !!token,
  });

  if (!token) {
    return { ...serverQuery, data: guestItems, isLoading: false, isFetching: false };
  }
  return serverQuery;
}

export function useToggleWishlist() {
  const token = useAuthStore((s) => s.token);
  const queryClient = useQueryClient();
  const guestToggleItem = useGuestWishlistStore((s) => s.toggleItem);

  const serverMutation = useMutation({
    mutationFn: async (product: Product) =>
      (await api.post<{ status: "added" | "removed"; message: string }>(`/wishlist/${product.id}/toggle`)).data,
    onMutate: async (product) => {
      await queryClient.cancelQueries({ queryKey: WISHLIST_KEY });
      const previous = queryClient.getQueryData<WishlistItem[]>(WISHLIST_KEY);
      const alreadyIn = previous?.some((item) => item.product.id === product.id) ?? false;

      queryClient.setQueryData<WishlistItem[]>(WISHLIST_KEY, (old = []) =>
        alreadyIn
          ? old.filter((item) => item.product.id !== product.id)
          : [...old, { id: -Date.now(), product }],
      );

      return { previous };
    },
    onError: (_err, _product, context) => {
      if (context?.previous) queryClient.setQueryData(WISHLIST_KEY, context.previous);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: WISHLIST_KEY }),
  });

  return {
    isPending: token ? serverMutation.isPending : false,
    mutate: (product: Product, opts?: { onError?: (err: unknown) => void }) => {
      if (!token) {
        guestToggleItem(product);
        return;
      }
      serverMutation.mutate(product, opts);
    },
  };
}

export function useRemoveWishlistItem() {
  const token = useAuthStore((s) => s.token);
  const queryClient = useQueryClient();
  const guestRemoveItem = useGuestWishlistStore((s) => s.removeItem);

  const serverMutation = useMutation({
    mutationFn: async (id: number) => (await api.delete(`/wishlist/${id}`)).data,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: WISHLIST_KEY });
      const previous = queryClient.getQueryData<WishlistItem[]>(WISHLIST_KEY);

      queryClient.setQueryData<WishlistItem[]>(WISHLIST_KEY, (old = []) => old.filter((item) => item.id !== id));

      return { previous };
    },
    onError: (_err, _id, context) => {
      if (context?.previous) queryClient.setQueryData(WISHLIST_KEY, context.previous);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: WISHLIST_KEY }),
  });

  return {
    isPending: token ? serverMutation.isPending : false,
    mutate: (id: number, opts?: { onError?: (err: unknown) => void }) => {
      if (!token) {
        guestRemoveItem(id);
        return;
      }
      serverMutation.mutate(id, opts);
    },
  };
}
