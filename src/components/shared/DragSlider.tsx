"use client";

import {
  type PointerEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { hasDragged, normalizeInfiniteScroll } from "./infinite-slider";

interface DragSliderProps {
  children: ReactNode;
  gapClassName?: string;
  speed?: number;
  className?: string;
  marqueeDesktop?: boolean;
  "aria-label"?: string;
}

type SliderPointerEvent = PointerEvent<HTMLElement>;

export default function DragSlider({
  children,
  gapClassName = "gap-12",
  speed = 0.5,
  className = "",
  marqueeDesktop = false,
  "aria-label": ariaLabel,
}: DragSliderProps) {
  const scrollerRef = useRef(null as HTMLElement | null);
  const rafRef = useRef(null as number | null);
  const pausedRef = useRef(false);
  const dragging = useRef(false);
  const moved = useRef(false);
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

    const desktop = window.matchMedia("(min-width: 1024px)");
    if (marqueeDesktop && desktop.matches) {
      return;
    }

    const tick = () => {
      if (!pausedRef.current && !dragging.current) {
        el.scrollLeft = normalizeInfiniteScroll({
          scrollLeft: el.scrollLeft + speed,
          scrollWidth: el.scrollWidth,
        });
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [marqueeDesktop, speed]);

  const normalizeScroll = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) {
      return;
    }

    el.scrollLeft = normalizeInfiniteScroll({
      scrollLeft: el.scrollLeft,
      scrollWidth: el.scrollWidth,
    });
  }, []);

  const onPointerDown = (event: SliderPointerEvent) => {
    const el = scrollerRef.current;
    if (!el) {
      return;
    }

    dragging.current = true;
    moved.current = false;
    startX.current = event.clientX;
    startScroll.current = el.scrollLeft;
  };

  const onPointerMove = (event: SliderPointerEvent) => {
    const el = scrollerRef.current;
    if (!el || !dragging.current) {
      return;
    }

    const delta = event.clientX - startX.current;
    if (hasDragged(startX.current, event.clientX)) {
      moved.current = true;
      if (!el.hasPointerCapture(event.pointerId)) {
        el.setPointerCapture(event.pointerId);
      }
    }
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
      className={`mask-fade-edges hide-scrollbar relative cursor-grab overflow-x-auto overscroll-x-contain active:cursor-grabbing ${
        marqueeDesktop
          ? "desktop-marquee-pause lg:cursor-default lg:overflow-hidden lg:active:cursor-default"
          : ""
      } ${className}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onClickCapture={(event) => {
        if (moved.current) {
          event.preventDefault();
          event.stopPropagation();
        }
        moved.current = false;
      }}
      onMouseEnter={() => {
        pausedRef.current = true;
      }}
      onMouseLeave={() => {
        pausedRef.current = false;
      }}
      onScroll={normalizeScroll}
    >
      <div
        className={`flex w-max items-stretch ${
          marqueeDesktop ? "desktop-marquee-track" : ""
        } ${gapClassName}`}
      >
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
