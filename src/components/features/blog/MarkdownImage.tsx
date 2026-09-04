export function MarkdownImage({ alt, src }: { alt: string; src: string }) {
  return (
    // Markdown authors may use arbitrary HTTPS hosts, which cannot be known in
    // Next's remote image allowlist at build time.
    // biome-ignore lint/performance/noImgElement: see explanation above
    <img
      alt={alt}
      className="h-auto w-full rounded-[1.25rem] border border-border object-cover"
      decoding="async"
      height={675}
      loading="lazy"
      src={src}
      width={1200}
    />
  );
}
