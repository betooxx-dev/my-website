import { getTranslations } from "next-intl/server";
import SocialLinks from "@/components/shared/SocialLinks";
import { Link } from "@/i18n/navigation";

const navKeys = ["home", "blog", "now"] as const;
const navHrefs = { home: "/#top", blog: "/blog", now: "/now" } as const;

export default async function Footer() {
  const t = await getTranslations("footer");
  const navT = await getTranslations("navbar");

  return (
    <footer className="relative bg-pine-900 text-mint-50">
      {/* Top hairline — gold accent */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />

      <div className="mx-auto max-w-7xl px-6 py-20 md:px-10">
        {/* Brand marquee — oversized logotype as closing gesture */}
        <div className="mb-16 overflow-hidden border-b border-mint-50/10 pb-12">
          <Link
            href="/#top"
            className="block font-heading font-bold leading-[0.9] tracking-[-0.04em] text-mint-50 transition-opacity hover:opacity-80"
            style={{ fontSize: "clamp(3rem, 10vw, 8rem)" }}
          >
            <span className="text-amber-400">A</span>lberto{" "}
            <span className="text-amber-400">A</span>vendaño
            <span className="text-amber-400">.</span>
          </Link>
          <p className="mt-6 max-w-md text-base text-mint-50/55">
            {t("tagline")}
          </p>
        </div>

        <div className="grid gap-12 md:grid-cols-3">
          {/* Navigation */}
          <div>
            <h4 className="mb-5 font-mono text-[10px] tracking-[0.3em] text-amber-400/70 uppercase">
              {t("navHeading")}
            </h4>
            <ul className="space-y-3">
              {navKeys.map((key) => (
                <li key={key}>
                  <Link
                    href={navHrefs[key]}
                    className="group inline-flex items-center gap-2 font-heading text-lg text-mint-50/70 transition-colors hover:text-mint-50"
                  >
                    <span className="h-px w-0 bg-amber-400 transition-all duration-300 group-hover:w-6" />
                    {navT(key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-5 font-mono text-[10px] tracking-[0.3em] text-amber-400/70 uppercase">
              {t("contactHeading")}
            </h4>
            <a
              href="mailto:avendanoargueta.josealberto@gmail.com"
              className="break-all font-heading text-lg text-mint-50/70 transition-colors hover:text-amber-300"
            >
              avendanoargueta.josealberto@gmail.com
            </a>
          </div>

          {/* Social */}
          <div>
            <h4 className="mb-5 font-mono text-[10px] tracking-[0.3em] text-amber-400/70 uppercase">
              {t("socialHeading")}
            </h4>
            <SocialLinks tone="lightSolid" />
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-mint-50/10 pt-8 md:flex-row md:items-center">
          <p className="font-mono text-[11px] tracking-[0.2em] text-mint-50/40 uppercase">
            {t("copyright")}
          </p>
          <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.25em] text-mint-50/30 uppercase">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-400" />
            {t("craftedLabel")}
          </div>
        </div>
      </div>
    </footer>
  );
}
