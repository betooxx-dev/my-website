import { getTranslations } from "next-intl/server";
import ScrollReveal from "@/components/shared/ScrollReveal";
import SocialLinks from "@/components/shared/SocialLinks";
import { siteProfile } from "@/config/site-profile";

function WhatsAppIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.7"
    >
      <path d="M20.5 11.8a8.5 8.5 0 0 1-12.7 7.4L3.5 20.5l1.3-4.2a8.5 8.5 0 1 1 15.7-4.5Z" />
      <path d="M8.4 8.1c-.3.1-.7.7-.7 1.3 0 2 2.7 5 5.2 5.9.8.3 1.4.3 1.9.1.5-.2 1.2-1 1.2-1.5 0-.2-.1-.3-.4-.5l-1.7-.8c-.2-.1-.4-.1-.6.2l-.7.8c-.2.2-.4.2-.7.1a7.3 7.3 0 0 1-2.7-2.4c-.2-.3-.1-.5.1-.7l.5-.6c.1-.2.2-.4.1-.6l-.8-1.7c-.1-.3-.3-.4-.7-.4Z" />
    </svg>
  );
}

export default async function ContactSection() {
  const t = await getTranslations("contact");

  return (
    <section
      id="contact"
      className="flex min-h-dvh scroll-mt-24 items-center border-t border-border px-4 py-24 sm:px-6"
    >
      <ScrollReveal className="mx-auto w-full max-w-6xl">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-border bg-card px-6 py-16 text-center sm:px-12 sm:py-24">
          <div
            className="bg-grid mask-fade-edges pointer-events-none absolute inset-0 opacity-60"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute left-1/2 top-0 h-72 w-[40rem] max-w-full -translate-x-1/2 -translate-y-1/3 rounded-full bg-primary/25 blur-3xl"
            aria-hidden
          />

          <div className="relative flex flex-col items-center">
            <h2 className="mx-auto max-w-2xl text-balance font-heading text-4xl leading-[1.05] tracking-tight text-foreground sm:text-6xl">
              {t("title1")} {t("title2")}
            </h2>
            <p className="mx-auto mt-5 max-w-md text-pretty text-base leading-relaxed text-muted-foreground">
              {t("description")}
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href={siteProfile.whatsapp.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${t("whatsappLabel")}: ${siteProfile.whatsapp.phone}`}
                className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring/50"
              >
                <WhatsAppIcon />
                {t("whatsappLabel")}
              </a>
            </div>

            <div className="mt-10 flex flex-col items-center gap-3">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                {t("socialLabel")}
              </p>
              <SocialLinks tone="dark" />
              <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
                <a
                  href={siteProfile.social.linkedin.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-border bg-background/70 px-4 py-2 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50"
                >
                  {t("ctaLinkedIn")}
                </a>
                <a
                  href={siteProfile.social.x.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-border bg-background/70 px-4 py-2 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50"
                >
                  {t("ctaX")}
                </a>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
