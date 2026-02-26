import Image from "next/image";
import { getTranslations } from "next-intl/server";
import SocialLinks from "@/components/shared/SocialLinks";

export default async function HeroSection() {
  const t = await getTranslations("hero");

  return (
    <section className="relative h-screen overflow-hidden bg-pine-900">
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
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col justify-end pb-12">
        <div className="w-full px-6 sm:px-10 md:px-20">
          <div className="px-2">
            <p className="mb-3 text-sm font-medium text-mint-50">
              {t("socialLabel")}
            </p>
            <SocialLinks tone="lightSolid" />
          </div>
        </div>
      </div>
    </section>
  );
}
