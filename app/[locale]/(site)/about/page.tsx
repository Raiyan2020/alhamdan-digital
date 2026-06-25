import { AboutPage } from "@/components/about/AboutPage";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { pickLocalizedMediaUrl } from "@/lib/media/image-url";
import { getAboutContent, getCmsAboutPayload } from "@/lib/cms/service";

type Props = {
  params: Promise<{ locale: Locale }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const payload = await getCmsAboutPayload();
  const seo = payload.seo;
  const ogImage = seo.ogImage
    ? pickLocalizedMediaUrl(seo.ogImage, locale)
    : undefined;

  return {
    title: seo.metaTitle[locale],
    description: seo.metaDescription[locale],
    openGraph: {
      title: seo.ogTitle[locale],
      description: seo.ogDescription[locale],
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
  };
}

export default async function AboutRoute({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const content = await getAboutContent();

  return <AboutPage content={content} />;
}
