import { useMutation } from "@tanstack/react-query";
import {
  loginAdmin,
  logoutAdmin,
  updateAdminPassword,
  updateAdminProfile,
} from "@/lib/api/auth";
import type {
  AdminLoginInput,
  AdminPasswordChangeInput,
  AdminProfileInput,
} from "@/lib/auth/validation";

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

export function useUpdateAdminProfileMutation() {
  return useMutation({
    mutationFn: (input: AdminProfileInput) => updateAdminProfile(input),
  });
}

export function useUpdateAdminPasswordMutation() {
  return useMutation({
    mutationFn: (input: AdminPasswordChangeInput) => updateAdminPassword(input),
  });
}
