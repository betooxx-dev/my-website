import Image from "next/image";
import { getTranslations } from "next-intl/server";
import ScrollReveal from "@/components/shared/ScrollReveal";

const certifications = [
  {
    id: "14b32802-8369-4957-9ef2-173dc9a444b7",
    name: "AWS Academy Graduate - Cloud Architecting - Training Badge",
    issuer: "Amazon Web Services Training and Certification",
    image:
      "https://images.credly.com/images/fcafd0c9-42da-4703-a191-0c397203dc1b/blob",
  },
  {
    id: "e5f886e8-07c2-45d0-b623-275a2b19b5df",
    name: "AWS Academy Graduate - Cloud Foundations - Training Badge",
    issuer: "Amazon Web Services Training and Certification",
    image:
      "https://images.credly.com/images/e3541a0c-dd4a-4820-8052-5001006efc85/blob",
  },
  {
    id: "06056294-73c4-4311-8d14-2af9f4aff11e",
    name: "AWS Academy Graduate - Cloud Security Foundations - Training Badge",
    issuer: "Amazon Web Services Training and Certification",
    image:
      "https://images.credly.com/images/7f7ea828-a10d-44f8-8baa-58a9c1af7671/blob",
  },
  {
    id: "1c39d316-1f4c-4561-a8be-97dd9caee050",
    name: "AWS Academy Graduate - Introduction to Cloud Semester 1 - Training Badge",
    issuer: "Amazon Web Services Training and Certification",
    image:
      "https://images.credly.com/images/07c356e3-8132-4a6c-a471-e16a04fb148c/blob",
  },
  {
    id: "e6ae41ce-b611-4e54-ab57-888488650fef",
    name: "Introduction to Cybersecurity",
    issuer: "Cisco",
    image:
      "https://images.credly.com/images/af8c6b4e-fc31-47c4-8dcb-eb7a2065dc5b/I2CS__1_.png",
  },
  {
    id: "e7db0c51-3e82-4a90-8ce4-8abf1225a92f",
    name: "Network Addressing and Basic Troubleshooting",
    issuer: "Cisco",
    image:
      "https://images.credly.com/images/49c099bd-8542-4f48-8c03-f21799dcaf51/image.png",
  },
  {
    id: "61dd506c-dd2b-48ce-92d1-4a959903c12a",
    name: "Networking Basics",
    issuer: "Cisco",
    image:
      "https://images.credly.com/images/5bdd6a39-3e03-4444-9510-ecff80c9ce79/image.png",
  },
  {
    id: "0dde0c9c-24ba-47e8-a436-bb881c31fd73",
    name: "Network Support and Security",
    issuer: "Cisco",
    image:
      "https://images.credly.com/images/a4dd891f-7bf5-4938-8241-50dc81e8cc00/image.png",
  },
  {
    id: "7b9a6a1d-c3d1-4d28-9be7-a9f521cc9bd0",
    name: "Operating Systems Basics",
    issuer: "Cisco",
    image:
      "https://images.credly.com/images/dcdf1a3c-2594-4f4c-a33a-050b4bca58b5/image.png",
  },
] as const;

interface CertificationCardProps {
  certification: (typeof certifications)[number];
  index: number;
  providerLabel: string;
  verifyLabel: string;
}

function CertificationCard({
  certification,
  index,
  providerLabel,
  verifyLabel,
}: CertificationCardProps) {
  return (
    <a
      href={`https://www.credly.com/badges/${certification.id}/embedded`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={verifyLabel}
      className="group relative flex min-h-[300px] w-[232px] shrink-0 snap-center flex-col items-center justify-center overflow-hidden rounded-3xl border border-border bg-card/40 p-5 text-center transition-all hover:-translate-y-1 hover:border-primary/50 hover:bg-card/70 focus:outline-none focus:ring-2 focus:ring-ring/50 sm:w-full"
    >
      <span className="absolute left-4 top-4 font-mono text-[10px] text-muted-foreground transition-colors group-hover:text-primary">
        {String(index + 1).padStart(2, "0")}
      </span>

      <Image
        src={certification.image}
        alt=""
        width={128}
        height={128}
        sizes="128px"
        quality={75}
        className="size-32 object-contain"
      />

      <h3 className="mt-5 line-clamp-3 text-sm font-semibold leading-snug text-foreground">
        {certification.name}
      </h3>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
        {certification.issuer}
      </p>
      <span className="mt-4 font-mono text-[10px] uppercase tracking-[0.18em] text-primary">
        {providerLabel} ↗
      </span>
    </a>
  );
}

export default async function CertificationsSection() {
  const t = await getTranslations("certifications");

  return (
    <section
      id="certifications"
      className="flex min-h-dvh scroll-mt-24 flex-col justify-center border-t border-border py-24"
    >
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <ScrollReveal>
          <div className="flex flex-col justify-between gap-4 text-center sm:flex-row sm:items-end sm:text-left">
            <div>
              <h2 className="text-balance font-heading text-4xl leading-tight tracking-tight text-foreground sm:text-5xl">
                {t("sectionTitle")}
              </h2>
              <p className="mt-4 max-w-2xl text-pretty leading-relaxed text-muted-foreground">
                {t("description")}
              </p>
            </div>
            <div
              aria-hidden
              className="mx-auto h-px w-24 bg-border sm:mx-0 sm:mb-4 sm:w-32"
            />
          </div>
        </ScrollReveal>

        <div className="-mx-4 mt-14 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-5 sm:mx-0 sm:grid sm:grid-cols-[repeat(auto-fit,minmax(220px,1fr))] sm:gap-5 sm:overflow-visible sm:px-0 sm:pb-0">
          {certifications.map((certification, index) => (
            <CertificationCard
              key={certification.id}
              certification={certification}
              index={index}
              providerLabel={t("providerLabel")}
              verifyLabel={t("verifyLabel", { name: certification.name })}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
