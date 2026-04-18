import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("blog");
  return {
    title: t("pageTitle"),
    description: t("pageDescription"),
  };
}

export default async function BlogPage() {
  const t = await getTranslations("blog");

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-pine-900 px-6 py-32">
      <div className="aurora" aria-hidden />

      <article className="relative paper-card-dark mx-auto w-full max-w-xl p-10 text-center md:p-14">
        <div className="mb-6 flex items-center justify-center gap-3">
          <span className="h-px w-8 bg-amber-400/60" />
          <span className="font-mono text-[10px] tracking-[0.3em] text-amber-400 uppercase">
            Blog
          </span>
          <span className="h-px w-8 bg-amber-400/60" />
        </div>
        <h1
          className="font-heading font-bold leading-[0.95] tracking-tight text-mint-50"
          style={{ fontSize: "clamp(2.5rem, 6vw, 4rem)" }}
        >
          {t("pageTitle")}
          <span className="text-amber-400">.</span>
        </h1>
        <p className="mt-6 font-mono text-[11px] tracking-[0.25em] text-mint-50/50 uppercase">
          {t("comingSoon")}
        </p>
      </article>
    </main>
  );
}
