import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/auth";
import type { CartItem, Product } from "@/lib/types";

const CART_KEY = ["cart"];

export function useCart() {
  const token = useAuthStore((s) => s.token);
  return useQuery({
    queryKey: CART_KEY,
    queryFn: async () => (await api.get<CartItem[]>("/cart")).data,
    enabled: !!token,
  });
}

function unitPriceOf(product: Product) {
  return product.is_on_sale ? product.sale_price : product.price;
}

export function useAddToCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ productId, size }: { productId: number; size: string; product?: Product }) =>
      (await api.post(`/cart/${productId}`, { size })).data,
    onMutate: async ({ productId, size, product }) => {
      if (!product) return;
      await queryClient.cancelQueries({ queryKey: CART_KEY });
      const previous = queryClient.getQueryData<CartItem[]>(CART_KEY);

      queryClient.setQueryData<CartItem[]>(CART_KEY, (old = []) => {
        const existing = old.find((item) => item.product.id === productId && item.size === size);
        if (existing) {
          const quantity = existing.quantity + 1;
          return old.map((item) =>
            item.id === existing.id ? { ...item, quantity, line_total: unitPriceOf(product) * quantity } : item,
          );
        }
        const variant = product.variants.find((v) => v.size === size);
        const optimisticItem: CartItem = {
          id: -Date.now(),
          quantity: 1,
          size: size as CartItem["size"],
          available_stock: variant?.stock ?? null,
          product,
          line_total: unitPriceOf(product),
        };
        return [...old, optimisticItem];
      });

      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) queryClient.setQueryData(CART_KEY, context.previous);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: CART_KEY }),
  });
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, quantity }: { id: number; quantity: number }) =>
      (await api.patch(`/cart/${id}`, { quantity })).data,
    onMutate: async ({ id, quantity }) => {
      await queryClient.cancelQueries({ queryKey: CART_KEY });
      const previous = queryClient.getQueryData<CartItem[]>(CART_KEY);

      queryClient.setQueryData<CartItem[]>(CART_KEY, (old = []) =>
        old.map((item) =>
          item.id === id ? { ...item, quantity, line_total: unitPriceOf(item.product) * quantity } : item,
        ),
      );

      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) queryClient.setQueryData(CART_KEY, context.previous);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: CART_KEY }),
  });
}

export function useRemoveCartItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => (await api.delete(`/cart/${id}`)).data,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: CART_KEY });
      const previous = queryClient.getQueryData<CartItem[]>(CART_KEY);

      queryClient.setQueryData<CartItem[]>(CART_KEY, (old = []) => old.filter((item) => item.id !== id));

      return { previous };
    },
    onError: (_err, _id, context) => {
      if (context?.previous) queryClient.setQueryData(CART_KEY, context.previous);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: CART_KEY }),
  });
}
