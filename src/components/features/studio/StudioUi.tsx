import Link from "next/link";
import { StudioIcon, type StudioIconName } from "./StudioIcon";

export const studioEyebrowClass =
  "flex items-center gap-3 font-mono text-[0.68rem] font-medium uppercase tracking-[0.24em] text-primary";

export const studioInputClass =
  "min-h-12 w-full rounded-xl border border-input bg-background px-3.5 text-base text-foreground shadow-sm transition-[border-color,box-shadow,background-color] duration-200 placeholder:text-muted-foreground/70 hover:border-foreground/25 focus-visible:border-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/15 motion-reduce:transition-none";

export const studioLabelClass =
  "font-mono text-[0.7rem] font-medium uppercase tracking-[0.16em] text-foreground/70";

export const studioPrimaryButtonClass =
  "inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-[0_14px_30px_-20px_color-mix(in_oklch,var(--primary)_75%,transparent)] transition-[background-color,box-shadow,transform] duration-200 hover:bg-primary/90 hover:shadow-[0_18px_36px_-20px_color-mix(in_oklch,var(--primary)_70%,transparent)] active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none";

export const studioSecondaryButtonClass =
  "inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 text-sm font-semibold text-foreground transition-[border-color,background-color,transform] duration-200 hover:border-primary/35 hover:bg-primary/5 active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none";

type StudioPageHeaderProps = {
  actions?: React.ReactNode;
  description: string;
  eyebrow: string;
  title: string;
};

export function StudioPageHeader({
  actions,
  description,
  eyebrow,
  title,
}: StudioPageHeaderProps) {
  return (
    <header className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
      <div className="max-w-4xl">
        <p className={studioEyebrowClass}>
          <span aria-hidden="true" className="h-px w-8 bg-primary/65" />
          {eyebrow}
        </p>
        <h1 className="text-balance mt-3 font-heading text-3xl font-bold leading-tight tracking-[-0.03em] text-foreground sm:text-4xl">
          {title}
        </h1>
        <p className="mt-2 max-w-2xl text-pretty text-sm leading-6 text-muted-foreground sm:text-base">
          {description}
        </p>
      </div>
      {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
    </header>
  );
}

type StudioPanelProps = {
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  description?: string;
  icon?: StudioIconName;
  title: string;
};

export function StudioPanel({
  action,
  children,
  className = "",
  description,
  icon,
  title,
}: StudioPanelProps) {
  return (
    <section
      className={`overflow-hidden rounded-[1.4rem] border border-border/80 bg-card shadow-[0_18px_48px_-44px_color-mix(in_oklch,var(--foreground)_28%,transparent)] ${className}`}
    >
      <header className="flex items-start justify-between gap-4 border-border/80 border-b px-4 py-4 sm:px-5">
        <div className="flex min-w-0 items-start gap-3">
          {icon ? (
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
              <StudioIcon name={icon} />
            </span>
          ) : null}
          <div className="min-w-0">
            <h2 className="font-heading text-lg font-bold tracking-tight text-foreground">
              {title}
            </h2>
            {description ? (
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                {description}
              </p>
            ) : null}
          </div>
        </div>
        {action}
      </header>
      {children}
    </section>
  );
}

type StudioEmptyStateProps = {
  actionHref?: string;
  actionLabel?: string;
  body: string;
  icon?: StudioIconName;
  testId?: string;
  title: string;
};

export function StudioEmptyState({
  actionHref,
  actionLabel,
  body,
  icon = "spark",
  testId,
  title,
}: StudioEmptyStateProps) {
  return (
    <div className="px-5 py-8 text-center sm:px-8" data-testid={testId}>
      <span className="mx-auto grid size-11 place-items-center rounded-2xl bg-muted text-muted-foreground">
        <StudioIcon name={icon} />
      </span>
      <h3 className="mt-4 font-heading text-lg font-bold text-foreground">
        {title}
      </h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
        {body}
      </p>
      {actionHref && actionLabel ? (
        <Link
          className="mt-5 inline-flex min-h-11 items-center justify-center rounded-full border border-border px-4 text-sm font-semibold text-foreground transition-colors hover:border-primary/50 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary motion-reduce:transition-none"
          href={actionHref}
        >
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}

type StudioStatusBadgeProps = {
  label: string;
  tone?: "draft" | "live" | "neutral" | "warning";
};

const statusClasses: Record<
  NonNullable<StudioStatusBadgeProps["tone"]>,
  string
> = {
  draft: "border-border bg-muted text-foreground/75",
  live: "border-primary/25 bg-primary/10 text-primary",
  neutral: "border-border bg-background text-muted-foreground",
  warning: "border-destructive/25 bg-destructive/10 text-destructive",
};

export function StudioStatusBadge({
  label,
  tone = "neutral",
}: StudioStatusBadgeProps) {
  return (
    <span
      className={`inline-flex min-h-8 items-center gap-2 rounded-full border px-3 font-mono text-[0.65rem] font-medium uppercase tracking-[0.14em] ${statusClasses[tone]}`}
    >
      <span
        aria-hidden="true"
        className={`size-1.5 rounded-full ${tone === "live" ? "bg-primary" : tone === "warning" ? "bg-destructive" : "bg-current"}`}
      />
      {label}
    </span>
  );
}
