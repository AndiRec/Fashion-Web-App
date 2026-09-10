import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Paginated, Product } from "@/lib/types";

export interface ProductFilters {
  category?: string;
  size?: string;
  min_price?: number;
  max_price?: number;
  on_sale?: boolean;
  new_collection?: boolean;
  search?: string;
  stock_status?: "in_stock" | "low" | "out";
  sort?: "newest" | "oldest" | "price_asc" | "price_desc" | "name_asc" | "stock_asc" | "stock_desc";
  page?: number;
  per_page?: number;
}

export function useProducts(filters: ProductFilters) {
  return useQuery({
    queryKey: ["products", filters],
    queryFn: async () => (await api.get<Paginated<Product>>("/products", { params: filters })).data,
    placeholderData: (prev) => prev,
  });
}

export function useProduct(id: number | string | undefined) {
  return useQuery({
    queryKey: ["products", Number(id)],
    queryFn: async () => (await api.get<Product>(`/products/${id}`)).data,
    enabled: id !== undefined,
  });
}

export function useFeaturedProducts() {
  return useQuery({
    queryKey: ["products", "featured"],
    queryFn: async () =>
      (await api.get<{ new_collection: Product[]; on_sale: Product[] }>("/products/featured")).data,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (formData: FormData) => (await api.post<Product>("/products", formData)).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["products"] }),
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, formData }: { id: number; formData: FormData }) =>
      (await api.post<Product>(`/products/${id}`, formData)).data,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["products", variables.id] });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => (await api.delete(`/products/${id}`)).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["products"] }),
  });
}

export function useDeleteProductImage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ productId, imageId }: { productId: number; imageId: number }) =>
      (await api.delete(`/products/${productId}/images/${imageId}`)).data,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["products", variables.productId] });
    },
  });
}
