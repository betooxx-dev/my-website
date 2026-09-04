"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireStudioSession } from "@/features/studio/auth/session";
import type { StudioActionState } from "@/features/studio/publishing/action-state";
import {
  studioMutationErrorMessage,
  studioPartialPublishMessage,
} from "@/features/studio/publishing/errors";
import {
  studioBlogSuccessUrl,
  studioPostRecoveryKey,
} from "@/features/studio/publishing/feedback";
import { draftStudioPostInput } from "@/features/studio/publishing/post-form";
import { STUDIO_SUBMIT_INTENT_FIELD } from "@/features/studio/publishing/submit-state";
import { isLocale } from "@/i18n/routing";
import { StudioService } from "@/services/studio.service";

export async function createDraftAction(
  _state: StudioActionState,
  formData: FormData,
): Promise<StudioActionState> {
  await requireStudioSession();
  const error = await mutationError(
    StudioService.createDraft(draftStudioPostInput(formData)),
  );
  if (error) return { error };
  finishStudioMutation(formData, "new-post");
}

export async function updatePostAction(
  _state: StudioActionState,
  formData: FormData,
): Promise<StudioActionState> {
  await requireStudioSession();
  const id = String(formData.get("id") ?? "");
  const error = await mutationError(
    StudioService.updatePost(id, draftStudioPostInput(formData)),
  );
  if (error) return { error };
  finishStudioMutation(formData, studioPostRecoveryKey(id));
}

export async function updateDraftAction(
  state: StudioActionState,
  formData: FormData,
): Promise<StudioActionState> {
  const intent = formData.get(STUDIO_SUBMIT_INTENT_FIELD);
  return intent === "publish-draft"
    ? publishPostAction(state, formData)
    : updatePostAction(state, formData);
}

async function publishPostAction(
  _state: StudioActionState,
  formData: FormData,
): Promise<StudioActionState> {
  await requireStudioSession();
  const id = String(formData.get("id") ?? "");
  const updateError = await mutationError(
    StudioService.updatePost(id, draftStudioPostInput(formData)),
  );
  if (updateError) return { error: updateError };

  const publishError = await mutationError(
    StudioService.setPostPublication(id, "publish"),
  );
  if (publishError) {
    return { error: studioPartialPublishMessage(publishError) };
  }

  finishStudioMutation(formData, studioPostRecoveryKey(id));
}

export async function unpublishPostAction(
  _state: StudioActionState,
  formData: FormData,
): Promise<StudioActionState> {
  await requireStudioSession();
  const id = String(formData.get("id") ?? "");
  const error = await mutationError(
    StudioService.setPostPublication(id, "unpublish"),
  );
  if (error) return { error };
  finishStudioMutation(formData, studioPostRecoveryKey(id));
}

export async function uploadAssetAction(
  _state: StudioActionState,
  formData: FormData,
): Promise<StudioActionState> {
  await requireStudioSession();
  const error = await mutationError(StudioService.uploadAsset(formData));
  if (error) return { error };
  finishStudioMutation(formData, "asset-upload");
}

async function mutationError(
  operation: Promise<unknown>,
  fallback?: string,
): Promise<string | null> {
  try {
    await operation;
    return null;
  } catch (error) {
    return studioMutationErrorMessage(error, fallback);
  }
}

function finishStudioMutation(formData: FormData, recoveryKey: string): never {
  revalidatePath("/studio");
  revalidatePath("/studio/blog");
  revalidatePath("/es/blog");
  revalidatePath("/en/blog");
  revalidatePath("/sitemap.xml");

  const locale = String(formData.get("locale") ?? "");
  const slug = String(formData.get("slug") ?? "");
  if (isLocale(locale) && slug) {
    revalidatePath(`/${locale}/blog/${slug}`);
  }

  redirect(studioBlogSuccessUrl(recoveryKey));
}
