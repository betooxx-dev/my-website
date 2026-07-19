"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createStudioDraft,
  type StudioApiMutationResult,
  setStudioPostPublication,
  updateStudioPost,
  uploadStudioAsset,
} from "@/lib/studio-api";
import {
  studioBlogErrorUrl,
  studioBlogSuccessUrl,
  studioPostRecoveryKey,
} from "@/lib/studio-feedback";
import { draftStudioPostInput } from "@/lib/studio-post-form";
import { requireStudioSession } from "@/lib/studio-session";

export async function createDraftAction(formData: FormData) {
  await requireStudioSession();
  requireSuccessfulMutation(
    await createStudioDraft(draftStudioPostInput(formData)),
  );
  finishStudioMutation(formData, "new-post");
}

export async function updatePostAction(formData: FormData) {
  await requireStudioSession();
  const id = String(formData.get("id") ?? "");
  requireSuccessfulMutation(
    await updateStudioPost(id, draftStudioPostInput(formData)),
  );
  finishStudioMutation(formData, studioPostRecoveryKey(id));
}

export async function publishPostAction(formData: FormData) {
  await requireStudioSession();
  const id = String(formData.get("id") ?? "");
  requireSuccessfulMutation(
    await updateStudioPost(id, draftStudioPostInput(formData)),
  );
  requireSuccessfulMutation(await setStudioPostPublication(id, "publish"));
  finishStudioMutation(formData, studioPostRecoveryKey(id));
}

export async function unpublishPostAction(formData: FormData) {
  await requireStudioSession();
  const id = String(formData.get("id") ?? "");
  requireSuccessfulMutation(await setStudioPostPublication(id, "unpublish"));
  finishStudioMutation(formData, studioPostRecoveryKey(id));
}

export async function uploadAssetAction(formData: FormData) {
  await requireStudioSession();
  requireSuccessfulMutation(await uploadStudioAsset(formData));
  finishStudioMutation(formData, "asset-upload");
}

function requireSuccessfulMutation<T>(result: StudioApiMutationResult<T>) {
  if (!result.ok) redirect(studioBlogErrorUrl(result.message));
  return result.data;
}

function finishStudioMutation(formData: FormData, recoveryKey: string): never {
  revalidatePath("/studio");
  revalidatePath("/studio/blog");
  revalidatePath("/es/blog");
  revalidatePath("/en/blog");
  revalidatePath("/sitemap.xml");

  const locale = String(formData.get("locale") ?? "");
  const slug = String(formData.get("slug") ?? "");
  if ((locale === "es" || locale === "en") && slug) {
    revalidatePath(`/${locale}/blog/${slug}`);
  }

  redirect(studioBlogSuccessUrl(recoveryKey));
}
