"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type { BlogPost } from "@/lib/blog-data";
import { formatDate } from "@/lib/format";
import { ClockIcon, StarIcon } from "./BlogIcons";

const easing = [0.22, 1, 0.36, 1] as const;

type PostCardProps = {
  post: BlogPost;
  locale: "es" | "en";
  coverLabel: string;
  index?: number;
  featured?: boolean;
};

export function PostCard({
  post,
  locale,
  coverLabel,
  index = 0,
  featured = false,
}: PostCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: easing }}
      className="group h-full"
    >
      <Link
        href={`/blog/${post.slug}`}
        className={`flex h-full overflow-hidden rounded-[1.5rem] border border-border bg-card/45 transition-colors hover:border-primary/50 ${
          featured ? "flex-col md:flex-row" : "flex-col"
        }`}
      >
        <div
          className={`relative overflow-hidden ${
            featured
              ? "aspect-[16/10] md:aspect-auto md:w-1/2"
              : "aspect-[16/10]"
          }`}
        >
          <Image
            src={post.cover}
            alt={`${coverLabel} ${post.title}`}
            fill
            sizes={
              featured
                ? "(max-width: 768px) 100vw, 50vw"
                : "(max-width: 768px) 100vw, 33vw"
            }
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <span className="absolute left-4 top-4 rounded-full border border-border/70 bg-background/80 px-3 py-1 text-xs font-medium text-foreground shadow-sm backdrop-blur">
            {post.category}
          </span>
        </div>

        <div
          className={`flex flex-1 flex-col p-6 ${
            featured ? "md:justify-center md:p-8" : ""
          }`}
        >
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span>{formatDate(post.date, locale)}</span>
            <span className="inline-flex items-center gap-1">
              <ClockIcon className="size-3.5" />
              {post.readingTime}
            </span>
            <span className="inline-flex items-center gap-1">
              <StarIcon filled className="size-3.5 text-primary" />
              {post.rating.toFixed(1)}
            </span>
          </div>

          <h3
            className={`mt-3 text-balance font-heading tracking-tight ${
              featured ? "text-3xl sm:text-4xl" : "text-2xl"
            }`}
          >
            {post.title}
          </h3>
          <p className="mt-2 flex-1 text-pretty text-sm leading-relaxed text-muted-foreground">
            {post.excerpt}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
