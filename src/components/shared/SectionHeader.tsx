interface SectionHeaderProps {
  number: string;
  label: string;
  title: string;
}

export default function SectionHeader({
  number,
  label,
  title,
}: SectionHeaderProps) {
  return (
    <div className="mb-12 md:mb-16">
      <div className="mb-4 flex items-center gap-3">
        <span className="font-mono text-sm text-accent-500">{number}</span>
        <span className="text-xs font-medium uppercase tracking-widest text-navy-400">
          {label}
        </span>
        <span className="h-px flex-1 bg-white/10" />
      </div>
      <h2 className="font-heading text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
        {title}
      </h2>
    </div>
  );
}
