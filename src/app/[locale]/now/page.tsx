import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("now");
  return {
    title: `${t("pageTitle")} | betooxx`,
    description: t("pageDescription"),
  };
}

export default async function NowPage() {
  const t = await getTranslations("now");

  return (
    <main className="flex min-h-screen items-center justify-center bg-navy-950">
      <div className="text-center">
        <h1 className="font-heading text-4xl font-bold text-white">
          {t("pageTitle")}
        </h1>
        <p className="mt-4 text-navy-300">{t("comingSoon")}</p>
      </div>
    </main>
  );
}
