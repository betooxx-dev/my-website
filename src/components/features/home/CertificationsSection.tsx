import Script from "next/script";
import { getTranslations } from "next-intl/server";
import DragSlider from "@/components/shared/DragSlider";
import ScrollReveal from "@/components/shared/ScrollReveal";

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
] as const;

function CertificationCard({ id, index }: { id: string; index: number }) {
  return (
    <div className="group relative flex h-[318px] w-[188px] shrink-0 items-center justify-center overflow-hidden rounded-3xl border border-border bg-card/40 p-4 transition-colors hover:border-primary/50">
      <span className="absolute left-4 top-4 font-mono text-[10px] text-muted-foreground transition-colors group-hover:text-primary">
        {String(index + 1).padStart(2, "0")}
      </span>
      <div className="flex h-[270px] w-[150px] items-center justify-center overflow-hidden rounded-2xl bg-background">
        <div
          data-iframe-width="150"
          data-iframe-height="270"
          data-share-badge-id={id}
          data-share-badge-host="https://www.credly.com"
        />
      </div>
    </div>
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
            </div>
            <div
              aria-hidden
              className="mx-auto h-px w-24 bg-border sm:mx-0 sm:mb-4 sm:w-32"
            />
          </div>
        </ScrollReveal>

        <div className="mt-14 hidden grid-cols-[repeat(auto-fit,minmax(188px,1fr))] justify-items-center gap-5 sm:grid">
          {BADGE_IDS.map((id, index) => (
            <ScrollReveal key={id}>
              <CertificationCard id={id} index={index} />
            </ScrollReveal>
          ))}
        </div>
      </div>

      <div className="mt-12 sm:hidden">
        <DragSlider gapClassName="gap-4" aria-label={t("sectionTitle")}>
          {BADGE_IDS.map((id, index) => (
            <CertificationCard key={id} id={id} index={index} />
          ))}
        </DragSlider>
      </div>

      <Script
        src="https://cdn.credly.com/assets/utilities/embed.js"
        strategy="afterInteractive"
      />
    </section>
  );
}
