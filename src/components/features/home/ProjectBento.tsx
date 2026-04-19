"use client";

import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import TiltCard from "@/components/shared/TiltCard";

interface ProjectBentoProps {
  inProgressLabel: string;
  viewRepoLabel: string;
}

type Slot = {
  id: string;
  kind: "feature" | "wide" | "small";
  kicker: string;
  title: string;
  description: string;
  tags: readonly string[];
  href: string;
  repo: string;
  accent: string;
  wip?: boolean;
  className: string;
};

const slots: readonly Slot[] = [
  {
    id: "01",
    kind: "wide",
    kicker: "Full-stack · IA",
    title: "HandbookAI Interview",
    description:
      "App de diseño de flujos de trabajo con asistencia de IA. Backend en FastAPI, frontend en Next.js, integración con OpenAI.",
    tags: ["Next.js", "FastAPI", "OpenAI", "MySQL"],
    href: "https://github.com/betooxx-dev/handbookai-interview-1",
    repo: "betooxx-dev/handbookai-interview-1",
    accent: "from-violet-500/20",
    className: "md:col-span-2",
  },
  {
    id: "02",
    kind: "small",
    kicker: "Algoritmos",
    title: "Color Evolve",
    description:
      "Optimizador de paletas de color con algoritmos genéticos para cumplir estándares WCAG AA/AAA.",
    tags: ["Python", "JavaScript", "WCAG"],
    href: "https://github.com/betooxx-dev/color-evolve",
    repo: "betooxx-dev/color-evolve",
    accent: "from-emerald-500/20",
    className: "",
  },
  {
    id: "03",
    kind: "wide",
    kicker: "IA · Computer Vision",
    title: "Spice Snap",
    description:
      "Detección de especias mediante deep learning y visión por computadora.",
    tags: ["Python", "Deep Learning", "Computer Vision"],
    href: "https://github.com/betooxx-dev/spice-snap",
    repo: "betooxx-dev/spice-snap",
    accent: "from-rose-500/20",
    className: "md:col-span-2",
  },
  {
    id: "04",
    kind: "small",
    kicker: "Dev Tool",
    title: "TreeCalc",
    description:
      "Calculadora que visualiza expresiones matemáticas como árboles de sintaxis con análisis de tokens en tiempo real.",
    tags: ["JavaScript", "Python", "CFG"],
    href: "https://github.com/betooxx-dev/treecalc",
    repo: "betooxx-dev/treecalc",
    accent: "from-amber-500/20",
    className: "",
  },
  {
    id: "05",
    kind: "wide",
    kicker: "Game",
    title: "Juego de Letras",
    description:
      "Juego de tipeo en tiempo real con letras cayendo. Usa Web Workers para rendimiento óptimo.",
    tags: ["JavaScript", "Web Workers"],
    href: "https://github.com/betooxx-dev/pc-juego-de-letras",
    repo: "betooxx-dev/pc-juego-de-letras",
    accent: "from-sky-500/20",
    className: "md:col-span-2",
  },
  {
    id: "06",
    kind: "small",
    kicker: "Marketplace",
    title: "Barhalla MVP",
    description: "App marketplace para encontrar barberos cerca de ti.",
    tags: ["MVP"],
    href: "https://github.com/betooxx-dev/barhalla-mvp",
    repo: "betooxx-dev/barhalla-mvp",
    accent: "from-orange-500/20",
    wip: true,
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

export default function ProjectBento({
  inProgressLabel,
  viewRepoLabel,
}: ProjectBentoProps) {
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
            <a
              href={slot.href}
              target="_blank"
              rel="noopener noreferrer"
              className="paper-card-dark relative flex h-full flex-col overflow-hidden"
              aria-label={slot.title}
            >
              {/* GitHub OG image */}
              <div className="relative h-28 w-full shrink-0 overflow-hidden md:h-36">
                <Image
                  src={`https://opengraph.github.com/repo/${slot.repo}`}
                  alt={`Preview de ${slot.title}`}
                  fill
                  className="object-cover object-top opacity-80 transition-all duration-500 group-hover:opacity-100 group-hover:scale-[1.03]"
                  sizes="(max-width: 768px) 100vw, 480px"
                />
                {/* Gradient fade into card body */}
                <div
                  className={`absolute inset-0 bg-gradient-to-b ${slot.accent} via-transparent to-transparent`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1c] via-transparent to-transparent" />

                {/* Kicker badge over image */}
                <span className="absolute top-3 left-3 rounded-full border border-mint-50/15 bg-pine-900/60 px-2.5 py-1 font-mono text-[9px] tracking-[0.2em] text-mint-50/70 uppercase backdrop-blur-sm">
                  {slot.id} · {slot.kicker}
                </span>
                {slot.wip && (
                  <span className="absolute top-3 right-3 inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-pine-900/60 px-2.5 py-1 font-mono text-[9px] tracking-[0.2em] text-amber-400/80 uppercase backdrop-blur-sm">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-400" />
                    {inProgressLabel}
                  </span>
                )}
              </div>

              {/* Card body */}
              <div className="flex flex-1 flex-col justify-between p-6">
                <div>
                  <h3
                    className={`font-heading tracking-tight text-mint-50 ${
                      slot.kind === "feature"
                        ? "text-3xl md:text-4xl"
                        : "text-xl md:text-2xl"
                    }`}
                  >
                    {slot.title}
                  </h3>
                  <p className="mt-2.5 text-[13px] leading-relaxed text-mint-50/50">
                    {slot.description}
                  </p>
                </div>

                {/* Tags + arrow */}
                <div className="mt-5 flex items-end justify-between gap-3">
                  <div className="flex flex-wrap gap-1.5">
                    {slot.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-mint-50/10 bg-mint-50/5 px-2 py-0.5 font-mono text-[9px] tracking-wider text-mint-50/50 uppercase"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="shrink-0 flex items-center gap-2 text-mint-50/25 transition-colors group-hover:text-amber-400">
                    <span className="h-px w-6 bg-current transition-all duration-500 group-hover:w-10" />
                    <svg
                      aria-hidden
                      className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <title>{viewRepoLabel}</title>
                      <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" />
                    </svg>
                  </div>
                </div>
              </div>
            </a>
          </TiltCard>
        </motion.div>
      ))}
    </motion.div>
  );
}
