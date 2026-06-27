import Image from "next/image";
import { getTranslations } from "next-intl/server";
import DragSlider from "@/components/shared/DragSlider";

const companies = [
  { name: "Zifra", logo: "/zifra.png", href: "https://zifra.mx" },
  {
    name: "Handbook",
    logo: "/handbook.png",
    href: "https://handbookai.io",
  },
  {
    name: "UPC",
    logo: "/upc.png",
    href: "https://www.upc.edu/es?set_language=es",
  },
  {
    name: "Agora Partnerships",
    logo: "/agora-partnerships.png",
    href: "https://agora2030.org",
  },
  {
    name: "Hightech",
    logo: "/hightech.png",
    href: "https://htpro.dev",
  },
  {
    name: "TPX Security",
    logo: "/tpx.png",
    href: "https://tpx.mx",
  },
] as const;

export default async function ExperienceSection() {
  const t = await getTranslations("experience");

  return (
    <section
      id="experience"
      aria-label={t("sectionTitle")}
      className="scroll-mt-24 border-y border-border bg-card/20 py-10"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="mb-8 text-center text-xs uppercase tracking-widest text-muted-foreground">
          <span>{t("sectionTitle")}</span>
        </p>

        <DragSlider
          gapClassName="gap-12"
          aria-label={t("sectionTitle")}
          speed={0.45}
        >
          {companies.map((company) => (
            <a
              key={company.name}
              href={company.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex shrink-0 select-none items-center gap-3 py-1 text-muted-foreground transition-colors hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50"
              aria-label={company.name}
            >
              <span className="relative flex size-9 items-center justify-center overflow-hidden rounded-lg border border-border bg-background">
                <Image
                  src={company.logo}
                  alt=""
                  fill
                  className="object-contain p-1.5 opacity-70 grayscale transition-all duration-300 group-hover:opacity-100 group-hover:grayscale-0"
                  sizes="36px"
                />
              </span>
              <span className="text-lg font-medium tracking-tight">
                {company.name}
              </span>
            </a>
          ))}
        </DragSlider>
      </div>
    </section>
  );
}
