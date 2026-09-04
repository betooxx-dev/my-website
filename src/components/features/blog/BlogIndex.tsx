"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import type { BlogPost } from "@/contracts";
import type { Locale } from "@/i18n/routing";
import { PostCard } from "./PostCard";

type BlogIndexProps = {
  posts: BlogPost[];
  tags: string[];
  locale: Locale;
  labels: {
    all: string;
    cover: string;
    emptyAll: string;
    emptyStart: string;
    emptyEnd: string;
  };
};

export function BlogIndex({ posts, tags, locale, labels }: BlogIndexProps) {
  const [active, setActive] = useState<string | null>(null);

  const filtered = active
    ? posts.filter(function isTagged(post) {
        return post.tags.includes(active);
      })
    : posts;

  const featured = posts.find(function isFeatured(post) {
    return post.featured;
  });
  const showFeatured = active === null && featured;

  function renderTag(tag: string | null) {
    const label = tag ?? labels.all;

    return (
      <button
        key={label}
        type="button"
        aria-pressed={active === tag}
        onClick={() => setActive(tag)}
        className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
          active === tag
            ? "border-primary bg-primary text-primary-foreground"
            : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
        }`}
      >
        {label}
      </button>
    );
  }

  function isNotFeaturedPost(post: BlogPost) {
    return !(showFeatured && post.slug === featured?.slug);
  }

  function renderPost(post: BlogPost) {
    return (
      <motion.div
        key={post.slug}
        layout
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.3 }}
      >
        <PostCard post={post} locale={locale} coverLabel={labels.cover} />
      </motion.div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {[null, ...tags].map(renderTag)}
      </div>

      {showFeatured && (
        <div className="mt-10">
          <PostCard
            post={featured}
            locale={locale}
            coverLabel={labels.cover}
            featured
          />
        </div>
      )}

      <motion.div
        layout
        className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        <AnimatePresence mode="popLayout">
          {filtered.filter(isNotFeaturedPost).map(renderPost)}
        </AnimatePresence>
      </motion.div>

      {filtered.length === 0 && (
        <p className="mt-16 text-center text-muted-foreground">
          {active
            ? `${labels.emptyStart} ${active} ${labels.emptyEnd}`
            : labels.emptyAll}
        </p>
      )}
    </div>
  );
}
