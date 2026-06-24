import type { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Geist, Geist_Mono, IBM_Plex_Sans_Arabic } from "next/font/google";
import { MotionProvider, SmoothScrollProvider } from "@/components/motion";
import { SiteLoadingOverlay } from "@/components/layout/SiteLoadingOverlay";
import { SiteShell } from "@/components/layout/SiteShell";
import { routing, type Locale } from "@/i18n/routing";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  variable: "--font-ibm-plex-arabic",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      dir="ltr"
      className={`${geistSans.variable} ${geistMono.variable} ${ibmPlexArabic.variable} h-full antialiased`}
    >
      <body className="flex min-h-full max-w-full flex-col overflow-x-clip font-sans">
        <NextIntlClientProvider messages={messages}>
          <MotionProvider>
            <SmoothScrollProvider>
              <SiteLoadingOverlay />
              <SiteShell>{children}</SiteShell>
            </SmoothScrollProvider>
          </MotionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
