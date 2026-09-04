import { StudioIcon } from "@/components/features/studio/StudioIcon";
import { studioBlogChecklist, studioCopy } from "@/features/studio/content";

export function PublishChecklist() {
  const { blog } = studioCopy;

  return (
    <section className="overflow-hidden rounded-3xl bg-foreground p-6 text-background shadow-[0_26px_70px_-42px_color-mix(in_oklch,var(--foreground)_65%,transparent)]">
      <div className="flex items-center gap-3">
        <span className="grid size-10 place-items-center rounded-2xl bg-primary text-primary-foreground">
          <StudioIcon name="tasks" />
        </span>
        <div>
          <p className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-primary">
            {blog.checklistEyebrow}
          </p>
          <h2 className="mt-1 font-heading text-xl font-bold">
            {blog.checklistTitle}
          </h2>
        </div>
      </div>
      <ol className="mt-6 space-y-4">
        {studioBlogChecklist.map((item, index) => (
          <li
            className="flex items-start gap-3 text-sm leading-6 text-background/65"
            key={item}
          >
            <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full border border-primary/30 bg-primary/10 font-mono text-[0.6rem] font-semibold text-primary tabular-nums">
              {index + 1}
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
