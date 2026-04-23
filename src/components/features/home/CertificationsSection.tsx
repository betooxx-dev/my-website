import Script from "next/script";
import { getTranslations } from "next-intl/server";
import ScrollReveal from "@/components/shared/ScrollReveal";
import SectionHeader from "@/components/shared/SectionHeader";

const BADGE_IDS = [
  "14b32802-8369-4957-9ef2-173dc9a444b7",
  "e5f886e8-07c2-45d0-b623-275a2b19b5df",
  "06056294-73c4-4311-8d14-2af9f4aff11e",
  "1c39d316-1f4c-4561-a8be-97dd9caee050",
  "e6ae41ce-b611-4e54-ab57-888488650fef",
  "e7db0c51-3e82-4a90-8ce4-8abf1225a92f",
  "61dd506c-dd2b-48ce-92d1-4a959903c12a",
  "0dde0c9c-24ba-47e8-a436-bb881c31fd73",
  "7b9a6a1d-c3d1-4d28-9be7-a9f521cc9bd0",
];

export default async function CertificationsSection() {
  const t = await getTranslations("certifications");

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

        <div className="flex flex-wrap justify-center gap-6">
          {BADGE_IDS.map((id) => (
            <div
              key={id}
              data-iframe-width="150"
              data-iframe-height="270"
              data-share-badge-id={id}
              data-share-badge-host="https://www.credly.com"
            />
          ))}
        </div>

        <Script
          src="//cdn.credly.com/assets/utilities/embed.js"
          strategy="afterInteractive"
        />
      </div>
    </section>
  );
}
