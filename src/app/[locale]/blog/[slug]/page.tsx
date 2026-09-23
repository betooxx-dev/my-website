import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { BlogArticle } from "@/components/features/blog/BlogArticle";
import { ArrowLeftIcon } from "@/components/features/blog/BlogIcons";
import { RelatedPosts } from "@/components/features/blog/RelatedPosts";
import { siteProfile } from "@/config/site-profile";
import { env } from "@/env";
import {
  getPublishedPost,
  getPublishedPosts,
  getRelatedPublishedPosts,
} from "@/features/blog/queries";
import { blogSeoFields } from "@/features/blog/seo";
import { Link } from "@/i18n/navigation";
import { type Locale, locales } from "@/i18n/routing";

type PostPageProps = {
  params: Promise<{ locale: Locale; slug: string }>;
};

export const dynamicParams = false;

export async function generateStaticParams() {
  const postsByLocale = await Promise.all(
    locales.map(async (locale) => ({
      locale,
      posts: await getPublishedPosts(locale),
    })),
  );

  return postsByLocale.flatMap(({ locale, posts }) =>
    posts.map((post) => ({ locale, slug: post.slug })),
  );
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await getPublishedPost(locale, slug);
  if (!post) return {};
  const seo = blogSeoFields(post, env.NEXT_PUBLIC_SITE_URL);
  const path = seo.path;
  return {
    title: { absolute: seo.searchTitle },
    description: seo.description,
    robots: post.demo ? { index: false, follow: false } : undefined,
    alternates: { canonical: path },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      authors: [siteProfile.name],
      images: [{ alt: seo.coverAlt, url: post.cover }],
      modifiedTime: post.updatedAt,
      publishedTime: post.publishedAt,
      type: "article",
      url: path,
    },
    twitter: {
      card: "summary_large_image",
      description: post.excerpt,
      images: [{ alt: seo.coverAlt, url: post.cover }],
      title: post.title,
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const postPromise = getPublishedPost(locale, slug);
  const t = await getTranslations({ locale, namespace: "blogPost" });
  const post = await postPromise;
  if (!post) notFound();

  const related = await getRelatedPublishedPosts(locale, slug);
  const canonicalUrl = `${env.NEXT_PUBLIC_SITE_URL}/${locale}/blog/${post.slug}`;
  const blogPosting = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    author: {
      "@id": `${env.NEXT_PUBLIC_SITE_URL}/#person`,
      "@type": "Person",
      name: siteProfile.name,
      url: `${env.NEXT_PUBLIC_SITE_URL}/${locale}`,
    },
    dateModified: post.updatedAt,
    datePublished: post.publishedAt,
    description: post.excerpt,
    headline: post.title,
    image: {
      "@type": "ImageObject",
      url: post.cover,
      caption: post.coverAlt || post.title,
    },
    inLanguage: locale,
    mainEntityOfPage: canonicalUrl,
    url: canonicalUrl,
  };

  return (
    <main className="pb-24 pt-32 sm:pt-40">
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD is validated by the Argos contract and escaped for HTML.
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(blogPosting).replace(/</g, "\\u003c"),
        }}
      />
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Link
          href="/blog"
          className="group inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeftIcon className="size-4 transition-transform group-hover:-translate-x-0.5" />
          {t("allPosts")}
        </Link>
      </div>
      <BlogArticle
        post={post}
        locale={locale}
        labels={{
          writtenBy: t("writtenBy"),
          connect: t("connect"),
          cover: t("cover"),
          noCover: t("noCover"),
          draftDate: t("draftDate"),
        }}
      />

      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <RelatedPosts
          posts={related}
          locale={locale}
          labels={{
            kicker: t("relatedKicker"),
            title: t("relatedTitle"),
            cover: t("cover"),
          }}
        />
      </div>
    </main>
  );
}
