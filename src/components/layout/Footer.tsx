import { getTranslations } from "next-intl/server";
import SocialLinks from "@/components/shared/SocialLinks";
import { Link } from "@/i18n/navigation";

const navKeys = ["home", "blog"] as const;
const navHrefs = { home: "/#top", blog: "/blog" } as const;

export default async function Footer() {
  const t = await getTranslations("footer");
  const navT = await getTranslations("navbar");

  return (
    <footer className="relative bg-pine-900 text-mint-50">
      {/* Top hairline — gold accent */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />

      <div className="mx-auto max-w-7xl px-6 py-20 md:px-10">
        <div className="grid gap-12 text-center md:grid-cols-3 md:text-left">
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
            <div className="flex justify-center md:justify-start">
              <SocialLinks tone="lightSolid" />
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-mint-50/10 pt-8 md:flex-row md:items-center">
          <p className="font-mono text-[11px] text-mint-50/40">
            {t("copyright")}
          </p>
          <div className="flex items-center gap-2 font-mono text-[10px] text-mint-50/30">
            {t("craftedLabel")}
          </div>
        </div>
      </div>
    </footer>
  );
}
