import { asc } from "drizzle-orm";
import { getDb, hasDatabaseUrl, schema } from "@/lib/db";
import { getCmsAboutPayload } from "@/lib/cms/service";
import { ensureProductDetailPage } from "@/lib/cms/project-detail";
import { pickLocalizedMediaUrl } from "@/lib/media/image-url";
import type { BilingualText, CmsAboutPayload, CmsLocale } from "@/lib/cms/types";
import type {
  ChatbotAdminData,
  ChatbotItemRecord,
  ChatbotProductOption,
  PublicChatbotItem,
} from "./types";

type AboutProduct = CmsAboutPayload["products"][number];

const CATEGORY_ICONS: Record<string, string> = {
  marketplace: "🛒",
  property: "🏢",
  fitness: "🏃",
  other: "✨",
};

const FALLBACK_ICON = "✨";

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function asBilingual(value: unknown): BilingualText | null {
  if (
    value &&
    typeof value === "object" &&
    "ar" in value &&
    "en" in value &&
    typeof (value as BilingualText).ar === "string" &&
    typeof (value as BilingualText).en === "string"
  ) {
    return value as BilingualText;
  }
  return null;
}

function rowToRecord(row: typeof schema.chatbotItems.$inferSelect): ChatbotItemRecord {
  return {
    id: row.id,
    productId: row.productId,
    title: asBilingual(row.titleJson),
    description: asBilingual(row.descriptionJson),
    redirectUrl: row.redirectUrl,
    icon: row.icon,
    isActive: Boolean(row.isActive),
    sortOrder: row.sortOrder,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

function productRedirect(product: AboutProduct): { slug: string | null; url: string | null } {
  const withDetail = ensureProductDetailPage(product);
  const slug = withDetail.detailPage.slug || null;
  return { slug, url: slug ? `/projects/${slug}` : null };
}

/** Options for the dashboard product picker, built from the About payload. */
export function toChatbotProductOptions(payload: CmsAboutPayload): ChatbotProductOption[] {
  return payload.products.map((product) => {
    const { url } = productRedirect(product);
    return {
      id: product.id,
      title: product.title,
      defaultDescription: {
        ar: stripHtml(product.body.html.ar),
        en: stripHtml(product.body.html.en),
      },
      slug: url ? url.replace("/projects/", "") : null,
      redirectUrl: url,
      isVisible: product.isVisible,
    };
  });
}

/** Admin dataset: every chatbot row plus the selectable products. */
export async function getChatbotAdminData(): Promise<ChatbotAdminData> {
  const payload = await getCmsAboutPayload();
  const products = toChatbotProductOptions(payload);

  if (!hasDatabaseUrl()) {
    return { items: [], products };
  }

  try {
    const db = getDb();
    const rows = await db
      .select()
      .from(schema.chatbotItems)
      .orderBy(asc(schema.chatbotItems.sortOrder), asc(schema.chatbotItems.createdAt));
    return { items: rows.map(rowToRecord), products };
  } catch {
    return { items: [], products };
  }
}

/** Enabled, localized items for the public floating widget. */
export async function getPublicChatbotItems(locale: CmsLocale): Promise<PublicChatbotItem[]> {
  if (!hasDatabaseUrl()) return [];

  let rows: (typeof schema.chatbotItems.$inferSelect)[];
  try {
    const db = getDb();
    rows = await db
      .select()
      .from(schema.chatbotItems)
      .orderBy(asc(schema.chatbotItems.sortOrder), asc(schema.chatbotItems.createdAt));
  } catch {
    return [];
  }

  if (rows.length === 0) return [];

  const payload = await getCmsAboutPayload();
  const productsById = new Map(payload.products.map((product) => [product.id, product]));

  const pick = (override: BilingualText | null, fallback: string): string => {
    const value = override?.[locale]?.trim();
    return value || fallback;
  };

  const items: PublicChatbotItem[] = [];
  for (const row of rows) {
    if (!row.isActive) continue;
    const product = productsById.get(row.productId);
    if (!product) continue; // referenced product was removed — skip gracefully

    const titleOverride = asBilingual(row.titleJson);
    const descriptionOverride = asBilingual(row.descriptionJson);
    const { url: defaultRedirect } = productRedirect(product);

    items.push({
      id: row.id,
      title: pick(titleOverride, product.title[locale]),
      description: pick(descriptionOverride, stripHtml(product.body.html[locale])),
      redirectUrl: row.redirectUrl?.trim() || defaultRedirect,
      icon: row.icon?.trim() || CATEGORY_ICONS[product.category ?? "other"] || FALLBACK_ICON,
      image: pickLocalizedMediaUrl(product.image, locale),
    });
  }

  return items;
}
