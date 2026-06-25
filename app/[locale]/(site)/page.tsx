import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { DesktopHome } from "@/components/home/DesktopHome";
import { ResponsiveHome } from "@/components/home/ResponsiveHome";
import { getHomeContent } from "@/lib/i18n/home-content";
import { getCmsHomePayload } from "@/lib/cms/service";
import type { Locale } from "@/i18n/routing";

type Props = {
  params: Promise<{ locale: Locale }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const payload = await getCmsHomePayload();

  return {
    title: payload.seo.metaTitle[locale],
    description: payload.seo.metaDescription[locale],
    openGraph: {
      title: payload.seo.ogTitle[locale],
      description: payload.seo.ogDescription[locale],
    },
  };
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const content = await getHomeContent();

  return (
    <main className="min-h-screen max-w-full overflow-x-clip bg-page">
      <ResponsiveHome content={content} />
      <DesktopHome content={content} />
    </main>
  );
}
