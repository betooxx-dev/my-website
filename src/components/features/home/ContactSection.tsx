import { getTranslations } from "next-intl/server";
import MagneticButton from "@/components/shared/MagneticButton";
import ScrollReveal from "@/components/shared/ScrollReveal";
import SocialLinks from "@/components/shared/SocialLinks";

export default async function ContactSection() {
  const t = await getTranslations("contact");
  const tCommon = await getTranslations("common");

  return (
    <section className="relative overflow-hidden bg-pine-900 py-32 md:py-40">
      {/* Hairline divider with amber accent */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/30 to-transparent" />

      {/* Aurora glow behind CTA */}
      <div className="aurora" aria-hidden />

      {/* Secondary radial — pulls focus center */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="h-[500px] w-[700px] rounded-full bg-amber-400/[0.06] blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-5xl px-6 text-center">
        <ScrollReveal>
          <div className="mb-8 flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-amber-400/60" />
            <span className="font-mono text-[11px] tracking-[0.3em] text-amber-400 uppercase">
              {t("sectionNumber")} · {t("sectionLabel")}
            </span>
            <span className="h-px w-8 bg-amber-400/60" />
          </div>

          <h2
            className="font-heading font-bold leading-[0.95] tracking-[-0.03em] text-mint-50 text-balance"
            style={{ fontSize: "clamp(3rem, 8vw, 6.5rem)" }}
          >
            {t("title1")}
            <br />
            <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 bg-clip-text italic text-transparent">
              {t("title2")}
            </span>
          </h2>

          <p className="mx-auto mt-8 max-w-xl text-lg leading-relaxed text-mint-50/60 md:text-xl">
            {t("description")}
          </p>

          {/* Dual CTA */}
          <div className="mt-12 flex flex-col items-center justify-center gap-5 sm:flex-row sm:gap-4">
            {/* Primary — magnetic */}
            <div className="relative">
              <MagneticButton
                href="https://zifra.mx"
                external
                strength={14}
                className="relative z-10 inline-block cursor-pointer rounded-full bg-amber-400 px-10 py-4 font-medium text-pine-900 shadow-[0_10px_40px_-10px_rgba(212,165,116,0.6)] transition-colors duration-300 hover:bg-amber-300"
              >
                <span className="relative flex items-center gap-2">
                  {t("ctaZifra")}
                  <svg
                    aria-hidden
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <title>{tCommon("externalLink")}</title>
                    <path d="M7 17L17 7M7 7h10v10" strokeLinecap="round" />
                  </svg>
                </span>
              </MagneticButton>
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-full border border-amber-400/50"
                style={{ animation: "pulseRing 2.8s ease-out infinite" }}
              />
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-full border border-amber-400/30"
                style={{
                  animation: "pulseRing 2.8s ease-out infinite",
                  animationDelay: "1.4s",
                }}
              />
            </div>

            {/* Secondary — email */}
            <MagneticButton
              href="mailto:avendanoargueta.josealberto@gmail.com"
              strength={10}
              className="inline-block cursor-pointer rounded-full border border-mint-50/20 bg-mint-50/[0.03] px-10 py-4 font-medium text-mint-50/80 backdrop-blur-sm transition-all duration-300 hover:border-mint-50/40 hover:bg-mint-50/[0.06] hover:text-mint-50"
            >
              {t("cta")}
            </MagneticButton>
          </div>

          <div className="mt-16 flex justify-center">
            <SocialLinks />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
