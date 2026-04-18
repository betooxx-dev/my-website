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

      <div className="relative z-10 mx-auto grid min-h-screen w-full max-w-7xl grid-cols-1 items-center gap-12 px-6 pb-20 pt-32 sm:px-10 md:grid-cols-[minmax(300px,420px)_1fr] md:gap-16 md:px-16 md:pt-36">
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

              {/* Inner editorial label at bottom of card */}
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5">
                <span className="font-mono text-[9px] tracking-[0.3em] text-mint-50/70 uppercase">
                  {t("portraitCode")}
                </span>
                <span className="h-px w-10 bg-amber-400/70" />
              </div>
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
        <div className="relative">
          {/* Greeting eyebrow */}
          <div className="mb-6 overflow-hidden">
            <div className="hero-text-line flex items-center gap-3">
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
                <span className="text-amber-400">.</span>
              </h1>
            </div>
          </div>

          {/* Hairline underline that draws in */}
          <div className="mt-5 mb-7 h-px max-w-sm bg-gradient-to-r from-amber-400/80 via-amber-400/40 to-transparent hero-line-draw" />

          {/* Italic subtitle + description */}
          <div className="overflow-hidden">
            <div className="hero-text-line">
              <p
                className="font-heading italic text-mint-50/70"
                style={{ fontSize: "clamp(1.25rem, 2.3vw, 2rem)" }}
              >
                {t("title")}
              </p>
              <p className="mt-5 max-w-md text-[17px] leading-relaxed text-mint-50/55 md:text-lg">
                {t("subtitle")}
              </p>
            </div>
          </div>

          {/* Status chip + social */}
          <div className="overflow-hidden">
            <div className="hero-text-line mt-10 flex flex-wrap items-center gap-6">
              <span className="inline-flex items-center gap-2.5 rounded-full border border-amber-400/25 bg-amber-400/[0.06] px-3.5 py-1.5 backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-400" />
                </span>
                <span className="font-mono text-[10px] tracking-[0.25em] text-amber-200/90 uppercase">
                  {t("availableLabel")}
                </span>
              </span>

              <div className="flex items-center gap-4">
                <span className="h-px w-8 bg-mint-50/20" />
                <SocialLinks tone="lightSolid" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2">
        <span className="font-mono text-[9px] tracking-[0.3em] text-mint-50/30 uppercase">
          Scroll
        </span>
        <div className="h-10 w-[1px] animate-pulse bg-gradient-to-b from-amber-400/60 to-transparent" />
      </div>
    </section>
  );
}
