"use client";

import { AnimatePresence, motion } from "framer-motion";
import { type FormEvent, useState } from "react";
import type { BlogComment } from "@/lib/blog-data";
import { formatDate } from "@/lib/format";
import { MessageIcon, SendIcon } from "./BlogIcons";

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

type CommentsProps = {
  initial: BlogComment[];
  locale: "es" | "en";
  labels: {
    title: string;
    name: string;
    namePlaceholder: string;
    comment: string;
    commentPlaceholder: string;
    post: string;
    empty: string;
    validation: string;
    posted: string;
  };
};

export function Comments({ initial, locale, labels }: CommentsProps) {
  const [comments, setComments] = useState<BlogComment[]>(initial);
  const [name, setName] = useState("");
  const [body, setBody] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!name.trim() || !body.trim()) {
      setMessage(labels.validation);
      return;
    }

    const comment: BlogComment = {
      id: crypto.randomUUID(),
      author: name.trim(),
      body: body.trim(),
      date: new Date().toISOString().slice(0, 10),
    };
    setComments((prev) => [comment, ...prev]);
    setName("");
    setBody("");
    setMessage(labels.posted);
  }

  return (
    <section className="mt-16">
      <div className="flex items-center gap-2">
        <MessageIcon className="size-5 text-primary" />
        <h2 className="font-heading text-3xl tracking-tight">
          {labels.title}
          <span className="ml-2 text-lg text-muted-foreground">
            {comments.length}
          </span>
        </h2>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-6 rounded-[1.5rem] border border-border bg-card/45 p-6"
      >
        <div className="grid gap-4">
          <label
            className="grid gap-2 text-sm font-medium"
            htmlFor="comment-name"
          >
            {labels.name}
            <input
              id="comment-name"
              placeholder={labels.namePlaceholder}
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="h-11 rounded-xl border border-border bg-background px-3 text-sm outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary"
            />
          </label>
          <label
            className="grid gap-2 text-sm font-medium"
            htmlFor="comment-body"
          >
            {labels.comment}
            <textarea
              id="comment-body"
              placeholder={labels.commentPlaceholder}
              rows={4}
              value={body}
              onChange={(event) => setBody(event.target.value)}
              className="min-h-28 resize-y rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary"
            />
          </label>
          <div className="flex flex-wrap items-center justify-between gap-3">
            {message && (
              <p className="text-sm text-muted-foreground">{message}</p>
            )}
            <button
              type="submit"
              className="group ml-auto inline-flex h-10 items-center gap-2 rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              {labels.post}
              <SendIcon className="size-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>
      </form>

      <div className="mt-8 flex flex-col gap-5">
        <AnimatePresence initial={false}>
          {comments.map((comment) => (
            <motion.div
              key={comment.id}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex gap-4 rounded-2xl border border-border bg-background p-5"
            >
              <div className="grid size-10 shrink-0 place-items-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                {initials(comment.author)}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium">{comment.author}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(comment.date, locale)}
                  </span>
                </div>
                <p className="mt-1.5 text-pretty text-sm leading-relaxed text-foreground/90">
                  {comment.body}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {comments.length === 0 && (
          <p className="rounded-2xl border border-dashed border-border py-10 text-center text-sm text-muted-foreground">
            {labels.empty}
          </p>
        )}
      </div>
    </section>
  );
}
