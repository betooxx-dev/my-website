import type { StudioPost } from "@/contracts";

export function formatStudioDate(value: string) {
  return new Intl.DateTimeFormat("es-MX", {
    day: "2-digit",
    month: "short",
  }).format(new Date(value));
}

export function formatBytes(value: number) {
  if (value < 1024) return `${value} B`;
  if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} KB`;
  return `${(value / (1024 * 1024)).toFixed(1)} MB`;
}

export function isDraftPost(post: StudioPost) {
  return post.status === "draft";
}

export function isPublishedPost(post: StudioPost) {
  return post.status === "published";
}
