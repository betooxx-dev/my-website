import { getTranslations } from "next-intl/server";
import ScrollReveal from "@/components/shared/ScrollReveal";

function LayersIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
    >
      <path d="m12 2 8 4-8 4-8-4 8-4Z" />
      <path d="m4 12 8 4 8-4" />
      <path d="m4 18 8 4 8-4" />
    </svg>
  );
}

function CompassIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="m15.5 8.5-2.2 4.8-4.8 2.2 2.2-4.8 4.8-2.2Z" />
    </svg>
  );
}

function PenIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z" />
    </svg>
  );
}

export default async function AboutSection() {
  const t = await getTranslations("about");
  const pillars = [
    {
      icon: <LayersIcon />,
      title: t("pillars.product.title"),
      body: t("pillars.product.body"),
    },
    {
      icon: <CompassIcon />,
      title: t("pillars.taste.title"),
      body: t("pillars.taste.body"),
    },
    {
      icon: <PenIcon />,
      title: t("pillars.systems.title"),
      body: t("pillars.systems.body"),
    },
  ];

  return (
    <section
      id="about"
      className="flex min-h-dvh scroll-mt-24 items-center border-t border-border py-24"
    >
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <ScrollReveal className="text-center lg:text-left">
            <h2 className="text-balance font-heading text-4xl leading-tight tracking-tight text-foreground sm:text-5xl">
              {t("sectionTitle")}
            </h2>
          </ScrollReveal>

          <div className="text-center lg:text-left">
            <ScrollReveal delay={0.1}>
              <p className="text-pretty text-lg leading-relaxed text-foreground/90">
                {t("body")}
              </p>
            </ScrollReveal>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {pillars.map((pillar, index) => (
                <ScrollReveal key={pillar.title} delay={0.16 + index * 0.06}>
                  <div className="flex h-full flex-col items-center rounded-2xl border border-border bg-card/40 p-5 text-center transition-colors hover:border-primary/50 sm:items-start sm:text-left">
                    <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      {pillar.icon}
                    </span>
                    <h3 className="mt-4 text-base font-medium text-foreground">
                      {pillar.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                      {pillar.body}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
