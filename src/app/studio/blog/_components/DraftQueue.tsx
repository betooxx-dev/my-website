import Link from "next/link";
import { StudioActionForm } from "@/components/features/studio/StudioActionForm";
import { StudioSubmitButton } from "@/components/features/studio/StudioSubmitButton";
import {
  StudioEmptyState,
  StudioPanel,
  StudioStatusBadge,
} from "@/components/features/studio/StudioUi";
import { StudioUnsavedChanges } from "@/components/features/studio/StudioUnsavedChanges";
import type { StudioAsset, StudioPost } from "@/contracts";
import type { StudioCategory } from "@/contracts/studio-contract";
import { studioAdminCopy } from "@/features/studio/admin-copy";
import { studioCopy } from "@/features/studio/content";
import { studioPostRecoveryKey } from "@/features/studio/publishing/feedback";
import { updateDraftAction } from "../actions";
import { StudioPostFields } from "../post-fields";
import { DeletePost } from "./DeletePost";
import { formatStudioDate } from "./studio-blog-utils";

type DraftQueueProps = {
  categories: StudioCategory[];
  assets: StudioAsset[];
  drafts: StudioPost[];
  savedKey: string | null;
};

export function DraftQueue({
  assets,
  categories,
  drafts,
  savedKey,
}: DraftQueueProps) {
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
              id={`post-${post.id}`}
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

              <Link
                className="mb-4 inline-flex min-h-11 items-center text-primary underline"
                href={`/studio/blog/preview/${post.id}`}
              >
                {studioAdminCopy.preview}
              </Link>
              <p className="mb-4 text-xs text-muted-foreground">
                {studioAdminCopy.previewHelp}
              </p>
              <StudioActionForm action={updateDraftAction}>
                <StudioUnsavedChanges
                  clearWhen={savedKey === studioPostRecoveryKey(post.id)}
                  message={blog.unsavedWarning}
                  storageKey={studioPostRecoveryKey(post.id)}
                />
                <input name="id" type="hidden" value={post.id} />
                <StudioPostFields
                  categories={categories}
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
                    icon="spark"
                    intent="publish-draft"
                    pendingLabel={blog.publishing}
                  >
                    {blog.publish}
                  </StudioSubmitButton>
                </div>
              </StudioActionForm>
              <DeletePost id={post.id} title={post.title} />
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
