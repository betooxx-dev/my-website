import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("now");
  return {
    title: t("pageTitle"),
    description: t("pageDescription"),
  };
}

export default async function NowPage() {
  const t = await getTranslations("now");

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-pine-900 px-6 py-32">
      <div className="aurora" aria-hidden />

      <article className="relative paper-card mx-auto w-full max-w-xl p-10 text-center md:p-14">
        <div className="mb-6 flex items-center justify-center gap-3">
          <span className="h-px w-8 bg-amber-500/60" />
          <span className="font-mono text-[10px] tracking-[0.3em] text-amber-500 uppercase">
            Now
          </span>
          <span className="h-px w-8 bg-amber-500/60" />
        </div>
        <h1
          className="font-heading font-bold leading-[0.95] tracking-tight text-pine-900"
          style={{ fontSize: "clamp(2.5rem, 6vw, 4rem)" }}
        >
          {t("pageTitle")}
          <span className="text-amber-500">.</span>
        </h1>
        <p className="mt-6 font-mono text-[11px] tracking-[0.25em] text-pine-700/60 uppercase">
          {t("comingSoon")}
        </p>
      </article>
    </main>
  );
}
