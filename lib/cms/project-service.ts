import { getLocale } from "next-intl/server";
import type { CmsLocale } from "./types";
import { getCmsAboutPayload } from "./service";
import {
  ensureAboutProductsDetailPages,
  ensureProductDetailPage,
  findProjectProduct,
  localizeProjectPage,
  type LocalizedProjectPage,
} from "./project-detail";

export async function getLocalizedProjectBySlug(slug: string): Promise<LocalizedProjectPage | null> {
  const locale = (await getLocale()) as CmsLocale;
  const payload = ensureAboutProductsDetailPages(await getCmsAboutPayload());
  const product = findProjectProduct(payload, slug);

  return product ? localizeProjectPage(product, locale) : null;
}

export async function getEnabledProjectSlugs(): Promise<string[]> {
  const payload = ensureAboutProductsDetailPages(await getCmsAboutPayload());
  return payload.products
    .filter((p) => p.isVisible)
    .map((p) => ensureProductDetailPage(p))
    .filter((p) => p.detailPage.slug)
    .map((p) => p.detailPage.slug);
}

export async function getLocalizedProjects(): Promise<LocalizedProjectPage[]> {
  const locale = (await getLocale()) as CmsLocale;
  const payload = ensureAboutProductsDetailPages(await getCmsAboutPayload());
  return payload.products
    .map((product) => ensureProductDetailPage(product))
    .filter((product) => product.isVisible)
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    .map((product) => localizeProjectPage(product, locale));
}
