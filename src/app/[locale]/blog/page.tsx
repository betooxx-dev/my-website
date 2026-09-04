import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { BlogIndex } from "@/components/features/blog/BlogIndex";
import type { Locale } from "@/i18n/routing";
import { BlogService } from "@/services/blog.service";

export const dynamic = "force-dynamic";

type BlogPageProps = {
  params: Promise<{ locale: Locale }>;
};

export async function generateMetadata({
  params,
}: BlogPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blog" });
  return {
    title: t("metadataTitle"),
    description: t("metadataDescription"),
  };
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blog" });
  const [posts, tags] = await Promise.all([
    BlogService.getPosts(locale),
    BlogService.getAllTags(locale),
  ]);

  return (
    <main className="mx-auto max-w-6xl px-4 pb-24 pt-32 sm:px-6 sm:pt-40">
      <p className="text-xs uppercase tracking-widest text-primary">
        {t("eyebrow")}
      </p>
      <h1 className="mt-4 max-w-2xl text-balance font-heading text-5xl leading-[1] tracking-tight sm:text-6xl">
        {t("title")}
      </h1>
      <p className="mt-5 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
        {t("description")}
      </p>

      <div className="mt-14">
        <BlogIndex
          posts={posts}
          tags={tags}
          locale={locale}
          labels={{
            all: t("all"),
            cover: t("cover"),
            emptyStart: t("emptyStart"),
            emptyEnd: t("emptyEnd"),
          }}
        />
      </div>
    </main>
  );
}
