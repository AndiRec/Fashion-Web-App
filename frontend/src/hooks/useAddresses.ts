import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/auth";
import type { Address } from "@/lib/types";

export type AddressInput = Omit<Address, "id">;

export function useAddresses() {
  const token = useAuthStore((s) => s.token);
  return useQuery({
    queryKey: ["addresses"],
    queryFn: async () => (await api.get<Address[]>("/addresses")).data,
    enabled: !!token,
  });
}

export function useCreateAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: AddressInput) => (await api.post<Address>("/addresses", input)).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["addresses"] }),
  });
}

export function useUpdateAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...input }: AddressInput & { id: number }) =>
      (await api.put<Address>(`/addresses/${id}`, input)).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["addresses"] }),
  });
}

export function useDeleteAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => (await api.delete(`/addresses/${id}`)).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["addresses"] }),
  });
}
