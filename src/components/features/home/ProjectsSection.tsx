import { getTranslations } from "next-intl/server";
import SectionHeader from "@/components/shared/SectionHeader";
import StaggerContainer from "@/components/shared/StaggerContainer";
import StaggerItem from "@/components/shared/StaggerItem";
import { projects } from "@/data/projects";
import ProjectCard from "./ProjectCard";

export default async function ProjectsSection() {
  const t = await getTranslations("projects");

  const featured = projects.find((p) => p.featured);
  const secondary = projects.filter((p) => !p.featured);

  return (
    <section className="relative bg-navy-950 py-24 md:py-32">
      {/* Top separator */}
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-accent-500/40 to-transparent" />

      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader
          number={t("sectionNumber")}
          label={t("sectionLabel")}
          title={t("sectionTitle")}
        />

        <StaggerContainer className="grid gap-6 md:grid-cols-12">
          {/* Featured project */}
          {featured && (
            <StaggerItem className="md:col-span-7 md:row-span-2">
              <ProjectCard
                title={t(`items.${featured.slug}.title`)}
                description={t(`items.${featured.slug}.description`)}
                image={featured.image}
                tags={featured.tags}
                href={featured.href}
                index={0}
                featured
              />
            </StaggerItem>
          )}

          {/* Secondary projects */}
          {secondary.map((project, i) => (
            <StaggerItem key={project.slug} className="md:col-span-5">
              <ProjectCard
                title={t(`items.${project.slug}.title`)}
                description={t(`items.${project.slug}.description`)}
                image={project.image}
                tags={project.tags}
                href={project.href}
                index={i + 1}
              />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
