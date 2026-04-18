import { getTranslations } from "next-intl/server";
import BlogPreviewCards from "@/components/features/home/BlogPreviewCards";
import ScrollReveal from "@/components/shared/ScrollReveal";
import SectionHeader from "@/components/shared/SectionHeader";

export default async function BlogPreviewSection() {
  const t = await getTranslations("blog");

  return (
    <section className="relative bg-pine-900 py-24 md:py-32">
      {/* Hairline separator */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-mint-50/10 to-transparent" />

      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <ScrollReveal>
          <SectionHeader
            number={t("sectionNumber")}
            label={t("sectionLabel")}
            title={t("sectionTitle")}
            tone="light"
          />
        </ScrollReveal>

        <BlogPreviewCards comingSoonLabel={t("comingSoon")} />
      </div>
    </section>
  );
}
