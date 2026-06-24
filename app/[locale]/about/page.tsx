import { AboutPage } from "@/components/about/AboutPage";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";

type Props = {
  params: Promise<{ locale: Locale }>;
};

export default async function AboutRoute({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <AboutPage />;
}
