import { StudioIcon } from "@/components/features/studio/StudioIcon";
import { studioCopy } from "@/lib/studio-content";

type StudioLoginPageProps = {
  searchParams: Promise<{ error?: string }>;
};

const circuitDotIds = [
  "dot-01",
  "dot-02",
  "dot-03",
  "dot-04",
  "dot-05",
  "dot-06",
  "dot-07",
  "dot-08",
  "dot-09",
  "dot-10",
  "dot-11",
  "dot-12",
] as const;

export default async function StudioLoginPage({
  searchParams,
}: StudioLoginPageProps) {
  const { error } = await searchParams;
  const copy = studioCopy.login;
  const showError = error === "invalid";

  return (
    <main
      className="studio-canvas relative grid min-h-dvh place-items-center overflow-hidden bg-background px-4 py-6 text-foreground sm:px-6"
      id="studio-login-main"
    >
      <CircuitBackdrop />

      <section
        aria-describedby="studio-login-description"
        aria-labelledby="studio-login-title"
        className="relative z-10 w-full max-w-[31rem] overflow-hidden rounded-[1.75rem] border border-border/90 bg-card/95 p-5 shadow-[0_36px_100px_-52px_color-mix(in_oklch,var(--foreground)_42%,transparent),0_18px_46px_-32px_color-mix(in_oklch,var(--primary)_32%,transparent)] backdrop-blur-xl sm:px-9"
      >
        <span
          aria-hidden="true"
          className="absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent"
        />

        <div
          className="flex items-center justify-center gap-3"
          aria-hidden="true"
        >
          <span className="h-px w-14 bg-gradient-to-r from-transparent to-primary/35" />
          <span className="grid size-14 place-items-center rounded-[1.15rem] border border-primary/12">
            <span className="grid size-12 place-items-center rounded-2xl border border-primary/25 bg-primary/10 text-primary shadow-[0_14px_34px_-22px_color-mix(in_oklch,var(--primary)_80%,transparent)]">
              <StudioIcon className="size-6" name="lock" />
            </span>
          </span>
          <span className="h-px w-14 bg-gradient-to-l from-transparent to-primary/35" />
        </div>

        <div className="mt-4 text-center">
          <p className="font-mono text-[0.66rem] font-semibold uppercase tracking-[0.24em] text-primary">
            {copy.title} · {copy.eyebrow}
          </p>
          <h1
            className="mt-3 text-balance font-heading text-4xl font-bold leading-none tracking-[-0.035em] text-foreground sm:text-[2.7rem]"
            id="studio-login-title"
          >
            {copy.formTitle}
          </h1>
          <p
            className="mx-auto mt-2 max-w-sm text-pretty text-sm leading-6 text-muted-foreground sm:text-base"
            id="studio-login-description"
          >
            {copy.formDescription}
          </p>
        </div>

        <form
          action="/api/studio/session"
          className="mt-6"
          id="studio-login-form"
          method="post"
        >
          <label
            className="block font-mono text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-foreground/70"
            htmlFor="username"
          >
            {copy.usernameLabel}
          </label>
          <div className="relative mt-2.5">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 left-4 grid place-items-center text-muted-foreground"
            >
              <StudioIcon className="size-[1.15rem]" name="user" />
            </span>
            <input
              aria-describedby={showError ? "studio-login-error" : undefined}
              aria-invalid={showError || undefined}
              autoComplete="username"
              className="block min-h-12 w-full rounded-[0.875rem] border border-input bg-muted/55 py-2.5 pl-12 pr-4 text-base text-foreground transition-[border-color,background-color,box-shadow] duration-200 placeholder:text-muted-foreground/70 hover:border-foreground/25 hover:bg-background focus-visible:border-primary focus-visible:bg-background focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/15 motion-reduce:transition-none"
              id="username"
              name="username"
              placeholder={copy.usernamePlaceholder}
              required
              type="text"
            />
          </div>

          <label
            className="mt-4 block font-mono text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-foreground/70"
            htmlFor="password"
          >
            {copy.passwordLabel}
          </label>
          <div className="relative mt-2.5">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 left-4 grid place-items-center text-muted-foreground"
            >
              <StudioIcon className="size-[1.15rem]" name="lock" />
            </span>
            <input
              aria-describedby={showError ? "studio-login-error" : undefined}
              aria-invalid={showError || undefined}
              autoComplete="current-password"
              className="block min-h-12 w-full rounded-[0.875rem] border border-input bg-muted/55 py-2.5 pl-12 pr-4 text-base text-foreground transition-[border-color,background-color,box-shadow] duration-200 placeholder:text-muted-foreground/70 hover:border-foreground/25 hover:bg-background focus-visible:border-primary focus-visible:bg-background focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/15 motion-reduce:transition-none"
              id="password"
              name="password"
              placeholder={copy.passwordPlaceholder}
              required
              type="password"
            />
          </div>

          {showError ? (
            <p
              className="mt-4 flex items-start gap-3 rounded-2xl border border-destructive/25 bg-destructive/8 px-4 py-3 text-sm leading-6 text-destructive"
              id="studio-login-error"
              role="alert"
            >
              <span
                aria-hidden="true"
                className="mt-2 size-1.5 shrink-0 rounded-full bg-destructive"
              />
              {copy.invalidCode}
            </p>
          ) : null}

          <button
            className="mt-5 inline-flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-5 text-base font-semibold text-primary-foreground shadow-[0_18px_38px_-22px_color-mix(in_oklch,var(--primary)_85%,transparent)] transition-[background-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-[0_22px_46px_-20px_color-mix(in_oklch,var(--primary)_75%,transparent)] active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transform-none motion-reduce:transition-none"
            type="submit"
          >
            {copy.submit}
            <StudioIcon className="size-4" name="arrow" />
          </button>
        </form>
      </section>
    </main>
  );
}

function CircuitBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <div className="absolute left-1/2 top-1/2 size-[48rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/8 blur-3xl" />
      <svg
        className="absolute inset-0 hidden size-full text-primary/25 sm:block"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 1440 900"
      >
        <title>{studioCopy.login.circuitTitle}</title>
        <path
          d="M0 132H132L220 220V305L376 450H480"
          stroke="currentColor"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M1440 132H1308L1220 220V305L1064 450H960"
          stroke="currentColor"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M0 768H132L220 680V595L376 450H480"
          stroke="currentColor"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M1440 768H1308L1220 680V595L1064 450H960"
          stroke="currentColor"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
        <g fill="currentColor">
          <circle cx="132" cy="132" r="4" />
          <circle cx="1308" cy="132" r="4" />
          <circle cx="132" cy="768" r="4" />
          <circle cx="1308" cy="768" r="4" />
        </g>
      </svg>

      <CircuitNode className="left-4 top-[12%] sm:left-8" />
      <CircuitNode className="right-4 top-[12%] sm:right-8" />
      <CircuitNode className="bottom-[12%] left-4 sm:left-8" />
      <CircuitNode className="bottom-[12%] right-4 sm:right-8" />
    </div>
  );
}

function CircuitNode({ className }: { className: string }) {
  return (
    <span
      className={`absolute hidden h-11 w-24 items-center justify-center rounded-xl border border-primary/20 bg-card/70 shadow-sm backdrop-blur sm:flex ${className}`}
    >
      <span className="grid grid-cols-6 gap-1">
        {circuitDotIds.map((dotId) => (
          <span
            className={`size-1 rounded-full ${dotId === "dot-09" ? "bg-primary" : "bg-primary/20"}`}
            key={dotId}
          />
        ))}
      </span>
    </span>
  );
}
