import Image from "next/image";
import { getTranslations } from "next-intl/server";
import SocialLinks from "@/components/shared/SocialLinks";
import TiltCard from "@/components/shared/TiltCard";

export default async function HeroSection() {
  const t = await getTranslations("hero");

  return (
    <section
      id="top"
      className="relative min-h-screen overflow-hidden bg-pine-900"
    >
      {/* Aurora — biased to the right so it reinforces the type block */}
      <div className="aurora absolute inset-0 translate-x-1/4" aria-hidden />

      <div className="relative z-10 mx-auto grid min-h-screen w-full max-w-5xl grid-cols-1 items-center gap-12 px-6 pb-20 pt-32 sm:px-10 md:grid-cols-[minmax(300px,420px)_1fr] md:gap-16 md:px-10 md:pt-36">
        {/* LEFT — Portrait card */}
        <div className="hero-card-reveal mx-auto w-full max-w-[360px] md:max-w-none">
          <TiltCard max={4} glare={false} className="group relative">
            <div
              className="relative aspect-[4/5] w-full overflow-hidden rounded-[28px]"
              style={{
                boxShadow:
                  "0 30px 80px -20px rgba(0,0,0,0.75), 0 0 0 1px rgba(245,245,247,0.06) inset",
              }}
            >
              <Image
                src="/banner-com-02.png"
                alt={t("bannerAlt")}
                fill
                sizes="(max-width: 768px) 90vw, 420px"
                className="object-cover object-[60%_center]"
                priority
                quality={85}
              />
              {/* Bottom-anchoring gradient for the caption below */}
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-pine-900/40 via-transparent to-transparent"
              />
            </div>

            {/* Corner brackets — editorial crop marks */}
            <span
              aria-hidden
              className="pointer-events-none absolute -top-2 -left-2 h-5 w-5 border-t border-l border-amber-400/70"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute -top-2 -right-2 h-5 w-5 border-t border-r border-amber-400/70"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute -bottom-2 -left-2 h-5 w-5 border-b border-l border-amber-400/70"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute -bottom-2 -right-2 h-5 w-5 border-b border-r border-amber-400/70"
            />
          </TiltCard>

          {/* Editorial caption below the card */}
          <p className="mt-5 text-center font-mono text-[10px] tracking-[0.3em] text-mint-50/40 uppercase md:text-left">
            {t("portraitLabel")}
          </p>
        </div>

        {/* RIGHT — Editorial type block */}
        <div className="relative text-center md:text-left">
          {/* Greeting eyebrow */}
          <div className="mb-6 overflow-hidden">
            <div className="hero-text-line flex items-center justify-center gap-3 md:justify-start">
              <span className="h-px w-8 bg-amber-400/60" />
              <span className="font-mono text-[11px] tracking-[0.3em] text-amber-400 uppercase">
                {t("greeting")}
              </span>
            </div>
          </div>

          {/* Display name */}
          <div className="overflow-hidden">
            <div className="hero-text-line">
              <h1
                className="font-heading font-bold leading-[0.9] tracking-[-0.04em] text-mint-50"
                style={{ fontSize: "clamp(4rem, 10vw, 9rem)" }}
              >
                {t("name")}
              </h1>
            </div>
          </div>

          {/* Hairline underline that draws in */}
          <div className="mt-5 mb-7 h-px max-w-sm bg-gradient-to-r from-amber-400/80 via-amber-400/40 to-transparent hero-line-draw mx-auto md:mx-0" />

          {/* Italic subtitle + description */}
          <div className="overflow-hidden">
            <div className="hero-text-line">
              <p
                className="font-heading italic text-mint-50/70"
                style={{ fontSize: "clamp(1.25rem, 2.3vw, 2rem)" }}
              >
                {t("title")}
              </p>
              <p className="mt-5 max-w-md text-[17px] leading-relaxed text-mint-50/55 md:text-lg mx-auto md:mx-0">
                {t("subtitle")}
              </p>
            </div>
          </div>

          {/* Social links */}
          <div className="overflow-hidden">
            <div className="hero-text-line mt-10 flex flex-wrap items-center justify-center gap-6 md:justify-start">
              <SocialLinks tone="lightSolid" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
