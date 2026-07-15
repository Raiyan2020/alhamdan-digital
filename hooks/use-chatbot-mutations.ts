"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createChatbotItem,
  deleteChatbotItem,
  updateChatbotItem,
} from "@/lib/api/chatbot";
import { queryKeys } from "@/lib/query/keys";
import type {
  ChatbotItemCreateInput,
  ChatbotItemUpdateInput,
} from "@/lib/chatbot/validation";

export function useCreateChatbotItemMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: ChatbotItemCreateInput) => createChatbotItem(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.chatbot.admin });
    },
  });
}

export function useUpdateChatbotItemMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: ChatbotItemUpdateInput }) =>
      updateChatbotItem(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.chatbot.admin });
    },
  });
}

export function useDeleteChatbotItemMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteChatbotItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.chatbot.admin });
    },
  });
}
