"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireStudioSession } from "@/features/studio/auth/session";
import {
  studioBlogErrorUrl,
  studioBlogSuccessUrl,
  studioPostRecoveryKey,
} from "@/features/studio/publishing/feedback";
import { draftStudioPostInput } from "@/features/studio/publishing/post-form";
import { isLocale } from "@/i18n/routing";
import { StudioService } from "@/services/studio.service";

export async function createDraftAction(formData: FormData) {
  await requireStudioSession();
  await runMutation(StudioService.createDraft(draftStudioPostInput(formData)));
  finishStudioMutation(formData, "new-post");
}

export async function updatePostAction(formData: FormData) {
  await requireStudioSession();
  const id = String(formData.get("id") ?? "");
  await runMutation(
    StudioService.updatePost(id, draftStudioPostInput(formData)),
  );
  finishStudioMutation(formData, studioPostRecoveryKey(id));
}

export async function publishPostAction(formData: FormData) {
  await requireStudioSession();
  const id = String(formData.get("id") ?? "");
  await runMutation(
    StudioService.updatePost(id, draftStudioPostInput(formData)),
  );
  await runMutation(StudioService.setPostPublication(id, "publish"));
  finishStudioMutation(formData, studioPostRecoveryKey(id));
}

export async function unpublishPostAction(formData: FormData) {
  await requireStudioSession();
  const id = String(formData.get("id") ?? "");
  await runMutation(StudioService.setPostPublication(id, "unpublish"));
  finishStudioMutation(formData, studioPostRecoveryKey(id));
}

export async function uploadAssetAction(formData: FormData) {
  await requireStudioSession();
  await runMutation(StudioService.uploadAsset(formData));
  finishStudioMutation(formData, "asset-upload");
}

async function runMutation(operation: Promise<unknown>) {
  try {
    await operation;
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "No se pudo completar la operación.";
    redirect(studioBlogErrorUrl(message));
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
