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
        className="group flex h-full flex-col overflow-hidden rounded-3xl border border-mint-50/10 bg-pine-900/70 transition-all duration-500 hover:border-amber-400/25 hover:bg-pine-900 hover:shadow-[0_8px_40px_rgba(212,165,116,0.06)]"
      >
        <div className="relative aspect-video overflow-hidden bg-pine-700">
          {image && (
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-pine-900/80 via-pine-900/20 to-transparent" />
        </div>
        <div className="flex flex-1 flex-col p-5 md:p-6">
          <span className="mb-2 font-mono text-xs uppercase text-amber-400/80">
            {category}
          </span>
          <h3 className="mb-2 font-heading text-xl font-bold text-mint-50 transition-colors group-hover:text-amber-300 md:text-2xl">
            {title}
          </h3>
          <p className="mb-4 flex-1 text-sm leading-relaxed text-mint-50/65">
            {excerpt}
          </p>
          <span className="font-mono text-xs text-mint-50/40">
            {formatDate(date, locale)}
          </span>
        </div>
        {/* Hover accent line */}
        <div className="absolute inset-x-0 top-0 h-px bg-amber-400 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </Link>
    );
  }

  return (
    <Link
      href={`/blog/${slug}`}
      className="group relative flex flex-col rounded-3xl border border-mint-50/10 p-5 transition-all duration-500 hover:border-amber-400/20 hover:bg-pine-900/40 md:p-6"
    >
      <span className="mb-3 font-mono text-xs uppercase text-amber-400/70">
        {category}
      </span>
      <h3 className="mb-2 font-heading text-lg font-bold text-mint-50 transition-colors group-hover:text-amber-300">
        {title}
      </h3>
      <p className="mb-4 flex-1 text-sm leading-relaxed text-mint-50/65">
        {excerpt}
      </p>
      <span className="font-mono text-xs text-mint-50/40">
        {formatDate(date, locale)}
      </span>
      {/* Left accent line on hover */}
      <div className="absolute inset-y-4 left-0 w-px bg-amber-400 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
    </Link>
  );
}
