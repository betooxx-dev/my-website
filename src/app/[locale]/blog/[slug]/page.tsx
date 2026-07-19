import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { ArrowLeftIcon, ClockIcon } from "@/components/features/blog/BlogIcons";
import { MarkdownContent } from "@/components/features/blog/MarkdownContent";
import { RelatedPosts } from "@/components/features/blog/RelatedPosts";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import SocialLinks from "@/components/shared/SocialLinks";
import { Link } from "@/i18n/navigation";
import { getPostBySlug, getRelatedPosts } from "@/lib/blog-data";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

type PostPageProps = {
  params: Promise<{ locale: "es" | "en"; slug: string }>;
};

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await getPostBySlug(locale, slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [{ url: post.cover }],
      type: "article",
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { locale, slug } = await params;
  const postPromise = getPostBySlug(locale, slug);
  const t = await getTranslations({ locale, namespace: "blogPost" });
  const post = await postPromise;
  if (!post) notFound();

  const related = await getRelatedPosts(locale, slug);

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 pb-24 pt-32 sm:px-6 sm:pt-40">
        <Link
          href="/blog"
          className="group inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeftIcon className="size-4 transition-transform group-hover:-translate-x-0.5" />
          {t("allPosts")}
        </Link>

        <div className="mt-8 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <span className="rounded-full border border-border bg-muted px-3 py-1 text-xs text-muted-foreground">
            {post.category}
          </span>
          <span>{formatDate(post.date, locale)}</span>
          <span className="inline-flex items-center gap-1">
            <ClockIcon className="size-4" />
            {post.readingTimeMinutes} min
          </span>
        </div>

        <h1 className="mt-5 text-balance font-heading text-4xl leading-[1.05] tracking-tight sm:text-6xl">
          {post.title}
        </h1>
        <p className="mt-5 text-pretty text-lg leading-relaxed text-muted-foreground">
          {post.excerpt}
        </p>

        <div className="relative mt-10 aspect-[16/9] overflow-hidden rounded-[1.5rem] border border-border">
          <Image
            src={post.cover}
            alt={`${t("cover")} ${post.title}`}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
          />
        </div>

        <div className="mt-12">
          <MarkdownContent source={post.contentMarkdown} />
        </div>

        <div className="mt-10 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <Link
              key={tag}
              href="/blog"
              className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              #{tag}
            </Link>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center gap-3 rounded-[1.5rem] border border-border bg-card/45 p-8 text-center">
          <p className="text-sm text-muted-foreground">{t("connect")}</p>
          <SocialLinks tone="dark" />
        </div>

        <RelatedPosts
          posts={related}
          locale={locale}
          labels={{
            kicker: t("relatedKicker"),
            title: t("relatedTitle"),
            cover: t("cover"),
          }}
        />
      </main>
      <Footer />
    </>
  );
}
