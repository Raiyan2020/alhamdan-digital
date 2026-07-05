import type { CmsAboutPayload } from "@/lib/cms/types";
import { createDefaultProjectDetailPage } from "@/lib/cms/project-detail";

export type AboutProduct = CmsAboutPayload["products"][number];

export function createDefaultAboutProduct(index: number): AboutProduct {
  const id = `product-${Date.now()}`;

  return {
    id,
    number: `${String(index + 1).padStart(2, "0")}/`,
    title: { ar: "", en: "" },
    body: {
      json: { ar: "", en: "" },
      html: { ar: "", en: "" },
    },
    offersLabel: { ar: "", en: "" },
    offers: [],
    audienceLabel: { ar: "", en: "" },
    audience: [],
    downloadTitle: { ar: "", en: "" },
    image: {
      defaultAssetId: null,
      defaultUrl: "",
      alt: { ar: "", en: "" },
      isDecorative: false,
    },
    imageSide: "left",
    storeButtons: [],
    isVisible: true,
    detailPage: createDefaultProjectDetailPage(id, { ar: "", en: "" }),
  };
}
