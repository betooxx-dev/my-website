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

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-3 transition-all duration-500 sm:px-8 sm:pt-5">
      <nav
        className={`mx-auto flex max-w-5xl items-center justify-between rounded-full border px-4 py-3 backdrop-blur-2xl transition-all duration-500 sm:px-5 sm:py-3.5 ${
          scrolled
            ? "border-amber-400/20 bg-pine-900/75 shadow-[0_12px_40px_-8px_rgba(0,0,0,0.6)]"
            : "border-mint-50/10 bg-pine-900/45 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.4)]"
        }`}
      >
        {/* Logo */}
        <Link
          href="/"
          className="font-heading text-lg font-bold tracking-tight text-mint-50 transition-opacity hover:opacity-80 sm:text-xl"
        >
          <span className="text-amber-400">A</span>lberto{" "}
          <span className="text-amber-400">A</span>vendaño
        </Link>

        {/* Navigation Links */}
        <div className="hidden items-center gap-7 sm:flex">
          {navKeys.map((key) => (
            <Link
              key={key}
              href={navHrefs[key]}
              className="group relative text-[15px] font-medium text-mint-50/70 transition-colors hover:text-mint-50"
            >
              {labels[key]}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-amber-400 transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2 sm:gap-3">
          <LocaleSwitcher />
          <Link
            href="mailto:avendanoargueta.josealberto@gmail.com"
            className="rounded-full border border-amber-400/40 bg-amber-400/10 px-4 py-1.5 text-[13px] font-medium text-amber-300 transition-all duration-300 hover:border-amber-400/70 hover:bg-amber-400/20 hover:text-amber-200"
          >
            {labels.contact}
          </Link>
        </div>
      </nav>
    </header>
  );
}
