"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import TiltCard from "@/components/shared/TiltCard";

interface ProjectBentoProps {
  inProgressLabel: string;
}

type Slot = {
  id: string;
  kind: "feature" | "tall" | "wide" | "small";
  kicker: string;
  title: string;
  meta: string;
  className: string;
};

const slots: readonly Slot[] = [
  {
    id: "01",
    kind: "feature",
    kicker: "Featured",
    title: "Flagship project",
    meta: "Full-stack · 2025",
    className: "md:col-span-2 md:row-span-2",
  },
  {
    id: "02",
    kind: "small",
    kicker: "Client work",
    title: "Product surface",
    meta: "Design · Build",
    className: "",
  },
  {
    id: "03",
    kind: "small",
    kicker: "Open source",
    title: "Tooling library",
    meta: "TypeScript",
    className: "",
  },
  {
    id: "04",
    kind: "wide",
    kicker: "Experiment",
    title: "Interaction study",
    meta: "Motion · WebGL",
    className: "md:col-span-2",
  },
  {
    id: "05",
    kind: "small",
    kicker: "Writing",
    title: "Essay & notes",
    meta: "Long-form",
    className: "",
  },
] as const;

const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 60, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export default function ProjectBento({ inProgressLabel }: ProjectBentoProps) {
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
      {slots.map((slot) => (
        <motion.div
          key={slot.id}
          variants={item}
          className={`group ${slot.className}`}
        >
          <TiltCard max={6} className="h-full min-h-[260px] md:min-h-[280px]">
            <article className="paper-card relative flex h-full flex-col justify-between overflow-hidden p-7 md:p-8">
              {/* Subtle grain inside card for editorial texture */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-[0.04]"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 1px 1px, #1d1d1f 1px, transparent 0)",
                  backgroundSize: "18px 18px",
                }}
              />

              {/* Top row — number + status */}
              <header className="relative flex items-center justify-between">
                <span className="font-mono text-[11px] tracking-[0.25em] text-pine-900/40 uppercase">
                  {slot.id} / {slot.kicker}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-pine-900/5 px-2.5 py-1 font-mono text-[9px] tracking-[0.2em] text-pine-900/50 uppercase">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500" />
                  {inProgressLabel}
                </span>
              </header>

              {/* Title */}
              <div className="relative mt-12 md:mt-16">
                <h3
                  className={`font-heading tracking-tight text-pine-900 ${
                    slot.kind === "feature"
                      ? "text-4xl md:text-5xl"
                      : "text-2xl md:text-3xl"
                  }`}
                >
                  {slot.title}
                </h3>
                <p className="mt-3 font-mono text-xs tracking-wider text-pine-700/60 uppercase">
                  {slot.meta}
                </p>
              </div>

              {/* Bottom arrow indicator */}
              <div className="relative mt-8 flex items-center gap-3 text-pine-900/40 transition-colors group-hover:text-amber-500">
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
            </article>
          </TiltCard>
        </motion.div>
      ))}
    </motion.div>
  );
}
