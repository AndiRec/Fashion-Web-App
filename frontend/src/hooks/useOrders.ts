import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/auth";
import type { Order, OrderStatus, Paginated } from "@/lib/types";

export function useMyOrders() {
  const token = useAuthStore((s) => s.token);
  return useQuery({
    queryKey: ["orders", "mine"],
    queryFn: async () => (await api.get<Order[]>("/my-orders")).data,
    enabled: !!token,
  });
}

export function useOrder(id: number | string | undefined) {
  return useQuery({
    queryKey: ["orders", id],
    queryFn: async () => (await api.get<Order>(`/orders/${id}`)).data,
    enabled: id !== undefined,
  });
}

export function useCancelOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => (await api.post<Order>(`/orders/${id}/cancel`)).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["orders"] }),
  });
}

export interface CheckoutInput {
  phone: string;
  address_id?: number;
  street_address?: string;
  city?: string;
  postal_code?: string;
  country?: string;
}

export function useCheckout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CheckoutInput) => (await api.post<Order>("/checkout", input)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}

export function useAdminOrders(status?: OrderStatus | "") {
  return useQuery({
    queryKey: ["admin-orders", status],
    queryFn: async () =>
      (await api.get<Paginated<Order>>("/admin/orders", { params: status ? { status } : {} })).data,
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: number; status: OrderStatus }) =>
      (await api.post<Order>(`/admin/orders/${id}/status`, { status })).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-orders"] }),
  });
}
