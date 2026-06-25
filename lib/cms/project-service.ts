import { getLocale } from "next-intl/server";
import type { CmsLocale } from "./types";
import { getCmsAboutPayload } from "./service";
import {
  ensureAboutProductsDetailPages,
  findProjectProduct,
  listEnabledProjectSlugs,
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
  return listEnabledProjectSlugs(payload);
}
