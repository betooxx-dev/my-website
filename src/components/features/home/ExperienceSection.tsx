import Image from "next/image";
import { getTranslations } from "next-intl/server";
import ScrollReveal from "@/components/shared/ScrollReveal";
import SectionHeader from "@/components/shared/SectionHeader";

const companies = [
  { name: "Zifra", logo: "/zifra.png", href: "https://zifra.mx", flag: "🇲🇽" },
  {
    name: "Handbook",
    logo: "/handbook.png",
    href: "https://handbookai.io",
    flag: "🇺🇸",
  },
  {
    name: "UPC",
    logo: "/upc.png",
    href: "https://www.upc.edu/es?set_language=es",
    flag: "🇪🇸",
  },
  {
    name: "Agora Partnerships",
    logo: "/agora-partnerships.png",
    href: "https://agora2030.org",
    flag: "🇺🇸",
  },
  {
    name: "Hightech",
    logo: "/hightech.png",
    href: "https://htpro.dev",
    flag: "🇲🇽",
  },
  {
    name: "TPX Security",
    logo: "/tpx.png",
    href: "https://tpx.mx",
    flag: "🇲🇽",
  },
] as const;

export default async function ExperienceSection() {
  const t = await getTranslations("experience");

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

        <div className="mt-4">
          {companies.map((company, i) => (
            <ScrollReveal key={company.name}>
              <a
                href={company.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex items-center gap-6 border-t border-mint-50/8 py-5 transition-all duration-500 hover:border-amber-400/20 md:py-6"
                aria-label={company.name}
              >
                {/* Amber hover wash */}
                <span className="pointer-events-none absolute inset-0 -mx-4 rounded-xl bg-amber-400/0 transition-all duration-500 group-hover:bg-amber-400/[0.04]" />

                {/* Index number */}
                <span className="w-8 shrink-0 font-mono text-[11px] tracking-[0.2em] text-amber-400/40 transition-colors duration-300 group-hover:text-amber-400/80">
                  {String(i + 1).padStart(2, "0")}
                </span>

                {/* Company name + flag */}
                <span className="flex flex-1 items-baseline gap-3">
                  <span className="font-heading text-2xl font-bold italic tracking-tight text-mint-50/60 transition-colors duration-300 group-hover:text-mint-50 sm:text-3xl md:text-4xl">
                    {company.name}
                  </span>
                  <span className="text-base leading-none">{company.flag}</span>
                </span>

                {/* Arrow indicator */}
                <span className="mr-2 font-mono text-[10px] tracking-[0.2em] text-mint-50/20 opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:text-amber-400/60 group-hover:opacity-100 md:mr-4">
                  ↗
                </span>

                {/* Logo */}
                <div className="relative h-8 w-20 shrink-0 opacity-25 grayscale transition-all duration-500 group-hover:opacity-80 group-hover:grayscale-0 md:h-10 md:w-28">
                  <Image
                    src={company.logo}
                    alt={company.name}
                    fill
                    className="object-contain object-right"
                    sizes="112px"
                  />
                </div>
              </a>
            </ScrollReveal>
          ))}

          {/* Bottom hairline */}
          <div className="border-t border-mint-50/8" />
        </div>
      </div>
    </section>
  );
}
