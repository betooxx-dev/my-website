import Link from "next/link";
import { StudioActionForm } from "@/components/features/studio/StudioActionForm";
import { StudioIcon } from "@/components/features/studio/StudioIcon";
import { StudioSubmitButton } from "@/components/features/studio/StudioSubmitButton";
import {
  StudioEmptyState,
  StudioPanel,
  StudioStatusBadge,
} from "@/components/features/studio/StudioUi";
import { StudioUnsavedChanges } from "@/components/features/studio/StudioUnsavedChanges";
import type { StudioAsset, StudioPost } from "@/contracts";
import { studioCopy } from "@/features/studio/content";
import { studioPostRecoveryKey } from "@/features/studio/publishing/feedback";
import { unpublishPostAction, updatePostAction } from "../actions";
import { StudioPostFields } from "../post-fields";
import { formatStudioDate } from "./studio-blog-utils";

type PublishedPostsProps = {
  assets: StudioAsset[];
  posts: StudioPost[];
  savedKey: string | null;
};

export function PublishedPosts({
  assets,
  posts,
  savedKey,
}: PublishedPostsProps) {
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
                <StudioActionForm
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
                </StudioActionForm>
              </details>

              <StudioActionForm action={unpublishPostAction} className="mt-3">
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
              </StudioActionForm>
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
