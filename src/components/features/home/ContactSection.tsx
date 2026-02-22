import { getTranslations } from "next-intl/server";
import ScrollReveal from "@/components/shared/ScrollReveal";
import SocialLinks from "@/components/shared/SocialLinks";

export default async function ContactSection() {
  const t = await getTranslations("contact");

  return (
    <section className="relative bg-navy-950 py-24 md:py-32">
      {/* Top separator */}
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-accent-500/40 to-transparent" />
      {/* Subtle radial glow behind CTA */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-[400px] w-[600px] rounded-full bg-accent-700/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <ScrollReveal>
          <span className="mb-4 inline-block font-mono text-sm text-accent-500">
            {t("sectionNumber")} &middot; {t("sectionLabel")}
          </span>

          <h2 className="font-heading text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
            {t("title1")}
            <br />
            <span className="text-accent-400">{t("title2")}</span>
          </h2>

          <p className="mx-auto mt-6 max-w-lg text-lg text-navy-300">
            {t("description")}
          </p>

          <a
            href="mailto:contacto@betooxx.dev"
            className="mt-8 inline-block rounded-sm bg-accent-500 px-8 py-3 font-medium text-white transition-colors hover:bg-accent-600"
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
