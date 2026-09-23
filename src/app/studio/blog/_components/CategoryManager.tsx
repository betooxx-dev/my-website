import { StudioActionForm } from "@/components/features/studio/StudioActionForm";
import { StudioSubmitButton } from "@/components/features/studio/StudioSubmitButton";
import { studioInputClass } from "@/components/features/studio/StudioUi";
import type { StudioCategory } from "@/contracts/studio-contract";
import { studioAdminCopy } from "@/features/studio/admin-copy";
import { deleteCategoryAction, saveCategoryAction } from "../category-actions";

export function CategoryManager({
  categories,
  available,
}: {
  categories: StudioCategory[];
  available: boolean;
}) {
  return (
    <details className="my-6 rounded-2xl border border-border p-5">
      <summary className="cursor-pointer font-semibold">
        {studioAdminCopy.categoriesTitle}
      </summary>
      <p className="my-4 text-sm">{studioAdminCopy.categoriesHelp}</p>
      {!available && (
        <p role="alert">{studioAdminCopy.categoriesUnavailable}</p>
      )}
      <div className="grid gap-5">
        {categories.map((category) => (
          <div
            key={category.name}
            className="grid gap-3 border-b border-border pb-4"
          >
            <StudioActionForm action={saveCategoryAction}>
              <input type="hidden" name="previousName" value={category.name} />
              <CategoryFields category={category} />
              <StudioSubmitButton pendingLabel="Guardando…">
                {studioAdminCopy.saveCategory}
              </StudioSubmitButton>
            </StudioActionForm>
            <StudioActionForm action={deleteCategoryAction}>
              <input type="hidden" name="name" value={category.name} />
              <StudioSubmitButton
                variant="danger"
                confirmation={`¿Eliminar la categoría «${category.name}»?`}
                pendingLabel="Eliminando…"
              >
                {studioAdminCopy.deleteCategory}
              </StudioSubmitButton>
            </StudioActionForm>
          </div>
        ))}
        <StudioActionForm action={saveCategoryAction}>
          <h3 className="mb-3 font-semibold">{studioAdminCopy.newCategory}</h3>
          <CategoryFields />
          <StudioSubmitButton pendingLabel="Creando…">
            {studioAdminCopy.createCategory}
          </StudioSubmitButton>
        </StudioActionForm>
      </div>
    </details>
  );
}

function CategoryFields({ category }: { category?: StudioCategory }) {
  return (
    <div className="mb-3 grid gap-3 sm:grid-cols-2">
      <label>
        Nombre
        <input
          className={studioInputClass}
          name="name"
          required
          maxLength={80}
          defaultValue={category?.name}
        />
      </label>
      <label>
        Orden
        <input
          className={studioInputClass}
          name="position"
          type="number"
          required
          min={0}
          max={10000}
          defaultValue={category?.position ?? 0}
        />
      </label>
    </div>
  );
}
