import { getTranslations } from "next-intl/server";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const t = await getTranslations("blog");

  return (
    <main className="flex min-h-screen items-center justify-center bg-navy-950">
      <div className="text-center">
        <h1 className="font-heading text-4xl font-bold text-white">
          {t("categoryPrefix")} {category}
        </h1>
        <p className="mt-4 text-navy-300">{t("categoryComingSoon")}</p>
      </div>
    </main>
  );
}
