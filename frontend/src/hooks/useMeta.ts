import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Meta } from "@/lib/types";

export function useMeta() {
  return useQuery({
    queryKey: ["meta"],
    queryFn: async () => (await api.get<Meta>("/meta")).data,
    staleTime: Infinity,
  });
}
