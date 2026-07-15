import type { BilingualText } from "@/lib/cms/types";

/**
 * A chatbot item as stored/returned by the admin API. It references an existing
 * About-payload product (`productId`); `title`/`description`/`redirectUrl` are
 * optional overrides — when empty the product's own values are used.
 */
export type ChatbotItemRecord = {
  id: string;
  productId: string;
  title: BilingualText | null;
  description: BilingualText | null;
  redirectUrl: string | null;
  icon: string | null;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

/** Lightweight product option surfaced in the dashboard product picker. */
export type ChatbotProductOption = {
  id: string;
  title: BilingualText;
  defaultDescription: BilingualText;
  slug: string | null;
  redirectUrl: string | null;
  isVisible: boolean;
};

/** Fully localized item consumed by the public floating widget. */
export type PublicChatbotItem = {
  id: string;
  title: string;
  description: string;
  redirectUrl: string | null;
  icon: string;
  image: string | null;
};

export type ChatbotAdminData = {
  items: ChatbotItemRecord[];
  products: ChatbotProductOption[];
};
