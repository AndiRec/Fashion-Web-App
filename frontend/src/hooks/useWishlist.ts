import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/auth";
import type { Product, WishlistItem } from "@/lib/types";

const WISHLIST_KEY = ["wishlist"];

export function useWishlist() {
  const token = useAuthStore((s) => s.token);
  return useQuery({
    queryKey: WISHLIST_KEY,
    queryFn: async () => (await api.get<WishlistItem[]>("/wishlist")).data,
    enabled: !!token,
  });
}

export function useToggleWishlist() {
  const queryClient = useQueryClient();
  return useMutation({
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
}

export function useRemoveWishlistItem() {
  const queryClient = useQueryClient();
  return useMutation({
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
}
