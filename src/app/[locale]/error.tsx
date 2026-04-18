"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { Link } from "@/i18n/navigation";

export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("error");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-pine-900">
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
        aria-hidden="true"
      >
        <div
          className="h-[700px] w-[700px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(212,165,116,0.05) 0%, transparent 65%)",
          }}
        />
      </div>

      <div
        className="hero-text-line pointer-events-none absolute inset-0 flex items-center justify-center select-none"
        aria-hidden="true"
        style={{ animationDelay: "0s" }}
      >
        <span className="font-serif text-[30vw] font-bold leading-none text-mint-50/[0.03]">
          {t("title")}
        </span>
      </div>

      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        <p
          className="hero-text-line mb-6 font-mono text-xs tracking-[0.35em] uppercase text-amber-400"
          style={{ animationDelay: "0.3s" }}
        >
          {t("title")}
        </p>

        <div
          className="hero-text-line mb-8 h-px w-8 bg-amber-400/40"
          aria-hidden="true"
          style={{ animationDelay: "0.42s" }}
        />

        <h1
          className="hero-text-line mb-4 font-serif text-3xl font-bold tracking-tight text-mint-50 md:text-4xl"
          style={{ animationDelay: "0.5s" }}
        >
          {t("heading")}
        </h1>

        <p
          className="hero-text-line mb-10 max-w-[22rem] text-sm leading-relaxed text-mint-50/50"
          style={{ animationDelay: "0.6s" }}
        >
          {t("description")}
        </p>

        <div
          className="hero-text-line flex flex-wrap items-center justify-center gap-6"
          style={{ animationDelay: "0.72s" }}
        >
          <button
            type="button"
            onClick={reset}
            className="group relative font-mono text-[11px] tracking-[0.2em] uppercase text-amber-400 transition-colors duration-300 hover:text-amber-300"
          >
            ↻ {t("retry")}
            <span className="absolute -bottom-1 left-0 h-px w-0 bg-amber-400 transition-all duration-500 group-hover:w-full" />
          </button>

          <Link
            href="/"
            className="group relative font-mono text-[11px] tracking-[0.2em] uppercase text-mint-50/60 transition-colors duration-300 hover:text-mint-50"
          >
            ← {t("cta")}
            <span className="absolute -bottom-1 left-0 h-px w-0 bg-mint-50/60 transition-all duration-500 group-hover:w-full" />
          </Link>
        </div>
      </div>
    </main>
  );
}
