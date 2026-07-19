const DRAG_THRESHOLD_PX = 6;

export function hasDragged(startX: number, currentX: number) {
  return Math.abs(currentX - startX) > DRAG_THRESHOLD_PX;
}

export function normalizeInfiniteScroll({
  scrollLeft,
  scrollWidth,
}: {
  scrollLeft: number;
  scrollWidth: number;
}) {
  const half = scrollWidth / 2;
  if (half <= 0) {
    return scrollLeft;
  }

  if (scrollLeft >= half) {
    return scrollLeft - half;
  }

  if (scrollLeft < 0) {
    return scrollLeft + half;
  }

  return scrollLeft;
}
