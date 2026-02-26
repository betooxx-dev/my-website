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
        className="group flex h-full flex-col overflow-hidden rounded-3xl border border-mint-50/15 bg-pine-900/70 transition-colors hover:border-mint-50/30 hover:bg-pine-900"
      >
        <div className="relative aspect-video overflow-hidden bg-pine-700">
          {image && (
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-pine-900/75 to-transparent" />
        </div>
        <div className="flex flex-1 flex-col p-5 md:p-6">
          <span className="mb-2 font-mono text-xs uppercase text-mint-50/80">
            {category}
          </span>
          <h3 className="mb-2 font-heading text-xl font-bold text-mint-50 md:text-2xl">
            {title}
          </h3>
          <p className="mb-4 flex-1 text-sm leading-relaxed text-mint-50/75">
            {excerpt}
          </p>
          <span className="font-mono text-xs text-mint-50/50">
            {formatDate(date, locale)}
          </span>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/blog/${slug}`}
      className="group flex flex-col rounded-3xl border border-mint-50/20 p-5 transition-colors hover:border-mint-50/40 hover:bg-pine-900/40 md:p-6"
    >
      <span className="mb-3 font-mono text-xs uppercase text-mint-50/80">
        {category}
      </span>
      <h3 className="mb-2 font-heading text-lg font-bold text-mint-50">
        {title}
      </h3>
      <p className="mb-4 flex-1 text-sm leading-relaxed text-mint-50/75">
        {excerpt}
      </p>
      <span className="font-mono text-xs text-mint-50/50">
        {formatDate(date, locale)}
      </span>
    </Link>
  );
}
