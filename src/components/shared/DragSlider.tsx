"use client";

import {
  type PointerEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
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
  const firstCopyRef = useRef(null as HTMLDivElement | null);
  const rafRef = useRef(null as number | null);
  const halfWidthRef = useRef(0);
  const pausedRef = useRef(false);
  const touchingRef = useRef(false);
  const dragging = useRef(false);
  const moved = useRef(false);
  const startX = useRef(0);
  const startScroll = useRef(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) {
      return;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const desktop = window.matchMedia("(min-width: 1024px)");
    const updateWidth = () => {
      halfWidthRef.current = firstCopyRef.current?.offsetWidth ?? 0;
    };
    updateWidth();
    const resizeObserver = new ResizeObserver(updateWidth);
    if (firstCopyRef.current) {
      resizeObserver.observe(firstCopyRef.current);
    }

    const tick = () => {
      if (
        !pausedRef.current &&
        !touchingRef.current &&
        !dragging.current &&
        halfWidthRef.current > 0
      ) {
        el.scrollLeft = normalizeInfiniteScroll({
          scrollLeft: el.scrollLeft + speed,
          scrollWidth: halfWidthRef.current * 2,
        });
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    let visible = false;
    let pageScrolling = false;
    let scrollResumeTimer: ReturnType<typeof setTimeout> | null = null;
    const updateAnimation = () => {
      const shouldRun =
        visible &&
        !pageScrolling &&
        !document.hidden &&
        !reducedMotion.matches &&
        !(marqueeDesktop && desktop.matches);
      if (shouldRun && rafRef.current === null) {
        rafRef.current = requestAnimationFrame(tick);
      } else if (!shouldRun && rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      setIsVisible(visible);
      updateAnimation();
    });
    const onPageScroll = () => {
      pageScrolling = true;
      updateAnimation();
      if (scrollResumeTimer !== null) {
        clearTimeout(scrollResumeTimer);
      }
      scrollResumeTimer = setTimeout(() => {
        pageScrolling = false;
        updateAnimation();
      }, 150);
    };
    visibilityObserver.observe(el);
    window.addEventListener("scroll", onPageScroll, { passive: true });
    document.addEventListener("visibilitychange", updateAnimation);
    reducedMotion.addEventListener("change", updateAnimation);
    desktop.addEventListener("change", updateAnimation);

    return () => {
      visibilityObserver.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener("scroll", onPageScroll);
      if (scrollResumeTimer !== null) {
        clearTimeout(scrollResumeTimer);
      }
      document.removeEventListener("visibilitychange", updateAnimation);
      reducedMotion.removeEventListener("change", updateAnimation);
      desktop.removeEventListener("change", updateAnimation);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [marqueeDesktop, speed]);

  const normalizeScroll = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) {
      return;
    }

    const normalized = normalizeInfiniteScroll({
      scrollLeft: el.scrollLeft,
      scrollWidth: halfWidthRef.current * 2,
    });
    if (normalized !== el.scrollLeft) {
      el.scrollLeft = normalized;
    }
  }, []);

  const onPointerDown = (event: SliderPointerEvent) => {
    const el = scrollerRef.current;
    if (!el) {
      return;
    }
    if (event.pointerType !== "mouse") {
      touchingRef.current = true;
      return;
    }

    dragging.current = true;
    moved.current = false;
    startX.current = event.clientX;
    startScroll.current = el.scrollLeft;
  };

  const onPointerMove = (event: SliderPointerEvent) => {
    const el = scrollerRef.current;
    if (!el || event.pointerType !== "mouse" || !dragging.current) {
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
    touchingRef.current = false;
    normalizeScroll();
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
          ? `desktop-marquee-pause lg:cursor-default lg:overflow-hidden lg:active:cursor-default ${isVisible ? "desktop-marquee-active" : ""}`
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
    >
      <div
        className={`flex w-max items-stretch ${
          marqueeDesktop ? "desktop-marquee-track" : ""
        }`}
      >
        <div
          ref={firstCopyRef}
          className={`flex shrink-0 items-stretch ${gapClassName}`}
        >
          {children}
          <span className="w-0 shrink-0" aria-hidden="true" />
        </div>
        <div
          className={`flex shrink-0 items-stretch ${gapClassName}`}
          aria-hidden="true"
          inert
        >
          {children}
          <span className="w-0 shrink-0" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
