import type { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Geist, Geist_Mono, IBM_Plex_Sans_Arabic } from "next/font/google";
import { MotionProvider, SmoothScrollProvider } from "@/components/motion";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { LocaleDirectionProvider } from "@/components/providers/LocaleDirectionProvider";
import { ThemeProvider } from "@/components/theme";
import { Toaster } from "@/components/ui/sonner";
import { getDirection, routing, type Locale } from "@/i18n/routing";
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
  const direction = getDirection(locale as Locale);

  return (
    <html
      lang={locale}
      dir={direction}
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${ibmPlexArabic.variable} h-full antialiased`}
    >
      <body
        dir={direction}
        className="flex min-h-full max-w-full flex-col overflow-x-clip bg-page font-sans text-ink"
      >
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var e=document.documentElement,t=localStorage.getItem("theme")||"light",n=t==="system"?window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light":t;e.classList.remove("light","dark"),e.classList.add(n),e.style.colorScheme=n}catch(e){}})();`,
          }}
          suppressHydrationWarning
        />
        <ThemeProvider>
          <NextIntlClientProvider messages={messages}>
            <LocaleDirectionProvider direction={direction}>
              <QueryProvider>
                <MotionProvider>
                  <SmoothScrollProvider>{children}</SmoothScrollProvider>
                </MotionProvider>
              </QueryProvider>
              <Toaster richColors closeButton position="top-center" />
            </LocaleDirectionProvider>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
