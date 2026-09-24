import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import { siteProfile } from "@/config/site-profile";
import { env } from "@/env";
import { routing } from "@/i18n/routing";
import "@/styles/globals.css";

const fontSans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const fontMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

type LocaleLayoutProps = Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>;

export async function generateMetadata({
  params,
}: LocaleLayoutProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
    title: {
      default: t("title"),
      template: `%s | ${siteProfile.name}`,
    },
    description: t("description"),
    authors: [
      {
        name: siteProfile.name,
        url: `${env.NEXT_PUBLIC_SITE_URL}/${locale}`,
      },
    ],
    creator: siteProfile.name,
    publisher: siteProfile.name,
    category: "technology",
    robots: {
      index: true,
      follow: true,
    },
    icons: {
      icon: "/icon.svg",
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  return (
    <html data-scroll-behavior="smooth" lang={locale}>
      <body
        className={`${fontSans.variable} ${fontMono.variable} bg-background text-foreground antialiased overflow-x-hidden`}
        suppressHydrationWarning
      >
        <NextIntlClientProvider>
          <Navbar />
          {children}
          <Footer />
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  );
}
