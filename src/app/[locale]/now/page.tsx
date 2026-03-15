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
    <main className="flex min-h-screen items-center justify-center bg-pine-900">
      <div className="text-center">
        <h1 className="font-heading text-4xl font-bold text-mint-50">
          {t("pageTitle")}
        </h1>
        <p className="mt-4 text-mint-50/75">{t("comingSoon")}</p>
      </div>
    </main>
  );
}
