"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface BlogPreviewCardsProps {
  comingSoonLabel: string;
}

type Draft = {
  n: string;
  category: string;
  title: string;
  date: string;
};

const drafts: readonly Draft[] = [
  {
    n: "01",
    category: "Engineering",
    title: "Notes on shipping with Next.js in 2026",
    date: "Borrador",
  },
  {
    n: "02",
    category: "Craft",
    title: "Designing with restraint on dark interfaces",
    date: "Borrador",
  },
  {
    n: "03",
    category: "Thinking",
    title: "Why personal sites still matter",
    date: "Borrador",
  },
] as const;

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export default function BlogPreviewCards({
  comingSoonLabel,
}: BlogPreviewCardsProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <motion.div
      ref={ref}
      variants={container}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-6"
    >
      {drafts.map((d) => (
        <motion.article
          key={d.n}
          variants={item}
          className="group paper-card-dark flex min-h-[320px] cursor-default flex-col justify-between p-7 md:min-h-[360px] md:p-8"
        >
          <header className="flex items-center justify-between">
            <span className="font-mono text-[11px] tracking-[0.25em] text-mint-50/40 uppercase">
              {d.n} / {d.category}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/20 bg-amber-400/5 px-2.5 py-1 font-mono text-[9px] tracking-[0.2em] text-amber-300 uppercase">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-400" />
              {comingSoonLabel}
            </span>
          </header>

          <div>
            <h3 className="font-heading text-2xl leading-[1.1] tracking-tight text-mint-50 md:text-3xl text-balance">
              {d.title}
            </h3>
            <p className="mt-5 font-mono text-[10px] tracking-[0.3em] text-mint-50/40 uppercase">
              {d.date}
            </p>
          </div>

          <div className="flex items-center gap-3 text-mint-50/40 transition-colors group-hover:text-amber-300">
            <span className="h-px w-8 bg-current transition-all duration-500 group-hover:w-16" />
            <svg
              aria-hidden
              className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <title>Arrow</title>
              <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" />
            </svg>
          </div>
        </motion.article>
      ))}
    </motion.div>
  );
}
