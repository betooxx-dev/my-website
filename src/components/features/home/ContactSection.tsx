import { getTranslations } from "next-intl/server";
import ScrollReveal from "@/components/shared/ScrollReveal";
import SectionHeader from "@/components/shared/SectionHeader";
import SocialLinks from "@/components/shared/SocialLinks";

export default async function eContactSection() {
  const t = await getTranslations("contact");

  return (
    <section className="relative overflow-hidden bg-pine-900 py-28 md:py-36">
      <div className="relative mx-auto max-w-5xl px-6 md:px-10">
        <ScrollReveal>
          <SectionHeader
            number={t("sectionNumber")}
            label={t("sectionLabel")}
            title={`${t("title1")} ${t("title2")}`}
            tone="light"
          />

          {/* Main grid */}
          <div className="grid items-center gap-16 md:grid-cols-[2fr_2fr]">
            {/* LEFT — description + socials */}
            <div className="text-center md:text-left">
              <p className="text-[16px] leading-relaxed text-mint-50/65">
                {t("description")}
              </p>

              <div className="mt-10">
                <span className="mb-3 block font-mono text-[10px] tracking-[0.25em] text-mint-50/35 uppercase">
                  Social
                </span>
                <div className="flex justify-center md:justify-start">
                  <SocialLinks tone="light" />
                </div>
              </div>
            </div>

            {/* RIGHT — Contact card */}
            <div className="rounded-2xl border border-mint-50/12 bg-mint-50/[0.03] p-7">
              {/* Email */}
              <div className="mb-6">
                <span className="mb-2 block font-mono text-[10px] tracking-[0.25em] text-amber-400/60 uppercase">
                  Email
                </span>
                <a
                  href="mailto:avendanoargueta.josealberto@gmail.com"
                  className="block font-mono text-[12px] leading-relaxed text-mint-50/65 transition-colors duration-300 hover:text-amber-300"
                >
                  avendanoargueta.josealberto@gmail.com
                </a>
              </div>

              <div className="mb-6 h-px bg-mint-50/10" />

              {/* CTAs */}
              <div className="flex flex-col gap-3">
                <a
                  href="https://www.linkedin.com/in/alberto-avenda%C3%B1o"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between rounded-full bg-amber-400 px-5 py-3 text-[13px] font-semibold text-pine-900 transition-all duration-300 hover:bg-amber-300"
                >
                  {t("ctaLinkedIn")}
                  <span className="transition-transform duration-300 group-hover:translate-x-0.5">
                    →
                  </span>
                </a>
                <a
                  href="https://x.com/betooxx_dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between rounded-full border border-mint-50/20 px-5 py-3 text-[13px] font-medium text-mint-50/70 transition-all duration-300 hover:border-mint-50/40 hover:text-mint-50"
                >
                  {t("ctaX")}
                  <span className="transition-transform duration-300 group-hover:translate-x-0.5">
                    →
                  </span>
                </a>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
