"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import type { BlogPost } from "@/lib/blog-data";
import { HeartIcon, ShareIcon } from "./BlogIcons";
import { StarRating } from "./StarRating";

type PostEngagementProps = {
  post: BlogPost;
  labels: {
    ratings: string;
    ratePost: string;
    ratingLabel: string;
    share: string;
    recommended: string;
  };
};

export function PostEngagement({ post, labels }: PostEngagementProps) {
  const [userRating, setUserRating] = useState(0);
  const [recommended, setRecommended] = useState(false);
  const [recommendCount, setRecommendCount] = useState(post.ratingCount * 2);
  const [message, setMessage] = useState("");

  const average = userRating
    ? (post.rating * post.ratingCount + userRating) / (post.ratingCount + 1)
    : post.rating;
  const totalRatings = userRating ? post.ratingCount + 1 : post.ratingCount;

  function handleRate(value: number) {
    setUserRating(value);
    setMessage(labels.ratingLabel);
  }

  function handleRecommend() {
    setRecommended((prev) => {
      const next = !prev;
      setRecommendCount((count) => count + (next ? 1 : -1));
      if (next) setMessage(labels.recommended);
      return next;
    });
  }

  async function handleShare() {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: post.title, url });
      return;
    }
    await navigator.clipboard.writeText(url);
    setMessage(labels.share);
  }

  return (
    <div className="rounded-[1.5rem] border border-border bg-card/45 p-6">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <span className="font-heading text-3xl leading-none">
              {average.toFixed(1)}
            </span>
            <div>
              <StarRating
                value={average}
                label={labels.ratingLabel}
                readOnly
                size={16}
              />
              <p className="mt-1 text-xs text-muted-foreground">
                {totalRatings} {labels.ratings}
              </p>
            </div>
          </div>
          <div className="mt-1">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">
              {labels.ratePost}
            </p>
            <StarRating
              value={userRating}
              label={labels.ratePost}
              onChange={handleRate}
              className="mt-1.5"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleRecommend}
            aria-pressed={recommended}
            className={`group inline-flex h-10 items-center gap-2 rounded-full border px-4 text-sm font-medium transition-colors ${
              recommended
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border text-foreground hover:border-primary/50"
            }`}
          >
            <motion.span
              key={recommended ? "on" : "off"}
              initial={{ scale: 0.6 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 15 }}
            >
              <HeartIcon filled={recommended} className="size-4" />
            </motion.span>
            {recommendCount.toLocaleString()}
          </button>
          <button
            type="button"
            onClick={handleShare}
            aria-label={labels.share}
            className="inline-grid size-10 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <ShareIcon className="size-4" />
          </button>
        </div>
      </div>

      {message && (
        <p className="mt-4 rounded-full bg-muted px-4 py-2 text-sm text-muted-foreground">
          {message}
        </p>
      )}
    </div>
  );
}
