"use client";

import { type ReactNode, useEffect, useState } from "react";

export default function NavbarWrapper({ children }: { children: ReactNode }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 px-5 pt-3 transition-all duration-500 sm:px-8 sm:pt-4 ${
        scrolled ? "pt-2 sm:pt-2.5" : ""
      }`}
    >
      <nav
        className={`mx-auto flex max-w-5xl items-center justify-between rounded-full border px-4 py-4 backdrop-blur-xl transition-all duration-500 sm:px-5 sm:py-4 ${
          scrolled
            ? "border-mint-50/15 bg-pine-900/90 shadow-[0_8px_32px_rgba(0,15,8,0.4)]"
            : "border-mint-50/10 bg-pine-700/80"
        }`}
      >
        {children}
      </nav>
    </header>
  );
}
