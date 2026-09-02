import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/auth";
import type { CartItem } from "@/lib/types";

export function useCart() {
  const token = useAuthStore((s) => s.token);
  return useQuery({
    queryKey: ["cart"],
    queryFn: async () => (await api.get<CartItem[]>("/cart")).data,
    enabled: !!token,
  });
}

export function useAddToCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ productId, size }: { productId: number; size: string }) =>
      (await api.post(`/cart/${productId}`, { size })).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, quantity }: { id: number; quantity: number }) =>
      (await api.patch(`/cart/${id}`, { quantity })).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });
}

export function useRemoveCartItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => (await api.delete(`/cart/${id}`)).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });
}
