import type { BlogPost } from "@/contracts";
import type { Locale } from "@/i18n/routing";
import { PostCard } from "./PostCard";

type RelatedPostsProps = {
  posts: BlogPost[];
  locale: Locale;
  labels: {
    kicker: string;
    title: string;
    cover: string;
  };
};

export function RelatedPosts({ posts, locale, labels }: RelatedPostsProps) {
  if (posts.length === 0) return null;

  return (
    <section className="mt-20 border-t border-border pt-14">
      <p className="text-xs uppercase tracking-widest text-primary">
        {labels.kicker}
      </p>
      <h2 className="mt-3 font-heading text-3xl tracking-tight sm:text-4xl">
        {labels.title}
      </h2>
      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        {posts.map((post) => (
          <PostCard
            key={post.slug}
            post={post}
            locale={locale}
            coverLabel={labels.cover}
          />
        ))}
      </div>
    </section>
  );
}
