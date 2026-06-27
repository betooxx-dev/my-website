"use client";

import type { MouseEvent } from "react";
import { useEffect, useState } from "react";
import LocaleSwitcher from "@/components/shared/LocaleSwitcher";
import { Link } from "@/i18n/navigation";

interface NavLink {
  href: string;
  label: string;
}

interface NavbarClientProps {
  closeMenuLabel: string;
  contact: string;
  links: NavLink[];
  menuLabel: string;
}

function MenuIcon({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg
        aria-hidden="true"
        className="size-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      >
        <path d="M18 6 6 18" />
        <path d="m6 6 12 12" />
      </svg>
    );
  }

  return (
    <svg
      aria-hidden="true"
      className="size-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
    >
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </svg>
  );
}

export default function NavbarClient({
  closeMenuLabel,
  contact,
  links,
  menuLabel,
}: NavbarClientProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function handleHashClick(event: MouseEvent<HTMLAnchorElement>, href: string) {
    const id = href.split("#")[1];
    const isHome =
      window.location.pathname === "/es" || window.location.pathname === "/en";
    if (!id || !isHome) {
      setOpen(false);
      return;
    }

    const target = document.getElementById(id);
    if (!target) {
      setOpen(false);
      return;
    }

    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.replaceState(null, "", href);
    setOpen(false);
  }

  function renderDesktopLink(link: NavLink) {
    const className =
      "rounded-full px-3.5 py-2 text-[13px] font-medium text-mint-50/62 transition-colors duration-300 hover:text-mint-50 focus:text-mint-50 focus:outline-none";

    if (link.href.startsWith("/")) {
      return (
        <Link
          key={link.href}
          href={link.href}
          className={className}
          onClick={() => setOpen(false)}
        >
          {link.label}
        </Link>
      );
    }

    return (
      <a
        key={link.href}
        href={link.href}
        className={className}
        onClick={(event) => handleHashClick(event, link.href)}
      >
        {link.label}
      </a>
    );
  }

  function renderMobileLink(link: NavLink) {
    const className =
      "rounded-2xl px-4 py-3 text-sm font-medium text-mint-50/82 transition-colors hover:bg-mint-50/8 hover:text-mint-50 focus:bg-mint-50/8 focus:text-mint-50 focus:outline-none";

    if (link.href.startsWith("/")) {
      return (
        <Link
          key={link.href}
          href={link.href}
          className={className}
          onClick={() => setOpen(false)}
        >
          {link.label}
        </Link>
      );
    }

    return (
      <a
        key={link.href}
        href={link.href}
        className={className}
        onClick={(event) => handleHashClick(event, link.href)}
      >
        {link.label}
      </a>
    );
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-3 transition-all duration-500 sm:px-6 sm:pt-5">
      <nav
        className={`relative mx-auto flex max-w-6xl items-center justify-between rounded-full border px-4 py-3 backdrop-blur-2xl transition-all duration-500 sm:px-5 sm:py-3.5 ${
          scrolled
            ? "border-amber-400/25 bg-pine-900/80 shadow-[0_12px_40px_-18px_rgba(17,24,39,0.22)]"
            : "border-mint-50/10 bg-pine-900/65 shadow-[0_4px_24px_-16px_rgba(17,24,39,0.16)]"
        }`}
      >
        <Link
          href="/"
          className="font-heading text-lg font-bold tracking-tight text-mint-50 transition-opacity hover:opacity-80 sm:text-xl"
        >
          <span className="sm:hidden">
            <span className="text-amber-400">A</span>A
          </span>
          <span className="hidden sm:inline">
            <span className="text-amber-400">A</span>lberto{" "}
            <span className="text-amber-400">A</span>vendaño
          </span>
        </Link>

        <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-2 lg:flex">
          {links.map(renderDesktopLink)}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <LocaleSwitcher />
          <Link
            href="/#contact"
            onClick={(event) => handleHashClick(event, "/#contact")}
            className="hidden rounded-full border border-amber-400/40 bg-amber-400/10 px-4 py-1.5 text-[13px] font-medium text-amber-300 transition-all duration-300 hover:border-amber-400/70 hover:bg-amber-400/20 hover:text-amber-200 sm:inline-flex"
          >
            {contact}
          </Link>
          <button
            type="button"
            aria-label={open ? closeMenuLabel : menuLabel}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
            className="inline-grid size-10 place-items-center rounded-full border border-mint-50/14 bg-mint-50/[0.04] text-mint-50/80 transition-colors hover:border-mint-50/25 hover:text-mint-50 focus:outline-none focus:ring-2 focus:ring-amber-300/50 lg:hidden"
          >
            <MenuIcon open={open} />
          </button>
        </div>
      </nav>

      <div
        className={`mx-auto mt-2 max-w-6xl overflow-hidden rounded-3xl border border-mint-50/10 bg-pine-900/92 p-2 shadow-[0_18px_50px_-28px_rgba(17,24,39,0.35)] backdrop-blur-2xl transition-all duration-300 lg:hidden ${
          open
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-2 opacity-0"
        }`}
      >
        <div className="flex flex-col">
          {links.map(renderMobileLink)}
          <Link
            href="/#contact"
            onClick={(event) => handleHashClick(event, "/#contact")}
            className="mt-1 rounded-2xl border border-amber-400/35 bg-amber-400/10 px-4 py-3 text-sm font-semibold text-amber-300 transition-colors hover:border-amber-400/65 hover:bg-amber-400/20 hover:text-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-300/50"
          >
            {contact}
          </Link>
        </div>
      </div>
    </header>
  );
}
