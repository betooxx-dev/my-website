import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import AboutSection from "@/components/features/home/AboutSection";
import CertificationsSection from "@/components/features/home/CertificationsSection";
import ContactSection from "@/components/features/home/ContactSection";
import ExperienceSection from "@/components/features/home/ExperienceSection";
import HeroSection from "@/components/features/home/HeroSection";
import ProjectsSection from "@/components/features/home/ProjectsSection";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import { env } from "@/env";

type HomePageProps = {
  params: Promise<{ locale: "es" | "en" }>;
};

const socialProfiles = [
  "https://www.linkedin.com/in/alberto-avenda%C3%B1o",
  "https://x.com/betooxx_dev",
  "https://www.instagram.com/avendanooxx",
  "https://www.facebook.com/alberto.avendano.205880",
  "https://www.tiktok.com/@avendanooxx",
] as const;

export async function generateMetadata({
  params,
}: HomePageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  const base = env.NEXT_PUBLIC_SITE_URL;
  const pageUrl = `${base}/${locale}`;

  return {
    title: { absolute: t("title") },
    description: t("description"),
    alternates: {
      canonical: pageUrl,
      languages: {
        es: `${base}/es`,
        en: `${base}/en`,
        "x-default": base,
      },
    },
    openGraph: {
      type: "website",
      title: t("title"),
      description: t("description"),
      url: pageUrl,
      siteName: "Alberto Avendaño",
      locale: locale === "es" ? "es_MX" : "en_US",
      alternateLocale: locale === "es" ? ["en_US"] : ["es_MX"],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      creator: "@betooxx_dev",
    },
  };
}

export default async function Home({ params }: HomePageProps) {
  const { locale } = await params;
  const [metadataT, heroT] = await Promise.all([
    getTranslations({ locale, namespace: "metadata" }),
    getTranslations({ locale, namespace: "hero" }),
  ]);
  const base = env.NEXT_PUBLIC_SITE_URL;
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${base}/#person`,
    name: "Alberto Avendaño",
    url: `${base}/${locale}`,
    image: `${base}/banner-com-02.png`,
    jobTitle: heroT("title"),
    description: metadataT("description"),
    email: "avendanoargueta.josealberto@gmail.com",
    sameAs: socialProfiles,
    knowsAbout: [
      "Software engineering",
      "Product engineering",
      "Web development",
      "Operational improvement",
      "Cloud computing",
      "Cybersecurity",
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD is serialized from trusted static data and escaped for HTML.
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(personSchema).replace(/</g, "\\u003c"),
        }}
      />
      <Navbar />
      <main>
        <HeroSection />
        <ExperienceSection />
        <ProjectsSection />
        <AboutSection />
        <CertificationsSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
