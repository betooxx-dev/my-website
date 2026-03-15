"use client";

import { useEffect, useState } from "react";
import LocaleSwitcher from "@/components/shared/LocaleSwitcher";
import { Link } from "@/i18n/navigation";

const navKeys = ["home", "blog", "now"] as const;
const navHrefs = { home: "/", blog: "/blog", now: "/now" } as const;

interface NavbarClientProps {
  labels: Record<(typeof navKeys)[number] | "contact", string>;
}

export default function NavbarClient({ labels }: NavbarClientProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const dark = scrolled;

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-5 pt-3 transition-all duration-500 sm:px-8 sm:pt-4">
      <nav
        className={`mx-auto flex max-w-5xl items-center justify-between rounded-full border px-4 py-4 backdrop-blur-2xl transition-all duration-500 sm:px-5 sm:py-4 ${
          dark
            ? "border-pine-700/40 bg-pine-700/60 shadow-[0_8px_32px_rgba(28,55,56,0.25)]"
            : "border-pine-700/30 bg-pine-700/50 shadow-[0_4px_24px_rgba(28,55,56,0.15)]"
        }`}
      >
        {/* Logo */}
        <Link
          href="/"
          className="text-xl font-bold tracking-tight text-mint-50 transition-opacity hover:opacity-80"
        >
          <span className="text-amber-400">A</span>lberto{" "}
          <span className="text-amber-400">A</span>vendaño
        </Link>

        {/* Navigation Links */}
        <div className="hidden items-center gap-6 sm:flex">
          {navKeys.map((key) => (
            <Link
              key={key}
              href={navHrefs[key]}
              className="relative text-xl font-medium text-mint-50/70 transition-colors hover:text-mint-50 after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-amber-400 after:transition-all hover:after:w-full"
            >
              {labels[key]}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <LocaleSwitcher />
          <Link
            href="mailto:avendanoargueta.josealberto@gmail.com"
            className="rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-1.5 text-m font-medium text-amber-300 transition-all hover:border-amber-400/50 hover:bg-amber-400/20"
          >
            {labels.contact}
          </Link>
        </div>
      </nav>
    </header>
  );
}
