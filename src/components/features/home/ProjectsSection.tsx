import Image from "next/image";
import { getTranslations } from "next-intl/server";
import DragSlider from "@/components/shared/DragSlider";
import ScrollReveal from "@/components/shared/ScrollReveal";

type Project = {
  id: string;
  kicker: string;
  title: string;
  description: string;
  tags: readonly string[];
  href: string;
  repo: string;
  wip?: boolean;
};

function ProjectCard({
  inProgressLabel,
  project,
  viewRepoLabel,
}: {
  inProgressLabel: string;
  project: Project;
  viewRepoLabel: string;
}) {
  return (
    <a
      href={project.href}
      target="_blank"
      rel="noopener noreferrer"
      className="group block h-full overflow-hidden rounded-3xl border border-border bg-card/40 transition-colors hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-ring/50"
      aria-label={`${viewRepoLabel}: ${project.title}`}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        <Image
          src={`https://opengraph.github.com/repo/${project.repo}`}
          alt={project.title}
          fill
          sizes="(max-width: 640px) 82vw, 50vw"
          className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <span className="absolute right-4 top-4 flex size-10 items-center justify-center rounded-full bg-background/80 text-foreground opacity-0 backdrop-blur transition-all duration-300 group-hover:opacity-100">
          <svg
            aria-hidden="true"
            className="size-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.7"
          >
            <path d="M7 17 17 7" />
            <path d="M8 7h9v9" />
          </svg>
        </span>
        {project.wip && (
          <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-background/80 px-3 py-1 text-xs text-primary backdrop-blur">
            <span className="size-1.5 rounded-full bg-primary" />
            {inProgressLabel}
          </span>
        )}
      </div>

      <div className="p-6 text-center sm:text-left">
        <div className="flex flex-col items-center justify-between gap-1 sm:flex-row sm:items-center sm:gap-4">
          <h3 className="font-heading text-2xl tracking-tight text-foreground">
            {project.title}
          </h3>
          <span className="font-mono text-xs text-muted-foreground">
            {project.id}
          </span>
        </div>
        <p className="mt-1 text-sm text-primary">{project.kicker}</p>
        <p className="mt-3 text-pretty text-sm leading-relaxed text-muted-foreground">
          {project.description}
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-2 sm:justify-start">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground transition-colors group-hover:text-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </a>
  );
}

export default async function ProjectsSection() {
  const t = await getTranslations("projects");
  const projects: Project[] = [
    {
      id: "01",
      kicker: t("items.handbook.kicker"),
      title: t("items.handbook.title"),
      description: t("items.handbook.description"),
      tags: [
        t("items.handbook.tagNext"),
        t("items.handbook.tagFastApi"),
        t("items.handbook.tagOpenAi"),
        t("items.handbook.tagMysql"),
      ],
      href: "https://github.com/betooxx-dev/handbookai-interview-1",
      repo: "betooxx-dev/handbookai-interview-1",
    },
    {
      id: "02",
      kicker: t("items.colorEvolve.kicker"),
      title: t("items.colorEvolve.title"),
      description: t("items.colorEvolve.description"),
      tags: [
        t("items.colorEvolve.tagPython"),
        t("items.colorEvolve.tagJavascript"),
        t("items.colorEvolve.tagWcag"),
      ],
      href: "https://github.com/betooxx-dev/color-evolve",
      repo: "betooxx-dev/color-evolve",
    },
    {
      id: "03",
      kicker: t("items.spiceSnap.kicker"),
      title: t("items.spiceSnap.title"),
      description: t("items.spiceSnap.description"),
      tags: [
        t("items.spiceSnap.tagPython"),
        t("items.spiceSnap.tagDeepLearning"),
        t("items.spiceSnap.tagComputerVision"),
      ],
      href: "https://github.com/betooxx-dev/spice-snap",
      repo: "betooxx-dev/spice-snap",
    },
    {
      id: "04",
      kicker: t("items.treeCalc.kicker"),
      title: t("items.treeCalc.title"),
      description: t("items.treeCalc.description"),
      tags: [
        t("items.treeCalc.tagJavascript"),
        t("items.treeCalc.tagPython"),
        t("items.treeCalc.tagCfg"),
      ],
      href: "https://github.com/betooxx-dev/treecalc",
      repo: "betooxx-dev/treecalc",
    },
    {
      id: "05",
      kicker: t("items.letterGame.kicker"),
      title: t("items.letterGame.title"),
      description: t("items.letterGame.description"),
      tags: [
        t("items.letterGame.tagJavascript"),
        t("items.letterGame.tagWorkers"),
      ],
      href: "https://github.com/betooxx-dev/pc-juego-de-letras",
      repo: "betooxx-dev/pc-juego-de-letras",
    },
    {
      id: "06",
      kicker: t("items.barhalla.kicker"),
      title: t("items.barhalla.title"),
      description: t("items.barhalla.description"),
      tags: [t("items.barhalla.tagMvp")],
      href: "https://github.com/betooxx-dev/barhalla-mvp",
      repo: "betooxx-dev/barhalla-mvp",
      wip: true,
    },
  ];

  return (
    <section
      id="projects"
      className="flex min-h-dvh scroll-mt-24 flex-col justify-center border-t border-border py-24"
    >
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <ScrollReveal>
          <div className="flex flex-col justify-between gap-4 text-center sm:flex-row sm:items-end sm:text-left">
            <div>
              <h2 className="text-balance font-heading text-4xl leading-tight tracking-tight text-foreground sm:text-5xl">
                {t("sectionTitle")}
              </h2>
            </div>
            <p className="mx-auto max-w-xs text-sm leading-relaxed text-muted-foreground sm:mx-0">
              {t("viewRepo")}
            </p>
          </div>
        </ScrollReveal>

        <div className="mt-14 hidden gap-6 sm:grid sm:grid-cols-2">
          {projects.map((project) => (
            <ScrollReveal key={project.title}>
              <ProjectCard
                inProgressLabel={t("inProgress")}
                project={project}
                viewRepoLabel={t("viewRepo")}
              />
            </ScrollReveal>
          ))}
        </div>
      </div>

      <div className="mt-12 sm:hidden">
        <DragSlider gapClassName="gap-4" aria-label={t("sectionTitle")}>
          {projects.map((project) => (
            <article key={project.title} className="w-[82vw] max-w-xs shrink-0">
              <ProjectCard
                inProgressLabel={t("inProgress")}
                project={project}
                viewRepoLabel={t("viewRepo")}
              />
            </article>
          ))}
        </DragSlider>
      </div>
    </section>
  );
}
