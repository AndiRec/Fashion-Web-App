import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/auth";
import type { WishlistItem } from "@/lib/types";

export function useWishlist() {
  const token = useAuthStore((s) => s.token);
  return useQuery({
    queryKey: ["wishlist"],
    queryFn: async () => (await api.get<WishlistItem[]>("/wishlist")).data,
    enabled: !!token,
  });
}

export function useToggleWishlist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (productId: number) =>
      (await api.post<{ status: "added" | "removed"; message: string }>(`/wishlist/${productId}/toggle`)).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["wishlist"] }),
  });
}

export function useRemoveWishlistItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => (await api.delete(`/wishlist/${id}`)).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["wishlist"] }),
  });
}
