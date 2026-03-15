import Image from "next/image";
import { getTranslations } from "next-intl/server";
import SocialLinks from "@/components/shared/SocialLinks";

export default async function HeroSection() {
  const t = await getTranslations("hero");

  return (
    <section id="top" className="relative h-screen overflow-hidden bg-pine-900">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/banner-com-02.png"
          alt={t("bannerAlt")}
          fill
          sizes="100vw"
          className="object-cover object-[70%_center] md:object-left"
          priority
          quality={90}
        />
        {/* Neutral dark overlay for text legibility — no green tint */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col justify-end pb-12">
        <div className="w-full px-6 sm:px-10 md:px-20">
          {/* Hero Text */}
          <div className="mb-10 max-w-3xl overflow-hidden">
            <div className="hero-text-line">
              <span className="font-mono text-sm tracking-widest text-amber-400 uppercase">
                {t("greeting")}
              </span>
            </div>
            <div className="hero-text-line mt-2">
              <h1 className="font-heading text-5xl font-bold tracking-tight text-mint-50 sm:text-7xl md:text-8xl">
                {t("name")}
                <span className="text-amber-400">.</span>
              </h1>
            </div>
            <div className="hero-text-line mt-1">
              <p className="font-heading text-2xl font-light italic text-mint-50/60 sm:text-3xl md:text-4xl">
                {t("title")}
              </p>
            </div>
          </div>

          {/* Subtitle + Social */}
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="hero-text-line max-w-md">
              <p className="text-base leading-relaxed text-mint-50/70">
                {t("subtitle")}
              </p>
            </div>
            <div className="px-2">
              <p className="mb-3 text-sm font-medium text-mint-50/50">
                {t("socialLabel")}
              </p>
              <SocialLinks tone="lightSolid" />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2">
        <div className="h-8 w-[1px] animate-pulse bg-gradient-to-b from-amber-400/60 to-transparent" />
      </div>
    </section>
  );
}
