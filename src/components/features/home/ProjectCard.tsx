import Image from "next/image";

interface ProjectCardProps {
  title: string;
  description: string;
  image: string;
  tags: readonly string[];
  href: string;
  index: number;
  featured?: boolean;
}

export default function ProjectCard({
  title,
  description,
  image,
  tags,
  href,
  index,
  featured,
}: ProjectCardProps) {
  const number = String(index + 1).padStart(2, "0");

  return (
    <a
      href={href}
      className="group relative flex h-full flex-col overflow-hidden rounded-sm bg-navy-800/50 transition-colors hover:bg-navy-800"
    >
      {/* Image */}
      <div
        className={`relative overflow-hidden bg-navy-700 ${featured ? "aspect-[16/10]" : "aspect-video"}`}
      >
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes={
            featured
              ? "(max-width: 768px) 100vw, 58vw"
              : "(max-width: 768px) 100vw, 42vw"
          }
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/60 to-transparent" />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5 md:p-6">
        <span className="mb-2 font-mono text-xs text-accent-500/60">
          P.{number}
        </span>
        <h3 className="mb-2 font-heading text-xl font-bold text-white md:text-2xl">
          {title}
        </h3>
        <p className="mb-4 flex-1 text-sm leading-relaxed text-navy-300">
          {description}
        </p>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-navy-700/50 px-3 py-1 font-mono text-xs text-navy-200"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </a>
  );
}
