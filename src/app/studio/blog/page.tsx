import Link from "next/link";
import { StudioFrame } from "@/components/features/studio/StudioFrame";
import { StudioIcon } from "@/components/features/studio/StudioIcon";
import { StudioSavedFeedback } from "@/components/features/studio/StudioSavedFeedback";
import { StudioSubmitButton } from "@/components/features/studio/StudioSubmitButton";
import {
  StudioPageHeader,
  StudioPanel,
  studioSecondaryButtonClass,
} from "@/components/features/studio/StudioUi";
import { StudioUnsavedChanges } from "@/components/features/studio/StudioUnsavedChanges";
import { requireStudioSession } from "@/features/studio/auth/session";
import { studioCopy } from "@/features/studio/content";
import { StudioService } from "@/services/studio.service";
import { AssetLibrary } from "./_components/AssetLibrary";
import { DraftQueue } from "./_components/DraftQueue";
import { PublishChecklist } from "./_components/PublishChecklist";
import { PublishedPosts } from "./_components/PublishedPosts";
import { isDraftPost, isPublishedPost } from "./_components/studio-blog-utils";
import { createDraftAction } from "./actions";
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

  const [data, query] = await Promise.all([
    StudioService.getBlogData(),
    searchParams,
  ]);
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
