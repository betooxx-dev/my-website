import { getTranslations } from "next-intl/server";
import ProjectBento from "@/components/features/home/ProjectBento";
import ScrollReveal from "@/components/shared/ScrollReveal";
import SectionHeader from "@/components/shared/SectionHeader";

export default async function ProjectsSection() {
  const t = await getTranslations("projects");

  return (
    <section className="relative bg-pine-900 py-24 md:py-32">
      <div className="mx-auto max-w-5xl px-6 md:px-10">
        <ScrollReveal>
          <SectionHeader
            number={t("sectionNumber")}
            label={t("sectionLabel")}
            title={t("sectionTitle")}
            tone="light"
          />
        </ScrollReveal>

        <ProjectBento
          inProgressLabel={t("inProgress")}
          viewRepoLabel={t("viewRepo")}
        />
      </div>
    </section>
  );
}
