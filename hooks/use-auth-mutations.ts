import { useMutation } from "@tanstack/react-query";
import { loginAdmin, logoutAdmin } from "@/lib/api/auth";
import type { AdminLoginInput } from "@/lib/auth/validation";

export function useLoginAdminMutation() {
  return useMutation({
    mutationFn: (input: AdminLoginInput) => loginAdmin(input),
  });
}

export function useLogoutAdminMutation() {
  return useMutation({
    mutationFn: logoutAdmin,
  });
}
