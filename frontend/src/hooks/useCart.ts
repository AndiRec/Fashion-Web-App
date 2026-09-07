import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/auth";
import { useGuestCartStore } from "@/store/guestCart";
import type { CartItem, Product } from "@/lib/types";

const CART_KEY = ["cart"];

export function useCart() {
  const token = useAuthStore((s) => s.token);
  const guestItems = useGuestCartStore((s) => s.items);

  const serverQuery = useQuery({
    queryKey: CART_KEY,
    queryFn: async () => (await api.get<CartItem[]>("/cart")).data,
    enabled: !!token,
  });

  if (!token) {
    return { ...serverQuery, data: guestItems, isLoading: false, isFetching: false };
  }
  return serverQuery;
}

function unitPriceOf(product: Product) {
  return product.is_on_sale ? product.sale_price : product.price;
}

type AddToCartVars = { productId: number; size: string; product?: Product };

export function useAddToCart() {
  const token = useAuthStore((s) => s.token);
  const queryClient = useQueryClient();
  const guestAddItem = useGuestCartStore((s) => s.addItem);

  const serverMutation = useMutation({
    mutationFn: async ({ productId, size }: AddToCartVars) => (await api.post(`/cart/${productId}`, { size })).data,
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

  return {
    isPending: token ? serverMutation.isPending : false,
    mutate: (vars: AddToCartVars, opts?: { onError?: (err: unknown) => void }) => {
      if (!token) {
        if (vars.product) guestAddItem(vars.product, vars.size);
        return;
      }
      serverMutation.mutate(vars, opts);
    },
  };
}

type UpdateCartVars = { id: number; quantity: number };

export function useUpdateCartItem() {
  const token = useAuthStore((s) => s.token);
  const queryClient = useQueryClient();
  const guestUpdateQuantity = useGuestCartStore((s) => s.updateQuantity);

  const serverMutation = useMutation({
    mutationFn: async ({ id, quantity }: UpdateCartVars) => (await api.patch(`/cart/${id}`, { quantity })).data,
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

  return {
    isPending: token ? serverMutation.isPending : false,
    mutate: (vars: UpdateCartVars, opts?: { onError?: (err: unknown) => void }) => {
      if (!token) {
        guestUpdateQuantity(vars.id, vars.quantity);
        return;
      }
      serverMutation.mutate(vars, opts);
    },
  };
}

export function useRemoveCartItem() {
  const token = useAuthStore((s) => s.token);
  const queryClient = useQueryClient();
  const guestRemoveItem = useGuestCartStore((s) => s.removeItem);

  const serverMutation = useMutation({
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
