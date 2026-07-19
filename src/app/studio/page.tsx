import Link from "next/link";
import { StudioFrame } from "@/components/features/studio/StudioFrame";
import {
  StudioIcon,
  type StudioIconName,
} from "@/components/features/studio/StudioIcon";
import {
  StudioEmptyState,
  StudioPageHeader,
  StudioPanel,
  StudioStatusBadge,
  studioPrimaryButtonClass,
  studioSecondaryButtonClass,
} from "@/components/features/studio/StudioUi";
import { getStudioDashboardData } from "@/lib/studio-api";
import { studioCopy } from "@/lib/studio-content";
import { requireStudioSession } from "@/lib/studio-session";

type DashboardMetric = {
  icon: StudioIconName;
  label: string;
  meta: string;
  value: string;
};

export default async function StudioPage() {
  await requireStudioSession();

  const data = await getStudioDashboardData();
  const { dashboard } = studioCopy;
  const posts = data.posts.data;
  const publishedCount = posts.filter(
    (post) => post.status === "published",
  ).length;
  const metrics: DashboardMetric[] = [
    {
      icon: "writing",
      label: dashboard.publishQueue,
      meta: resourceDelta(data.posts.status),
      value: posts.filter((post) => post.status === "draft").length.toString(),
    },
    {
      icon: "spark",
      label: dashboard.latestSignal,
      meta:
        data.posts.status === "available"
          ? `${publishedCount} publicadas`
          : resourceDelta(data.posts.status),
      value: data.posts.status === "available" ? "Blog" : "—",
    },
  ];

  return (
    <StudioFrame active="dashboard">
      <section className="rounded-[1.5rem] border border-border/80 bg-card p-4 shadow-[0_18px_48px_-44px_color-mix(in_oklch,var(--foreground)_28%,transparent)] sm:p-5">
        <StudioPageHeader
          actions={
            <>
              <Link
                className={studioPrimaryButtonClass}
                href="/studio/blog#new-post"
              >
                <StudioIcon className="size-4" name="writing" />
                {dashboard.newPost}
              </Link>
              <Link className={studioSecondaryButtonClass} href="/es/blog">
                {dashboard.viewBlog}
                <StudioIcon className="size-4" name="external" />
              </Link>
            </>
          }
          description={dashboard.description}
          eyebrow={dashboard.eyebrow}
          title={dashboard.title}
        />

        <section
          aria-label={dashboard.metricsLabel}
          className="mt-5 grid gap-3 sm:grid-cols-2"
        >
          {metrics.map((metric) => (
            <article
              className="group rounded-2xl border border-border/80 bg-muted/35 p-2.5 transition-[border-color,transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-[0_18px_38px_-32px_color-mix(in_oklch,var(--primary)_38%,transparent)] motion-reduce:transition-none"
              key={metric.label}
            >
              <div className="flex items-center gap-3 rounded-xl border border-border/70 bg-card p-3 shadow-[0_10px_26px_-24px_color-mix(in_oklch,var(--foreground)_30%,transparent)]">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground shadow-[0_12px_24px_-18px_color-mix(in_oklch,var(--primary)_80%,transparent)]">
                  <StudioIcon className="size-[1.1rem]" name={metric.icon} />
                </span>
                <div className="min-w-0">
                  <p className="font-heading text-2xl font-bold leading-none tracking-tight text-foreground tabular-nums">
                    {metric.value}
                  </p>
                  <p className="mt-1 truncate text-xs text-muted-foreground">
                    {metric.meta}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between gap-3 px-1 pt-3 pb-1">
                <p className="text-sm font-semibold text-foreground">
                  {metric.label}
                </p>
                <span
                  aria-hidden="true"
                  className="tracking-[0.18em] text-muted-foreground/55"
                >
                  ···
                </span>
              </div>
            </article>
          ))}
        </section>
      </section>

      <div className="mt-3">
        <StudioPanel
          action={
            <Link
              className="inline-flex min-h-10 items-center gap-1.5 rounded-xl px-3 text-sm font-semibold text-primary transition-colors hover:bg-primary/8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary motion-reduce:transition-none"
              href="/studio/blog"
            >
              {dashboard.openDesk}
              <StudioIcon className="size-4" name="arrow" />
            </Link>
          }
          description={dashboard.pipelineDescription}
          icon="writing"
          title={dashboard.pipelineTitle}
        >
          <div className="divide-y divide-border/70">
            {posts.length > 0 ? (
              posts.slice(0, 4).map((post) => (
                <article
                  className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5"
                  key={post.id}
                >
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-semibold text-foreground sm:text-base">
                      {post.title}
                    </h3>
                    <p className="mt-1.5 font-mono text-[0.63rem] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                      {post.locale.toUpperCase()} ·{" "}
                      {formatStudioDate(post.updatedAt)}
                    </p>
                  </div>
                  <StudioStatusBadge
                    label={postStatusLabel(post.status)}
                    tone={post.status === "published" ? "live" : "draft"}
                  />
                </article>
              ))
            ) : (
              <StudioEmptyState
                actionHref="/studio/blog#new-post"
                actionLabel={dashboard.newPost}
                body={resourceMessage(data.posts.status)}
                testId="studio-posts-empty"
                title={dashboard.noPostsTitle}
              />
            )}
          </div>
        </StudioPanel>
      </div>
    </StudioFrame>
  );
}

function resourceDelta(status: "available" | "unauthorized" | "unavailable") {
  if (status === "available") return "Datos en vivo";
  if (status === "unauthorized") return "Requiere acceso";
  return "Sin conexión";
}

function resourceMessage(status: "available" | "unauthorized" | "unavailable") {
  if (status === "unauthorized") {
    return "Argos rechazó la clave de API configurada para Studio.";
  }

  if (status === "available") {
    return "Aún no hay datos. Este espacio se actualizará cuando agregues el primer registro.";
  }

  return "Este recurso administrativo de Argos no está disponible en el entorno actual.";
}

function formatStudioDate(value: string) {
  return new Intl.DateTimeFormat("es-MX", {
    day: "2-digit",
    month: "short",
  }).format(new Date(value));
}

function postStatusLabel(status: "draft" | "published") {
  return status === "published" ? "Publicada" : "Borrador";
}
