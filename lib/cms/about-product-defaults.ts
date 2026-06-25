import type { CmsAboutPayload } from "@/lib/cms/types";
import { createDefaultProjectDetailPage } from "@/lib/cms/project-detail";

export type AboutProduct = CmsAboutPayload["products"][number];

export function createDefaultAboutProduct(index: number): AboutProduct {
  return {
    id: `product-${Date.now()}`,
    number: `${String(index + 1).padStart(2, "0")}/`,
    title: { ar: "منتج جديد", en: "New product" },
    body: {
      json: { ar: "", en: "" },
      html: {
        ar: "<p>اكتب الوصف هنا.</p>",
        en: "<p>Write the description here.</p>",
      },
    },
    offersLabel: { ar: "ماذا يقدم؟", en: "What does it offer?" },
    offers: [],
    audienceLabel: { ar: "من هي الفئة المستهدفة؟", en: "Who is it for?" },
    audience: [],
    downloadTitle: {
      ar: "حمّل التطبيق واطلب الآن",
      en: "Download the app and order now",
    },
    image: {
      defaultAssetId: null,
      defaultUrl: "/figma/hero-visual.webp",
      alt: { ar: "منتج جديد", en: "New product" },
      isDecorative: false,
    },
    imageSide: "left",
    storeButtons: [],
    isVisible: true,
    detailPage: createDefaultProjectDetailPage(`product-${Date.now()}`, {
      ar: "منتج جديد",
      en: "New product",
    }),
  };
}
