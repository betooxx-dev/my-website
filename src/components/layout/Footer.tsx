import { getTranslations } from "next-intl/server";
import SocialLinks from "@/components/shared/SocialLinks";

const EMAIL = "avendanoargueta.josealberto@gmail.com";

function ArrowUpRightIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
    >
      <path d="M7 17 17 7" />
      <path d="M8 7h9v9" />
    </svg>
  );
}

export default async function Footer() {
  const footerT = await getTranslations("footer");
  const navT = await getTranslations("navbar");
  const metadataT = await getTranslations("metadata");

  const links = [
    { href: "#experience", label: navT("experience") },
    { href: "#projects", label: navT("projects") },
    { href: "#certifications", label: navT("certifications") },
    { href: "#contact", label: navT("contact") },
  ];

  return (
    <footer className="border-t border-border bg-card/30">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm text-center md:text-left">
            <p className="font-heading text-3xl leading-none text-foreground">
              {metadataT("title")}
            </p>
            <p className="mt-3 text-pretty text-sm leading-relaxed text-muted-foreground">
              {metadataT("description")}
            </p>
            <div className="mt-6 flex justify-center md:justify-start">
              <SocialLinks tone="dark" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-10 text-center sm:gap-16 md:text-left">
            <div className="flex flex-col gap-3">
              <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                {footerT("socialHeading")}
              </p>
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm text-foreground/80 transition-colors hover:text-primary"
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="flex flex-col gap-3">
              <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                {footerT("contactHeading")}
              </p>
              <a
                href={`mailto:${EMAIL}`}
                className="group inline-flex items-center justify-center gap-1 break-all text-sm text-foreground/80 transition-colors hover:text-primary md:justify-start"
              >
                {EMAIL}
                <ArrowUpRightIcon />
              </a>
              <span className="text-sm text-muted-foreground">
                {footerT("craftedLabel")}
              </span>
            </div>
          </div>
        </div>

        <div className="my-10 h-px bg-border" />

        <div className="flex flex-col items-center justify-between gap-3 text-xs text-muted-foreground sm:flex-row">
          <p>{footerT("copyright")}</p>
          <p>{metadataT("title")}</p>
        </div>
      </div>
    </footer>
  );
}
