"use client";

import type { CSSProperties } from "react";
import { useState } from "react";
import { StarIcon } from "./BlogIcons";

type StarRatingProps = {
  value: number;
  label: string;
  onChange?: (value: number) => void;
  size?: number;
  className?: string;
  readOnly?: boolean;
};

export function StarRating({
  value,
  label,
  onChange,
  size = 18,
  className = "",
  readOnly = false,
}: StarRatingProps) {
  const [hover, setHover] = useState<number | null>(null);
  const interactive = !readOnly && typeof onChange === "function";
  const display = hover ?? value;

  function renderStar(star: number) {
    const filled = star <= display;
    const iconClassName = `transition-colors ${
      filled ? "text-primary" : "text-muted-foreground/45"
    }`;
    const iconStyle = { width: size, height: size } as CSSProperties;

    if (!interactive) {
      return (
        <span key={star}>
          <StarIcon
            filled={filled}
            className={iconClassName}
            style={iconStyle}
          />
        </span>
      );
    }

    return (
      <button
        key={star}
        type="button"
        aria-label={`${star}`}
        className="cursor-pointer p-0.5 transition-transform hover:scale-110"
        onMouseEnter={() => setHover(star)}
        onMouseLeave={() => setHover(null)}
        onClick={() => onChange?.(star)}
      >
        <StarIcon filled={filled} className={iconClassName} style={iconStyle} />
      </button>
    );
  }

  return (
    <div className={`flex items-center gap-0.5 ${className}`}>
      <span className="sr-only">{label}</span>
      {[1, 2, 3, 4, 5].map(renderStar)}
    </div>
  );
}
