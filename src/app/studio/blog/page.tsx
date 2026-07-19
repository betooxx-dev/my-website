import Image from "next/image";
import Link from "next/link";
import { StudioFrame } from "@/components/features/studio/StudioFrame";
import { StudioIcon } from "@/components/features/studio/StudioIcon";
import { StudioSavedFeedback } from "@/components/features/studio/StudioSavedFeedback";
import { StudioSubmitButton } from "@/components/features/studio/StudioSubmitButton";
import {
  StudioEmptyState,
  StudioPageHeader,
  StudioPanel,
  StudioStatusBadge,
  studioInputClass,
  studioLabelClass,
  studioSecondaryButtonClass,
} from "@/components/features/studio/StudioUi";
import { StudioUnsavedChanges } from "@/components/features/studio/StudioUnsavedChanges";
import { shouldBypassImageOptimization } from "@/lib/image-policy";
import { getStudioBlogData } from "@/lib/studio-api";
import { studioBlogChecklist, studioCopy } from "@/lib/studio-content";
import { studioPostRecoveryKey } from "@/lib/studio-feedback";
import type { StudioAsset, StudioPost } from "@/lib/studio-schema";
import { requireStudioSession } from "@/lib/studio-session";
import {
  createDraftAction,
  publishPostAction,
  unpublishPostAction,
  updatePostAction,
  uploadAssetAction,
} from "./actions";
import { StudioPostFields } from "./post-fields";

type StudioBlogPageProps = {
  searchParams: Promise<{
    error?: string | string[];
    saved?: string | string[];
  }>;
};

export default async function StudioBlogPage({
  searchParams,
}: StudioBlogPageProps) {
  await requireStudioSession();

  const [data, query] = await Promise.all([getStudioBlogData(), searchParams]);
  const { blog } = studioCopy;
  const posts = data.posts.data;
  const assets = data.assets.data;
  const drafts = posts.filter(isDraftPost);
  const published = posts.filter(isPublishedPost);
  const savedKey = typeof query.saved === "string" ? query.saved : null;

  return (
    <StudioFrame active="blog">
      <StudioPageHeader
        actions={
          <Link className={studioSecondaryButtonClass} href="/es/blog">
            {blog.viewPublicBlog}
            <StudioIcon className="size-4" name="external" />
          </Link>
        }
        description={blog.description}
        eyebrow={blog.eyebrow}
        title={blog.title}
      />

      {typeof query.error === "string" ? (
        <p
          aria-live="assertive"
          className="mt-6 flex items-start gap-3 rounded-2xl border border-destructive/25 bg-destructive/8 px-4 py-3 text-sm leading-6 text-destructive"
          role="alert"
        >
          <span
            aria-hidden="true"
            className="mt-2 size-1.5 shrink-0 rounded-full bg-destructive"
          />
          {query.error}
        </p>
      ) : null}

      {savedKey ? <StudioSavedFeedback message={blog.savedNotice} /> : null}

      <div className="mt-8 grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_21rem]">
        <div className="scroll-mt-6" id="new-post">
          <StudioPanel
            description={blog.createDescription}
            icon="writing"
            title={blog.createTitle}
          >
            <form action={createDraftAction} className="p-4 sm:p-6">
              <StudioUnsavedChanges
                clearWhen={savedKey === "new-post"}
                message={blog.unsavedWarning}
                storageKey="new-post"
              />
              <StudioPostFields assets={assets} fieldIdPrefix="new-post" />
              <div className="mt-6 flex flex-col gap-3 border-border/80 border-t pt-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm leading-6 text-muted-foreground">
                  {blog.draftHint}
                </p>
                <StudioSubmitButton
                  className="w-full sm:w-auto"
                  icon="writing"
                  intent="create-draft"
                  pendingLabel={blog.savingDraft}
                >
                  {blog.saveDraft}
                </StudioSubmitButton>
              </div>
            </form>
          </StudioPanel>
        </div>

        <aside className="grid gap-6 xl:sticky xl:top-10">
          <PublishChecklist />
          <PublishedPosts
            assets={assets}
            posts={published}
            savedKey={savedKey}
          />
        </aside>
      </div>

      <div className="mt-6">
        <AssetLibrary
          assets={assets}
          available={data.assets.status === "available"}
        />
      </div>

      <div className="mt-6">
        <DraftQueue assets={assets} drafts={drafts} savedKey={savedKey} />
      </div>
    </StudioFrame>
  );
}

function PublishChecklist() {
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

function AssetLibrary({
  assets,
  available,
}: {
  assets: StudioAsset[];
  available: boolean;
}) {
  const { blog } = studioCopy;

  return (
    <StudioPanel
      description={blog.assetsDescription}
      icon="image"
      title={blog.assetsTitle}
    >
      <div className="grid gap-6 p-4 sm:p-6 lg:grid-cols-[19rem_minmax(0,1fr)]">
        <form
          action={uploadAssetAction}
          className="h-fit rounded-2xl border border-border bg-background/55 p-4 sm:p-5"
        >
          <FieldLabel htmlFor="asset-file" label={blog.assetFileLabel} />
          <input
            accept="image/avif,image/jpeg,image/png,image/webp"
            className="mt-2.5 block min-h-12 w-full cursor-pointer rounded-xl border border-input bg-background text-sm text-muted-foreground file:mr-3 file:min-h-12 file:cursor-pointer file:border-0 file:border-border file:border-r file:bg-muted file:px-3 file:text-sm file:font-semibold file:text-foreground hover:border-foreground/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            id="asset-file"
            name="file"
            required
            type="file"
          />

          <div className="mt-5">
            <FieldLabel htmlFor="asset-alt" label={blog.assetAltLabel} />
            <input
              aria-describedby="asset-alt-help"
              className={`${studioInputClass} mt-2.5`}
              id="asset-alt"
              maxLength={300}
              name="altText"
              placeholder={blog.assetAltPlaceholder}
              required
              type="text"
            />
            <p
              className="mt-2 text-xs leading-5 text-muted-foreground"
              id="asset-alt-help"
            >
              {blog.assetAltHelp}
            </p>
          </div>

          <StudioSubmitButton
            className="mt-5 w-full"
            icon="image"
            intent="upload-asset"
            pendingLabel={blog.uploadingAsset}
          >
            {blog.uploadAsset}
          </StudioSubmitButton>
        </form>

        <div className="grid content-start gap-4 md:grid-cols-2">
          {assets.length > 0 ? (
            assets.map((asset) => (
              <article
                className="overflow-hidden rounded-2xl border border-border bg-background/55 p-3 transition-colors hover:border-primary/35 motion-reduce:transition-none"
                key={asset.id}
              >
                <div className="grid gap-4 sm:grid-cols-[7rem_minmax(0,1fr)]">
                  <Image
                    alt={asset.altText}
                    className="aspect-square h-28 w-full rounded-xl object-cover sm:w-28"
                    height={asset.height}
                    sizes="(max-width: 640px) 100vw, 112px"
                    src={asset.url}
                    unoptimized={shouldBypassImageOptimization(asset.url)}
                    width={asset.width}
                  />
                  <div className="min-w-0 py-1">
                    <h3 className="truncate text-sm font-semibold text-foreground">
                      {asset.altText}
                    </h3>
                    <p className="mt-1 truncate text-xs text-muted-foreground">
                      {asset.originalName}
                    </p>
                    <p className="mt-2 font-mono text-[0.63rem] font-medium uppercase tracking-[0.1em] text-muted-foreground">
                      {asset.width}×{asset.height} ·{" "}
                      {formatBytes(asset.sizeBytes)}
                    </p>
                    <label
                      className={`${studioLabelClass} mt-4 block`}
                      htmlFor={`asset-markdown-${asset.id}`}
                    >
                      {blog.markdownSnippet}
                    </label>
                    <input
                      className="mt-2 min-h-11 w-full rounded-lg border border-input bg-background px-2.5 font-mono text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      id={`asset-markdown-${asset.id}`}
                      readOnly
                      value={asset.markdown}
                    />
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="md:col-span-2">
              <StudioEmptyState
                body={available ? blog.noAssetsBody : blog.backendUnavailable}
                icon="image"
                title={available ? blog.noAssets : blog.assetsUnavailableTitle}
              />
            </div>
          )}
        </div>
      </div>
    </StudioPanel>
  );
}

function DraftQueue({
  assets,
  drafts,
  savedKey,
}: {
  assets: StudioAsset[];
  drafts: StudioPost[];
  savedKey: string | null;
}) {
  const { blog } = studioCopy;

  return (
    <StudioPanel
      description={blog.queueDescription}
      icon="writing"
      title={blog.queueTitle}
    >
      {drafts.length > 0 ? (
        <div className="grid gap-5 p-4 sm:p-6">
          {drafts.map((post) => (
            <article
              className="rounded-2xl border border-border bg-background/45 p-4 sm:p-5"
              key={post.id}
            >
              <div className="mb-5 flex flex-col gap-3 border-border/70 border-b pb-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="font-heading text-xl font-bold text-foreground">
                    {post.title}
                  </h3>
                  <p className="mt-1 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground">
                    {post.locale.toUpperCase()} ·{" "}
                    {formatStudioDate(post.updatedAt)}
                  </p>
                </div>
                <StudioStatusBadge label="Borrador" tone="draft" />
              </div>

              <form action={updatePostAction}>
                <StudioUnsavedChanges
                  clearWhen={savedKey === studioPostRecoveryKey(post.id)}
                  message={blog.unsavedWarning}
                  storageKey={studioPostRecoveryKey(post.id)}
                />
                <input name="id" type="hidden" value={post.id} />
                <StudioPostFields
                  assets={assets}
                  fieldIdPrefix={`draft-${post.id}`}
                  post={post}
                />
                <div className="mt-6 flex flex-col-reverse gap-3 border-border/80 border-t pt-5 sm:flex-row sm:justify-end">
                  <StudioSubmitButton
                    className="w-full sm:w-auto"
                    intent="save-draft"
                    pendingLabel={blog.savingDraft}
                    variant="secondary"
                  >
                    {blog.saveDraft}
                  </StudioSubmitButton>
                  <StudioSubmitButton
                    className="w-full sm:w-auto"
                    formAction={publishPostAction}
                    icon="spark"
                    intent="publish-draft"
                    pendingLabel={blog.publishing}
                  >
                    {blog.publish}
                  </StudioSubmitButton>
                </div>
              </form>
            </article>
          ))}
        </div>
      ) : (
        <StudioEmptyState
          actionHref="#new-post"
          actionLabel={blog.createTitle}
          body={blog.noDraftsBody}
          testId="studio-blog-empty"
          title={blog.noDraftsTitle}
        />
      )}
    </StudioPanel>
  );
}

function PublishedPosts({
  assets,
  posts,
  savedKey,
}: {
  assets: StudioAsset[];
  posts: StudioPost[];
  savedKey: string | null;
}) {
  const { blog } = studioCopy;

  return (
    <StudioPanel icon="spark" title={blog.publishedTitle}>
      {posts.length > 0 ? (
        <div className="divide-y divide-border/70">
          {posts.map((post) => (
            <article className="px-5 py-5" key={post.id}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="text-base font-semibold leading-6 text-foreground">
                    {post.title}
                  </h3>
                  <p className="mt-2 font-mono text-[0.62rem] uppercase tracking-[0.12em] text-muted-foreground">
                    {post.locale.toUpperCase()} ·{" "}
                    {formatStudioDate(post.updatedAt)} ·{" "}
                    {post.readingTimeMinutes} min
                  </p>
                </div>
                <StudioStatusBadge label="Publicada" tone="live" />
              </div>

              <Link
                className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-full text-sm font-semibold text-primary transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary motion-reduce:transition-none"
                href={`/${post.locale}/blog/${post.slug}`}
              >
                {blog.previewPost}
                <StudioIcon className="size-4" name="external" />
              </Link>

              <details className="group mt-3 rounded-xl border border-border bg-background/45">
                <summary className="flex min-h-11 cursor-pointer items-center justify-between gap-3 rounded-xl px-3 text-sm font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                  {blog.editPublished}
                  <StudioIcon
                    className="size-4 text-primary transition-transform duration-200 group-open:rotate-180 motion-reduce:transition-none"
                    name="chevron"
                  />
                </summary>
                <form
                  action={updatePostAction}
                  className="border-border border-t p-3"
                >
                  <StudioUnsavedChanges
                    clearWhen={savedKey === studioPostRecoveryKey(post.id)}
                    message={blog.unsavedWarning}
                    storageKey={studioPostRecoveryKey(post.id)}
                  />
                  <input name="id" type="hidden" value={post.id} />
                  <StudioPostFields
                    assets={assets}
                    compact
                    fieldIdPrefix={`published-${post.id}`}
                    post={post}
                  />
                  <StudioSubmitButton
                    className="mt-5 w-full"
                    intent="save-published"
                    pendingLabel={blog.savingChanges}
                    variant="secondary"
                  >
                    {blog.saveChanges}
                  </StudioSubmitButton>
                </form>
              </details>

              <form action={unpublishPostAction} className="mt-3">
                <input name="id" type="hidden" value={post.id} />
                <input name="locale" type="hidden" value={post.locale} />
                <input name="slug" type="hidden" value={post.slug} />
                <StudioSubmitButton
                  className="w-full"
                  confirmation={blog.unpublishConfirmation}
                  intent="unpublish"
                  pendingLabel={blog.unpublishing}
                  variant="danger"
                >
                  {blog.unpublish}
                </StudioSubmitButton>
              </form>
            </article>
          ))}
        </div>
      ) : (
        <StudioEmptyState
          body={blog.noPublishedBody}
          title={blog.noPublishedTitle}
        />
      )}
    </StudioPanel>
  );
}

function FieldLabel({ htmlFor, label }: { htmlFor: string; label: string }) {
  return (
    <label className={studioLabelClass} htmlFor={htmlFor}>
      {label}
    </label>
  );
}

function formatStudioDate(value: string) {
  return new Intl.DateTimeFormat("es-MX", {
    day: "2-digit",
    month: "short",
  }).format(new Date(value));
}

function formatBytes(value: number) {
  if (value < 1024) return `${value} B`;
  if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} KB`;
  return `${(value / (1024 * 1024)).toFixed(1)} MB`;
}

function isDraftPost(post: { status: string }) {
  return post.status === "draft";
}

function isPublishedPost(post: { status: string }) {
  return post.status === "published";
}
