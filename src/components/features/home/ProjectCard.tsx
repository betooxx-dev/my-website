import Image from "next/image";
import { getTranslations } from "next-intl/server";

interface ProjectCardProps {
  title: string;
  description: string;
  image: string;
  tags: readonly string[];
  href: string;
  index: number;
  featured?: boolean;
  wip?: boolean;
}

export default async function ProjectCard({
  title,
  description,
  image,
  tags,
  href,
  index,
  featured,
  wip,
}: ProjectCardProps) {
  const t = await getTranslations("projects");
  const number = String(index + 1).padStart(2, "0");

  return (
    <a
      href={href}
      className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-pine-900/10 bg-white transition-all duration-500 hover:border-amber-500/30 hover:shadow-[0_8px_40px_rgba(212,165,116,0.12)]"
    >
      {/* Image */}
      <div
        className={`relative overflow-hidden bg-pine-900 ${featured ? "aspect-[16/10]" : "aspect-video"}`}
      >
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          sizes={
            featured
              ? "(max-width: 768px) 100vw, 58vw"
              : "(max-width: 768px) 100vw, 42vw"
          }
        />
        <div className="absolute inset-0 bg-gradient-to-t from-pine-900/80 via-pine-900/20 to-transparent" />

        {/* Project number overlay */}
        <span className="absolute bottom-3 right-4 font-mono text-xs text-mint-50/40 transition-colors group-hover:text-amber-300/70">
          P.{number}
        </span>

        {/* WIP badge */}
        {wip && (
          <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-pine-900/70 px-3 py-1 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-400" />
            </span>
            <span className="font-mono text-xs text-amber-300">
              {t("inProgress")}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5 md:p-6">
        <h3 className="mb-2 font-heading text-xl font-bold text-pine-900 transition-colors group-hover:text-amber-500 md:text-2xl">
          {title}
        </h3>
        <p className="mb-4 flex-1 text-sm leading-relaxed text-pine-900/60">
          {description}
        </p>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-pine-900/10 bg-pine-900/5 px-3 py-1 font-mono text-xs text-pine-900/50 transition-colors group-hover:border-amber-500/20 group-hover:text-pine-900/70"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Hover accent line at top */}
      <div className="absolute inset-x-0 top-0 h-px bg-amber-400 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
    </a>
  );
}
