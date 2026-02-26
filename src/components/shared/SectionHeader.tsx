interface SectionHeaderProps {
  number: string;
  label: string;
  title: string;
  tone?: "light" | "dark";
}

export default function SectionHeader({
  number,
  label,
  title,
  tone = "light",
}: SectionHeaderProps) {
  const isDark = tone === "dark";

  return (
    <div className="mb-12 md:mb-16">
      <div className="mb-4 flex items-center gap-3">
        <span
          className={`font-mono text-sm ${isDark ? "text-pine-900" : "text-mint-50"}`}
        >
          {number}
        </span>
        <span
          className={`text-xs font-medium uppercase tracking-widest ${isDark ? "text-pine-700/70" : "text-mint-50/60"}`}
        >
          {label}
        </span>
        <span
          className={`h-px flex-1 ${isDark ? "bg-pine-900/20" : "bg-mint-50/20"}`}
        />
      </div>
      <h2
        className={`font-heading text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl ${isDark ? "text-pine-900" : "text-mint-50"}`}
      >
        {title}
      </h2>
    </div>
  );
}
