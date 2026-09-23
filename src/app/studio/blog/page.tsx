import Link from "next/link";
import { StudioActionForm } from "@/components/features/studio/StudioActionForm";
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
import { CategoryManager } from "./_components/CategoryManager";
import { DraftQueue } from "./_components/DraftQueue";
import { PublishChecklist } from "./_components/PublishChecklist";
import { PublishedPosts } from "./_components/PublishedPosts";
import { isDraftPost, isPublishedPost } from "./_components/studio-blog-utils";
import { createDraftAction } from "./actions";
import { StudioPostFields } from "./post-fields";

type StudioBlogPageProps = {
  searchParams: Promise<{
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

      {savedKey ? <StudioSavedFeedback message={blog.savedNotice} /> : null}

      <CategoryManager
        categories={data.categories.data}
        available={data.categories.status === "available"}
      />

      <div className="mt-8 grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_21rem]">
        <div className="scroll-mt-6" id="new-post">
          <StudioPanel
            description={blog.createDescription}
            icon="writing"
            title={blog.createTitle}
          >
            <StudioActionForm action={createDraftAction} className="p-4 sm:p-6">
              <StudioUnsavedChanges
                clearWhen={savedKey === "new-post"}
                message={blog.unsavedWarning}
                storageKey="new-post"
              />
              <StudioPostFields
                categories={data.categories.data}
                assets={assets}
                fieldIdPrefix="new-post"
              />
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
            </StudioActionForm>
          </StudioPanel>
        </div>

        <aside className="grid gap-6 xl:sticky xl:top-10">
          <PublishChecklist />
          <PublishedPosts
            categories={data.categories.data}
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
        <DraftQueue
          categories={data.categories.data}
          assets={assets}
          drafts={drafts}
          savedKey={savedKey}
        />
      </div>
    </StudioFrame>
  );
}
