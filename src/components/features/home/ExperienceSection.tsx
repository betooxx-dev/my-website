import Image from "next/image";
import { getTranslations } from "next-intl/server";
import ScrollReveal from "@/components/shared/ScrollReveal";
import SectionHeader from "@/components/shared/SectionHeader";
import StaggerContainer from "@/components/shared/StaggerContainer";
import StaggerItem from "@/components/shared/StaggerItem";

const companies = [
  {
    name: "Zifra",
    label: "Zifra",
    logo: "/zifra.png",
    large: true,
    href: "https://zifra.mx",
  },
  {
    name: "TPX",
    label: "TPX",
    logo: "/tpx.png",
    large: true,
    href: "https://tpx.mx",
  },
  {
    name: "Hightech",
    label: "Hightech",
    logo: "/hightech.png",
    large: true,
    href: "https://htpro.dev",
  },
  {
    name: "Handbook",
    label: "Handbook",
    logo: "/handbook.png",
    large: false,
    href: "https://handbookai.io",
  },
  {
    name: "Agora Partnerships",
    label: "Agora Partnerships",
    logo: "/agora-partnerships.png",
    large: false,
    href: "https://agora2030.org",
  },
  {
    name: "UPC",
    label: "Univ. Politècnica de Catalunya",
    logo: "/upc.png",
    large: true,
    href: "https://upc.edu",
  },
] as const;

export default async function ExperienceSection() {
  const t = await getTranslations("experience");

  return (
    <section className="relative bg-pine-900 py-24 md:py-32">
      {/* Top separator */}
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-mint-50/15 to-transparent" />

      <div className="mx-auto max-w-6xl px-6">
        <ScrollReveal>
          <SectionHeader
            number={t("sectionNumber")}
            label={t("sectionLabel")}
            title={t("sectionTitle")}
            tone="light"
          />
        </ScrollReveal>

        <StaggerContainer className="grid grid-cols-3 gap-10 md:gap-16">
          {companies.map((company) => (
            <StaggerItem key={company.name} className="flex flex-col">
              <a
                href={company.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center"
              >
                <div className="relative flex h-24 w-full items-center justify-center md:h-28">
                  <div
                    className={`relative w-full transition-all duration-500 group-hover:scale-105 ${company.large ? "h-24 md:h-28" : "h-16 md:h-20"}`}
                  >
                    <Image
                      src={company.logo}
                      alt={company.name}
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 30vw, 20vw"
                    />
                  </div>
                </div>
                <span className="pt-3 text-center font-mono text-xs text-mint-50/50 transition-colors group-hover:text-mint-50/80">
                  {company.label}
                </span>
              </a>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
