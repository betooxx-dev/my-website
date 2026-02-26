import { getTranslations } from "next-intl/server";
import SocialLinks from "@/components/shared/SocialLinks";
import { Link } from "@/i18n/navigation";

const navKeys = ["home", "blog", "now"] as const;
const navHrefs = { home: "/#top", blog: "/blog", now: "/now" } as const;

export default async function Footer() {
  const t = await getTranslations("footer");
  const navT = await getTranslations("navbar");

  return (
    <footer className="relative rounded-t-[2.5rem] border-t border-pine-900/10 bg-mint-50 text-pine-900">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-12 text-center md:grid-cols-3 lg:text-left">
          {/* Brand */}
          <div>
            <Link
              href="/#top"
              className="text-xl font-bold tracking-tight text-pine-900"
            >
              <span className="text-pine-700">b</span>etooxx
            </Link>
            <p className="mt-3 text-sm text-pine-700/80">{t("tagline")}</p>
            <div className="mt-4 flex justify-center lg:justify-start">
              <SocialLinks tone="dark" />
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="mb-4 font-mono text-xs uppercase tracking-widest text-pine-700/70">
              {t("navHeading")}
            </h4>
            <ul className="space-y-3">
              {navKeys.map((key) => (
                <li key={key}>
                  <Link
                    href={navHrefs[key]}
                    className="text-sm text-pine-900/80 transition-colors hover:text-pine-900"
                  >
                    {navT(key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-4 font-mono text-xs uppercase tracking-widest text-pine-700/70">
              {t("contactHeading")}
            </h4>
            <a
              href="mailto:contacto@betooxx.dev"
              className="text-sm text-pine-900/80 transition-colors hover:text-pine-900"
            >
              contacto@betooxx.dev
            </a>
          </div>
        </div>

        <div className="mt-12 border-t border-pine-900/15 pt-8">
          <p className="text-center font-mono text-xs text-pine-700/80">
            {t("copyright")}
          </p>
        </div>
      </div>
    </footer>
  );
}
