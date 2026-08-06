import { getTranslations } from "next-intl/server";
import ScrollReveal from "@/components/shared/ScrollReveal";
import KiwiWalkLoader from "./KiwiWalkLoader";

export default async function ProjectsSection() {
  const t = await getTranslations("projects");

  return (
    <section
      id="projects"
      className="flex min-h-dvh scroll-mt-24 flex-col justify-center border-t border-border py-24"
    >
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <ScrollReveal>
          <div className="text-center sm:text-left">
            <h2 className="text-balance font-heading text-4xl leading-tight tracking-tight text-foreground sm:text-5xl">
              {t("sectionTitle")}
            </h2>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.12}>
          <output
            className="mx-auto mt-14 flex max-w-3xl flex-col items-center rounded-[2rem] border border-border bg-card/30 px-6 py-14 text-center sm:px-12 sm:py-16"
            aria-live="polite"
          >
            <KiwiWalkLoader label={t("loaderLabel")} />
            <p className="mt-7 font-mono text-xs uppercase tracking-[0.3em] text-primary">
              {t("statusLabel")}
            </p>
            <h3 className="mt-4 text-balance font-heading text-3xl tracking-tight text-foreground sm:text-4xl">
              {t("statusTitle")}
            </h3>
            <p className="mt-4 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground">
              {t("statusDescription")}
            </p>
          </output>
        </ScrollReveal>
      </div>
    </section>
  );
}
