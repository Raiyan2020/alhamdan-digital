import type { CmsAboutPayload, CmsHomePayload } from "@/lib/cms/types";

export type DashboardStats = {
  homeSections: number;
  homeProducts: number;
  homeServices: number;
  aboutProducts: number;
  navLinks: number;
  mediaFields: number;
};

export function getDashboardStats(
  home: CmsHomePayload,
  about: CmsAboutPayload,
): DashboardStats {
  return {
    homeSections: 12,
    homeProducts: about.products.length,
    homeServices: home.services.items.length,
    aboutProducts: about.products.length,
    navLinks: home.nav.length,
    mediaFields: countMediaFields(home, about),
  };
}

function countMediaFields(home: CmsHomePayload, about: CmsAboutPayload) {
  let count = 0;
  const bump = (value: unknown) => {
    if (value) count += 1;
  };

  bump(home.header.logo);
  bump(home.loading.animation);
  bump(home.hero.brushImage);
  bump(home.hero.personImage);
  bump(home.seo.ogImage);
  bump(home.why.phoneFrameImage);
  bump(home.why.screenImage);
  bump(home.market.visualImage);
  bump(home.footer.logo);
  for (const product of about.products) bump(product.image);

  return count;
}
