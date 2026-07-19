"use client";

import Image from "next/image";

function markdownImageLoader({ src }: { src: string }): string {
  return src;
}

export function MarkdownImage({ alt, src }: { alt: string; src: string }) {
  return (
    <Image
      alt={alt}
      className="h-auto w-full rounded-[1.25rem] border border-border object-cover"
      height={675}
      loader={markdownImageLoader}
      sizes="(max-width: 768px) 100vw, 768px"
      src={src}
      unoptimized
      width={1200}
    />
  );
}
