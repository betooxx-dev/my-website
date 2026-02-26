import { getTranslations } from "next-intl/server";
import ScrollReveal from "@/components/shared/ScrollReveal";
import SocialLinks from "@/components/shared/SocialLinks";

export default async function ContactSection() {
  const t = await getTranslations("contact");

  return (
    <section className="relative -mt-10 rounded-t-[2.5rem] bg-pine-900 pb-24 pt-32 md:-mt-14 md:rounded-t-[3rem] md:pb-32 md:pt-36">
      {/* Top separator */}
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-mint-50/30 to-transparent" />
      {/* Subtle radial glow behind CTA */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-[400px] w-[600px] rounded-full bg-pine-700/50 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <ScrollReveal>
          <span className="mb-4 inline-block font-mono text-sm text-mint-50/80">
            {t("sectionNumber")} &middot; {t("sectionLabel")}
          </span>

          <h2 className="font-heading text-4xl font-bold tracking-tight text-mint-50 sm:text-5xl md:text-6xl">
            {t("title1")}
            <br />
            <span className="inline-block bg-mint-50 px-2 text-pine-900">
              {t("title2")}
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-lg text-lg text-mint-50/75">
            {t("description")}
          </p>

          <a
            href="mailto:contacto@betooxx.dev"
            className="mt-8 inline-block rounded-sm bg-mint-50 px-8 py-3 font-medium text-pine-900 transition-colors hover:bg-mint-50/80"
          >
            {t("cta")}
          </a>

          <div className="mt-10 flex justify-center">
            <SocialLinks />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
