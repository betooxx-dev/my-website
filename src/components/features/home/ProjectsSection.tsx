import { getTranslations } from "next-intl/server";
import SectionHeader from "@/components/shared/SectionHeader";
import WipSpinner from "@/components/shared/WipSpinner";

export default async function ProjectsSection() {
  const t = await getTranslations("projects");

  return (
    <section className="relative -mt-10 rounded-t-[2.5rem] bg-mint-50 pb-24 pt-32 md:-mt-14 md:rounded-t-[3rem] md:pb-32 md:pt-36">
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-pine-900/20 to-transparent" />

      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader
          number={t("sectionNumber")}
          label={t("sectionLabel")}
          title={t("sectionTitle")}
          tone="dark"
        />
        <WipSpinner tone="dark" />
      </div>
    </section>
  );
}
