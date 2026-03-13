import { getTranslations } from "next-intl/server";
import ScrollReveal from "@/components/shared/ScrollReveal";
import SocialLinks from "@/components/shared/SocialLinks";

export default async function ContactSection() {
  const t = await getTranslations("contact");

  return (
    <section className="relative -mt-10 rounded-t-[2.5rem] bg-pine-900 pb-24 pt-32 md:-mt-14 md:rounded-t-[3rem] md:pb-32 md:pt-36">
      {/* Top separator */}
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-amber-400/30 to-transparent" />

      {/* Radial glows */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-[500px] w-[700px] rounded-full bg-amber-400/5 blur-3xl" />
      </div>
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-[300px] w-[400px] rounded-full bg-pine-700/40 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <ScrollReveal>
          <span className="mb-4 inline-block font-mono text-sm text-amber-400/80">
            {t("sectionNumber")} &middot; {t("sectionLabel")}
          </span>

          <h2 className="font-heading text-4xl font-bold tracking-tight text-mint-50 sm:text-5xl md:text-6xl">
            {t("title1")}
            <br />
            <span className="bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
              {t("title2")}
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-lg text-lg text-mint-50/65">
            {t("description")}
          </p>

          {/* Dual CTA */}
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            {/* Primary — Zifra */}
            <div className="relative">
              <a
                href="https://zifra.mx"
                target="_blank"
                rel="noopener noreferrer"
                className="relative z-10 inline-block rounded-full bg-amber-400 px-10 py-4 font-medium text-pine-900 transition-all duration-300 hover:bg-amber-300 hover:shadow-[0_0_40px_rgba(212,165,116,0.25)]"
              >
                {t("ctaZifra")}
              </a>
              <span
                className="absolute inset-0 rounded-full border border-amber-400/40"
                style={{ animation: "pulseRing 2.5s ease-out infinite" }}
              />
            </div>

            {/* Secondary — email */}
            <a
              href="mailto:contacto@betooxx.dev"
              className="inline-block rounded-full border border-mint-50/20 px-10 py-4 font-medium text-mint-50/70 transition-all duration-300 hover:border-mint-50/40 hover:text-mint-50"
            >
              {t("cta")}
            </a>
          </div>

          <div className="mt-12 flex justify-center">
            <SocialLinks />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
