import Image from "next/image";
import { getTranslations } from "next-intl/server";
import ScrollReveal from "@/components/shared/ScrollReveal";
import SectionHeader from "@/components/shared/SectionHeader";

const companies = [
  { name: "Zifra", logo: "/zifra.png", href: "https://zifra.mx" },
  { name: "TPX", logo: "/tpx.png", href: "https://tpx.mx" },
  { name: "Hightech", logo: "/hightech.png", href: "https://htpro.dev" },
  { name: "Handbook", logo: "/handbook.png", href: "https://handbookai.io" },
  {
    name: "Agora Partnerships",
    logo: "/agora-partnerships.png",
    href: "https://agora2030.org",
  },
  { name: "UPC", logo: "/upc.png", href: "https://upc.edu" },
] as const;

export default async function ExperienceSection() {
  const t = await getTranslations("experience");

  // Duplicate for seamless marquee loop
  const doubled = [...companies, ...companies];

  return (
    <section className="relative bg-pine-900 py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <ScrollReveal>
          <SectionHeader
            number={t("sectionNumber")}
            label={t("sectionLabel")}
            title={t("sectionTitle")}
            tone="light"
          />
        </ScrollReveal>
      </div>

      {/* Marquee with edge fade masks */}
      <div
        className="marquee-pause relative mt-8"
        style={{
          maskImage:
            "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
        }}
      >
        <div className="marquee-track flex w-max items-center gap-20 md:gap-28">
          {doubled.map((company, i) => (
            <a
              key={`${company.name}-${i}`}
              href={company.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex h-20 w-40 shrink-0 items-center justify-center md:h-28 md:w-56"
              aria-label={company.name}
            >
              <div className="relative h-full w-full opacity-40 grayscale transition-all duration-500 group-hover:opacity-100 group-hover:grayscale-0">
                <Image
                  src={company.logo}
                  alt={company.name}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 160px, 224px"
                />
              </div>
              {/* Amber glow on hover */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-amber-400/0 blur-2xl transition-all duration-500 group-hover:bg-amber-400/15"
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
