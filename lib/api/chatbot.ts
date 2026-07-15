import type { ChatbotAdminData, PublicChatbotItem } from "@/lib/chatbot/types";
import type {
  ChatbotItemCreateInput,
  ChatbotItemUpdateInput,
} from "@/lib/chatbot/validation";
import { apiFetch } from "./client";

type AdminListResponse = { ok: true } & ChatbotAdminData;
type MutationResponse = { ok: true; message?: string; id?: string };
type PublicResponse = { ok: true; items: PublicChatbotItem[] };

export async function fetchAdminChatbotData() {
  return apiFetch<AdminListResponse>("/api/admin/chatbot/items");
}

export async function createChatbotItem(input: ChatbotItemCreateInput) {
  return apiFetch<MutationResponse>("/api/admin/chatbot/items", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
}

export async function updateChatbotItem(id: string, input: ChatbotItemUpdateInput) {
  return apiFetch<MutationResponse>(`/api/admin/chatbot/items/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
}

export async function deleteChatbotItem(id: string) {
  return apiFetch<MutationResponse>(`/api/admin/chatbot/items/${id}`, {
    method: "DELETE",
  });
}

export async function fetchPublicChatbotItems(locale: string) {
  return apiFetch<PublicResponse>(
    `/api/chatbot/items?locale=${encodeURIComponent(locale)}`,
  );
}
