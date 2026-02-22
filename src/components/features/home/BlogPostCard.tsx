import Image from "next/image";
import { Link } from "@/i18n/navigation";

interface BlogPostCardProps {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  locale: string;
  image?: string;
  featured?: boolean;
}

function formatDate(dateStr: string, locale: string) {
  return new Date(dateStr).toLocaleDateString(
    locale === "es" ? "es-MX" : "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    },
  );
}

export default function BlogPostCard({
  slug,
  title,
  excerpt,
  category,
  date,
  locale,
  image,
  featured,
}: BlogPostCardProps) {
  if (featured) {
    return (
      <Link
        href={`/blog/${slug}`}
        className="group flex h-full flex-col overflow-hidden rounded-sm bg-navy-800/50 transition-colors hover:bg-navy-800"
      >
        <div className="relative aspect-video overflow-hidden bg-navy-700">
          {image && (
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950/60 to-transparent" />
        </div>
        <div className="flex flex-1 flex-col p-5 md:p-6">
          <span className="mb-2 font-mono text-xs uppercase text-accent-500">
            {category}
          </span>
          <h3 className="mb-2 font-heading text-xl font-bold text-white md:text-2xl">
            {title}
          </h3>
          <p className="mb-4 flex-1 text-sm leading-relaxed text-navy-300">
            {excerpt}
          </p>
          <span className="font-mono text-xs text-navy-400">
            {formatDate(date, locale)}
          </span>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/blog/${slug}`}
      className="group flex flex-col rounded-sm border border-white/5 p-5 transition-colors hover:border-white/10 hover:bg-navy-800/30 md:p-6"
    >
      <span className="mb-3 font-mono text-xs uppercase text-accent-500">
        {category}
      </span>
      <h3 className="mb-2 font-heading text-lg font-bold text-white">
        {title}
      </h3>
      <p className="mb-4 flex-1 text-sm leading-relaxed text-navy-300">
        {excerpt}
      </p>
      <span className="font-mono text-xs text-navy-400">
        {formatDate(date, locale)}
      </span>
    </Link>
  );
}
