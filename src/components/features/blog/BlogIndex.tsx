"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import type { BlogPost } from "@/lib/blog-data";
import { PostCard } from "./PostCard";

type BlogIndexProps = {
  posts: BlogPost[];
  tags: string[];
  locale: "es" | "en";
  labels: {
    all: string;
    cover: string;
    emptyStart: string;
    emptyEnd: string;
  };
};

export function BlogIndex({ posts, tags, locale, labels }: BlogIndexProps) {
  const [active, setActive] = useState(labels.all);

  const filtered =
    active === labels.all
      ? posts
      : posts.filter(function isTagged(post) {
          return post.tags.includes(active);
        });

  const featured = posts.find(function isFeatured(post) {
    return post.featured;
  });
  const showFeatured = active === labels.all && featured;

  function renderTag(tag: string) {
    return (
      <button
        key={tag}
        type="button"
        onClick={() => setActive(tag)}
        className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
          active === tag
            ? "border-primary bg-primary text-primary-foreground"
            : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
        }`}
      >
        {tag}
      </button>
    );
  }

  function isNotFeaturedPost(post: BlogPost) {
    return !(showFeatured && post.slug === featured?.slug);
  }

  function renderPost(post: BlogPost, index: number) {
    return (
      <motion.div
        key={post.slug}
        layout
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.3 }}
      >
        <PostCard
          post={post}
          locale={locale}
          coverLabel={labels.cover}
          index={index}
        />
      </motion.div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {[labels.all, ...tags].map(renderTag)}
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
          {labels.emptyStart} {active} {labels.emptyEnd}
        </p>
      )}
    </div>
  );
}
