"use client";

import {
  type PointerEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
} from "react";

interface DragSliderProps {
  children: ReactNode;
  gapClassName?: string;
  speed?: number;
  className?: string;
  "aria-label"?: string;
}

type SliderPointerEvent = PointerEvent<HTMLElement>;

export default function DragSlider({
  children,
  gapClassName = "gap-12",
  speed = 0.5,
  className = "",
  "aria-label": ariaLabel,
}: DragSliderProps) {
  const scrollerRef = useRef(null as HTMLElement | null);
  const rafRef = useRef(null as number | null);
  const pausedRef = useRef(false);
  const dragging = useRef(false);
  const startX = useRef(0);
  const startScroll = useRef(0);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) {
      return;
    }

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced) {
      return;
    }

    const tick = () => {
      if (!pausedRef.current && !dragging.current) {
        const half = el.scrollWidth / 2;
        let next = el.scrollLeft + speed;
        if (next >= half) {
          next -= half;
        }
        el.scrollLeft = next;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [speed]);

  const normalizeScroll = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) {
      return;
    }

    const half = el.scrollWidth / 2;
    if (el.scrollLeft >= half) {
      el.scrollLeft -= half;
    } else if (el.scrollLeft < 0) {
      el.scrollLeft += half;
    }
  }, []);

  const onPointerDown = (event: SliderPointerEvent) => {
    const el = scrollerRef.current;
    if (!el) {
      return;
    }

    dragging.current = true;
    startX.current = event.clientX;
    startScroll.current = el.scrollLeft;
    el.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: SliderPointerEvent) => {
    const el = scrollerRef.current;
    if (!el || !dragging.current) {
      return;
    }

    const delta = event.clientX - startX.current;
    el.scrollLeft = startScroll.current - delta;
    normalizeScroll();
  };

  const endDrag = (event: SliderPointerEvent) => {
    const el = scrollerRef.current;
    if (!el) {
      return;
    }

    dragging.current = false;
    if (el.hasPointerCapture(event.pointerId)) {
      el.releasePointerCapture(event.pointerId);
    }
  };

  return (
    <section
      ref={scrollerRef}
      aria-label={ariaLabel}
      className={`mask-fade-edges hide-scrollbar relative cursor-grab overflow-x-auto overscroll-x-contain active:cursor-grabbing ${className}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onMouseEnter={() => {
        pausedRef.current = true;
      }}
      onMouseLeave={() => {
        pausedRef.current = false;
      }}
      onScroll={normalizeScroll}
    >
      <div className={`flex w-max items-stretch ${gapClassName}`}>
        <div className={`flex shrink-0 items-stretch ${gapClassName}`}>
          {children}
        </div>
        <div
          className={`flex shrink-0 items-stretch ${gapClassName}`}
          aria-hidden="true"
        >
          {children}
        </div>
      </div>
    </section>
  );
}
