import { getTranslations } from "next-intl/server";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const t = await getTranslations("blog");

  return (
    <main className="flex min-h-screen items-center justify-center bg-pine-700">
      <div className="text-center">
        <h1 className="font-heading text-4xl font-bold text-mint-50">
          {t("categoryPrefix")} {category}
        </h1>
        <p className="mt-4 text-mint-50/75">{t("categoryComingSoon")}</p>
      </div>
    </main>
  );
}
