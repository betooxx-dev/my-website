import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";
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

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("metadata");
  return {
    metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
    title: {
      default: t("title"),
      template: "%s | Alberto",
    },
    description: t("description"),
    icons: {
      icon: "/icon.svg",
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html lang={locale}>
      <body
        className={`${fontSans.variable} ${fontMono.variable} bg-background text-foreground antialiased overflow-x-hidden`}
        suppressHydrationWarning
      >
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
