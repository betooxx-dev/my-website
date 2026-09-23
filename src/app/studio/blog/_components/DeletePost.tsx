import { StudioActionForm } from "@/components/features/studio/StudioActionForm";
import { StudioSubmitButton } from "@/components/features/studio/StudioSubmitButton";
import { studioAdminCopy } from "@/features/studio/admin-copy";
import { deletePostAction } from "../actions";

export function DeletePost({ id, title }: { id: string; title: string }) {
  return (
    <StudioActionForm action={deletePostAction} className="mt-4">
      <input name="id" type="hidden" value={id} />
      <StudioSubmitButton
        variant="danger"
        confirmation={`¿Eliminar definitivamente «${title}»? Esta acción no se puede deshacer.`}
        pendingLabel="Eliminando…"
      >
        {studioAdminCopy.deletePost}
      </StudioSubmitButton>
    </StudioActionForm>
  );
}
