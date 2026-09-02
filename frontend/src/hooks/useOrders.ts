import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/auth";
import type { Order, OrderStatus, Paginated, Product } from "@/lib/types";

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

export interface AdminOrderFilters {
  status?: OrderStatus | "";
  search?: string;
  page?: number;
}

export function useAdminOrders(filters: AdminOrderFilters) {
  return useQuery({
    queryKey: ["admin-orders", filters],
    queryFn: async () =>
      (
        await api.get<Paginated<Order>>("/admin/orders", {
          params: { status: filters.status || undefined, search: filters.search || undefined, page: filters.page },
        })
      ).data,
    placeholderData: (prev) => prev,
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: number; status: OrderStatus }) =>
      (await api.post<Order>(`/admin/orders/${id}/status`, { status })).data,
    onSuccess: (order) => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      queryClient.invalidateQueries({ queryKey: ["orders", order.id] });
    },
  });
}

export interface AdminStats {
  total_revenue: number;
  total_orders: number;
  total_products: number;
  pending_orders: number;
  orders_by_status: Partial<Record<OrderStatus, number>>;
  low_stock_products: Product[];
  recent_orders: Order[];
}

export function useAdminStats() {
  return useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => (await api.get<AdminStats>("/admin/stats")).data,
  });
}
