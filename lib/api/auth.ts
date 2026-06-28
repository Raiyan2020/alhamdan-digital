import { apiFetch } from "./client";
import type {
  AdminLoginInput,
  AdminPasswordChangeInput,
  AdminProfileInput,
} from "@/lib/auth/validation";

type LoginResponse = {
  ok: true;
};

export async function loginAdmin(input: AdminLoginInput) {
  return apiFetch<LoginResponse>("/api/admin/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
}

export async function logoutAdmin() {
  return apiFetch<{ ok: true }>("/api/admin/auth/logout", {
    method: "POST",
  });
}

export type AdminProfileResponse = {
  ok: true;
  admin: {
    id: string;
    email: string;
    name: string;
  };
};

export async function updateAdminProfile(input: AdminProfileInput) {
  return apiFetch<AdminProfileResponse>("/api/admin/profile", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type: "profile", ...input }),
  });
}

export async function updateAdminPassword(input: AdminPasswordChangeInput) {
  return apiFetch<AdminProfileResponse>("/api/admin/profile", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type: "password", ...input }),
  });
}
