import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/auth";
import type { User } from "@/lib/types";

interface AuthResponse {
  user: User;
  token: string;
}

export function useLogin() {
  const setSession = useAuthStore((s) => s.setSession);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: { email: string; password: string }) =>
      (await api.post<AuthResponse>("/login", input)).data,
    onSuccess: (data) => {
      setSession(data.user, data.token);
      queryClient.invalidateQueries();
    },
  });
}

export interface RegisterInput {
  name: string;
  phone: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export function useRegister() {
  const setSession = useAuthStore((s) => s.setSession);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: RegisterInput) => (await api.post<AuthResponse>("/register", input)).data,
    onSuccess: (data) => {
      setSession(data.user, data.token);
      queryClient.invalidateQueries();
    },
  });
}

export function useLogout() {
  const logout = useAuthStore((s) => s.logout);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => (await api.post("/logout")).data,
    onSettled: () => {
      logout();
      queryClient.clear();
    },
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: async (email: string) => (await api.post<{ message: string }>("/forgot-password", { email })).data,
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: async (input: {
      token: string;
      email: string;
      password: string;
      password_confirmation: string;
    }) => (await api.post<{ message: string }>("/reset-password", input)).data,
  });
}

export function useUpdateProfile() {
  const setUser = useAuthStore((s) => s.setUser);
  return useMutation({
    mutationFn: async (input: { name: string; email: string; phone: string }) =>
      (await api.put<User>("/profile", input)).data,
    onSuccess: (user) => setUser(user),
  });
}

export function useUpdatePassword() {
  return useMutation({
    mutationFn: async (input: {
      current_password: string;
      password: string;
      password_confirmation: string;
    }) => (await api.put<{ message: string }>("/profile/password", input)).data,
  });
}

export function useDeleteAccount() {
  const logout = useAuthStore((s) => s.logout);
  return useMutation({
    mutationFn: async (password: string) => (await api.delete("/profile", { data: { password } })).data,
    onSuccess: () => logout(),
  });
}
