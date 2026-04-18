import { getTranslations } from "next-intl/server";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const t = await getTranslations("blog");

  return (
    <main className="flex min-h-screen items-center justify-center bg-pine-900">
      <div className="text-center">
        <h1 className="font-heading text-4xl font-bold text-mint-50">{slug}</h1>
        <p className="mt-4 text-mint-50/75">{t("postComingSoon")}</p>
      </div>
    </main>
  );
}
