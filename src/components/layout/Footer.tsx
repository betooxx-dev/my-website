import { getTranslations } from "next-intl/server";
import SocialLinks from "@/components/shared/SocialLinks";
import { Link } from "@/i18n/navigation";

const navKeys = ["home", "blog", "now"] as const;
const navHrefs = { home: "/", blog: "/blog", now: "/now" } as const;

export default async function Footer() {
  const t = await getTranslations("footer");
  const navT = await getTranslations("navbar");

  return (
    <footer className="border-t border-white/5 bg-navy-950">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-3">
          {/* Brand */}
          <div>
            <Link
              href="/"
              className="text-xl font-bold tracking-tight text-white"
            >
              <span className="text-accent-400">b</span>etooxx
            </Link>
            <p className="mt-3 text-sm text-navy-400">{t("tagline")}</p>
            <div className="mt-4">
              <SocialLinks />
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="mb-4 font-mono text-xs uppercase tracking-widest text-navy-400">
              {t("navHeading")}
            </h4>
            <ul className="space-y-3">
              {navKeys.map((key) => (
                <li key={key}>
                  <Link
                    href={navHrefs[key]}
                    className="text-sm text-navy-300 transition-colors hover:text-white"
                  >
                    {navT(key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-4 font-mono text-xs uppercase tracking-widest text-navy-400">
              {t("contactHeading")}
            </h4>
            <a
              href="mailto:contacto@betooxx.dev"
              className="text-sm text-navy-300 transition-colors hover:text-white"
            >
              contacto@betooxx.dev
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5 px-6 py-6">
        <p className="text-center font-mono text-xs text-navy-500">
          {t("copyright")}
        </p>
      </div>
    </footer>
  );
}
