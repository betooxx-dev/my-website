import { getTranslations } from "next-intl/server";
import LocaleSwitcher from "@/components/shared/LocaleSwitcher";
import { Link } from "@/i18n/navigation";

const navKeys = ["home", "blog", "now"] as const;
const navHrefs = { home: "/", blog: "/blog", now: "/now" } as const;

export default async function Navbar() {
  const t = await getTranslations("navbar");

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-3 sm:px-6 sm:pt-4">
      <nav className="mx-auto flex w-full items-center justify-between rounded-full bg-navy-950/50 px-4 py-2.5 backdrop-blur-xl sm:px-6 sm:py-3">
        {/* Logo */}
        <Link
          href="/"
          className="text-xl font-bold tracking-tight text-white transition-opacity hover:opacity-80"
        >
          <span className="text-accent-400">b</span>etooxx
        </Link>

        {/* Navigation Links */}
        <div className="hidden items-center gap-8 sm:flex">
          {navKeys.map((key) => (
            <Link
              key={key}
              href={navHrefs[key]}
              className="text-base font-medium text-white/70 transition-colors hover:text-white"
            >
              {t(key)}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          <LocaleSwitcher />
          <Link
            href="mailto:contacto@betooxx.dev"
            className="text-base font-medium text-white/70 transition-colors hover:text-white"
          >
            {t("contact")}
          </Link>
        </div>
      </nav>
    </header>
  );
}
