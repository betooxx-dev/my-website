import Image from "next/image";
import { getTranslations } from "next-intl/server";
import ScrollReveal from "@/components/shared/ScrollReveal";
import SectionHeader from "@/components/shared/SectionHeader";

export default async function AboutSection() {
  const t = await getTranslations("about");

  return (
    <section className="relative bg-mint-50 py-24 md:py-32">
      {/* Top separator */}
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-pine-900/20 to-transparent" />

      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader
          number={t("sectionNumber")}
          label={t("sectionLabel")}
          title={t("sectionTitle")}
          tone="dark"
        />

        <div className="grid gap-12 md:grid-cols-12 md:gap-16">
          {/* Photo */}
          <ScrollReveal direction="left" className="md:col-span-5">
            <div className="relative">
              <div className="relative aspect-4/5 overflow-hidden rounded-3xl bg-pine-700">
                <Image
                  src="/images/about-photo.jpg"
                  alt="betooxx"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 40vw"
                />
              </div>
              {/* Decorative frame */}
              <div className="absolute -right-3 -bottom-3 -z-10 h-full w-full rounded-3xl border-2 border-pine-700/25" />
            </div>
          </ScrollReveal>

          {/* Text */}
          <ScrollReveal direction="right" className="md:col-span-7">
            <div className="space-y-6">
              <p className="drop-cap text-lg leading-relaxed text-pine-900/90">
                {t("paragraph1")}
              </p>

              {/* Pull quote */}
              <blockquote className="border-l-2 border-pine-700/50 py-2 pl-6">
                <p className="font-heading text-xl italic text-pine-900">
                  &ldquo;{t("quote")}&rdquo;
                </p>
              </blockquote>

              <p className="text-base leading-relaxed text-pine-700/85">
                {t("paragraph2")}
              </p>

              <p className="text-base leading-relaxed text-pine-700/85">
                {t("paragraph3")}
              </p>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
