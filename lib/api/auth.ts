import { apiFetch } from "./client";
import type { AdminLoginInput } from "@/lib/auth/validation";

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
