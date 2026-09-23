import Image from "next/image";
import SocialLinks from "@/components/shared/SocialLinks";
import { siteProfile } from "@/config/site-profile";
import { shouldBypassImageOptimization } from "@/features/blog/image-policy";
import type { Locale } from "@/i18n/routing";
import { formatDate } from "@/shared/format";
import { ClockIcon } from "./BlogIcons";
import { MarkdownContent } from "./MarkdownContent";

type EditorialPost = {
  title: string;
  excerpt: string;
  category: string;
  date: string | null;
  readingTimeMinutes: number;
  cover: string | null;
  coverAlt?: string;
  contentMarkdown: string;
  tags: string[];
};

export function BlogArticle({
  post,
  locale,
  labels,
}: {
  post: EditorialPost;
  locale: Locale;
  labels: {
    writtenBy: string;
    connect: string;
    cover: string;
    noCover: string;
    draftDate: string;
  };
}) {
  return (
    <>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <header className="mx-auto mt-12 max-w-4xl text-center sm:mt-16">
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs uppercase tracking-[0.16em] text-muted-foreground sm:gap-3">
            <span className="font-medium text-primary">{post.category}</span>
            <span aria-hidden="true">·</span>
            <span>
              {post.date ? formatDate(post.date, locale) : labels.draftDate}
            </span>
            <span aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-1.5">
              <ClockIcon className="size-3.5" />
              {post.readingTimeMinutes} min
            </span>
          </div>

          <h1 className="mt-7 text-balance font-heading text-5xl leading-[0.98] tracking-tight sm:text-7xl lg:text-[5.25rem]">
            {post.title}
          </h1>
          <p className="mx-auto mt-7 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground sm:text-xl">
            {post.excerpt}
          </p>

          <div className="mt-8 inline-flex items-center gap-3 text-left">
            <span className="relative size-11 overflow-hidden rounded-full border border-border bg-muted">
              <Image
                src={siteProfile.image}
                alt={siteProfile.name}
                fill
                sizes="44px"
                className="object-cover object-[72%_38%]"
              />
            </span>
            <span className="grid">
              <span className="text-xs text-muted-foreground">
                {labels.writtenBy}
              </span>
              <span className="text-sm font-medium text-foreground">
                {siteProfile.name}
              </span>
            </span>
          </div>
        </header>

        {post.cover ? (
          <div className="relative mx-auto mt-12 aspect-[16/9] w-full max-w-4xl overflow-hidden rounded-[1.75rem] border border-border sm:mt-16">
            <Image
              src={post.cover}
              alt={post.coverAlt || `${labels.cover} ${post.title}`}
              fill
              preload
              sizes="(max-width: 1024px) 100vw, 896px"
              className="object-cover"
              unoptimized={shouldBypassImageOptimization(post.cover)}
            />
          </div>
        ) : (
          <p className="mt-12 text-center text-muted-foreground">
            {labels.noCover}
          </p>
        )}
      </div>

      <article className="mx-auto mt-14 max-w-[44rem] px-4 sm:mt-16 sm:px-6">
        <MarkdownContent source={post.contentMarkdown} />

        <div className="mt-12 flex flex-wrap gap-2 border-t border-border pt-8">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground"
            >
              #{tag}
            </span>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center gap-3 rounded-[1.5rem] border border-border bg-card/45 p-8 text-center">
          <p className="text-sm text-muted-foreground">{labels.connect}</p>
          <SocialLinks tone="dark" />
        </div>
      </article>
    </>
  );
}
