"use server";
import { revalidatePath, updateTag } from "next/cache";
import { BLOG_CACHE_TAG } from "@/features/blog/queries";
import { requireStudioSession } from "@/features/studio/auth/session";
import type { StudioActionState } from "@/features/studio/publishing/action-state";
import { studioMutationErrorMessage } from "@/features/studio/publishing/errors";
import { StudioService } from "@/services/studio.service";

export async function saveCategoryAction(
  _: StudioActionState,
  form: FormData,
): Promise<StudioActionState> {
  await requireStudioSession();
  try {
    await StudioService.saveCategory(
      String(form.get("previousName") ?? ""),
      String(form.get("name") ?? ""),
      Number(form.get("position")),
    );
  } catch (error) {
    return { error: studioMutationErrorMessage(error) };
  }
  refreshCategories();
  return { error: null };
}

export async function deleteCategoryAction(
  _: StudioActionState,
  form: FormData,
): Promise<StudioActionState> {
  await requireStudioSession();
  try {
    await StudioService.deleteCategory(String(form.get("name") ?? ""));
  } catch (error) {
    return { error: studioMutationErrorMessage(error) };
  }
  refreshCategories();
  return { error: null };
}

function refreshCategories() {
  updateTag(BLOG_CACHE_TAG);
  revalidatePath("/studio/blog");
  revalidatePath("/[locale]/blog", "layout");
  revalidatePath("/sitemap.xml");
}
