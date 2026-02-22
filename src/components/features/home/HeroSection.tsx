import Image from "next/image";
import { getTranslations } from "next-intl/server";
import SocialLinks from "@/components/shared/SocialLinks";

export default async function HeroSection() {
  const t = await getTranslations("hero");

  return (
    <section className="relative h-screen overflow-hidden bg-navy-950">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/banner-com-02.png"
          alt="Banner principal"
          fill
          className="object-cover object-[70%_center] md:object-left"
          priority
          quality={90}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col justify-end pb-12">
        <div className="w-full px-6 sm:px-10 md:px-20">
          <h1 className="font-heading text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-7xl lg:text-9xl">
            Create.
            <br />
            <span className="text-accent-400">Build.</span> Inspire.
          </h1>

          <div className="mt-8 px-2">
            <p className="mb-3 text-sm font-medium text-navy-200">
              {t("socialLabel")}
            </p>
            <SocialLinks />
          </div>
        </div>
      </div>
    </section>
  );
}
