import {
  studioInputClass,
  studioLabelClass,
} from "@/components/features/studio/StudioUi";
import type { StudioAsset, StudioPost } from "@/contracts";
import type { StudioCategory } from "@/contracts/studio-contract";
import { studioAdminCopy } from "@/features/studio/admin-copy";
import { studioCopy } from "@/features/studio/content";
import { SeoReview } from "./_components/SeoReview";

type StudioPostFieldsProps = {
  categories: StudioCategory[];
  assets: StudioAsset[];
  compact?: boolean;
  fieldIdPrefix?: string;
  post?: StudioPost;
};

export function StudioPostFields({
  categories,
  assets,
  compact = false,
  fieldIdPrefix = "studio-post",
  post,
}: StudioPostFieldsProps) {
  const { blog } = studioCopy;
  const ids = {
    body: `${fieldIdPrefix}-body`,
    bodyHelp: `${fieldIdPrefix}-body-help`,
    category: `${fieldIdPrefix}-category`,
    cover: `${fieldIdPrefix}-cover`,
    excerpt: `${fieldIdPrefix}-excerpt`,
    featured: `${fieldIdPrefix}-featured`,
    locale: `${fieldIdPrefix}-locale`,
    slug: `${fieldIdPrefix}-slug`,
    slugHelp: `${fieldIdPrefix}-slug-help`,
    tags: `${fieldIdPrefix}-tags`,
    title: `${fieldIdPrefix}-title`,
  };

  return (
    <div className="grid gap-6">
      <fieldset className="grid gap-5 rounded-2xl border border-border bg-background/45 p-4 sm:p-5">
        <legend className="px-2 font-heading text-lg font-bold tracking-tight text-foreground">
          {blog.basicsTitle}
        </legend>

        <Field label={blog.titleLabel} htmlFor={ids.title}>
          <input
            className={studioInputClass}
            defaultValue={post?.title}
            id={ids.title}
            name="title"
            placeholder={blog.titlePlaceholder}
            required
            type="text"
          />
        </Field>

        <div className={compact ? "grid gap-5" : "grid gap-5 md:grid-cols-3"}>
          <Field
            help={blog.slugHelp}
            helpId={ids.slugHelp}
            htmlFor={ids.slug}
            label={blog.slugLabel}
          >
            <input
              aria-describedby={ids.slugHelp}
              className={`${studioInputClass} font-mono text-sm`}
              defaultValue={post?.slug}
              id={ids.slug}
              name="slug"
              pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
              placeholder={blog.slugPlaceholder}
              required
              type="text"
            />
          </Field>

          <Field htmlFor={ids.locale} label={blog.localeLabel}>
            <select
              className={studioInputClass}
              defaultValue={post?.locale ?? "es"}
              id={ids.locale}
              name="locale"
            >
              <option value="es">Español</option>
              <option value="en">Inglés</option>
            </select>
          </Field>

          <Field htmlFor={ids.category} label={blog.categoryLabel}>
            <select
              className={studioInputClass}
              defaultValue={post?.category ?? ""}
              id={ids.category}
              name="category"
              required
            >
              <option value="">{studioAdminCopy.chooseCategory}</option>
              {categories.map((category) => (
                <option key={category.name} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <Field htmlFor={ids.excerpt} label={blog.excerptLabel}>
          <textarea
            className={`${studioInputClass} min-h-28 resize-y py-3`}
            defaultValue={post?.excerpt}
            id={ids.excerpt}
            maxLength={500}
            name="excerpt"
            placeholder={blog.excerptPlaceholder}
            required
          />
        </Field>
      </fieldset>

      <fieldset className="grid gap-5 rounded-2xl border border-border bg-background/45 p-4 sm:p-5">
        <legend className="px-2 font-heading text-lg font-bold tracking-tight text-foreground">
          {blog.distributionTitle}
        </legend>

        <div className={compact ? "grid gap-5" : "grid gap-5 md:grid-cols-2"}>
          <Field htmlFor={ids.tags} label={blog.tagsLabel}>
            <input
              className={studioInputClass}
              defaultValue={post?.tags.join(", ")}
              id={ids.tags}
              name="tags"
              placeholder={blog.tagsPlaceholder}
              type="text"
            />
          </Field>

          <Field htmlFor={ids.cover} label={blog.coverLabel}>
            <select
              className={studioInputClass}
              defaultValue={post?.coverAssetId ?? ""}
              id={ids.cover}
              name="coverAssetId"
            >
              <option value="">{blog.noCover}</option>
              {assets.map((asset) => (
                <option key={asset.id} value={asset.id}>
                  {asset.altText} — {asset.originalName}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <label
          className="flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border border-border bg-background px-3.5 text-sm font-medium text-foreground transition-colors hover:border-primary/35 hover:bg-primary/5 focus-within:ring-2 focus-within:ring-primary motion-reduce:transition-none"
          htmlFor={ids.featured}
        >
          <input
            className="size-4 accent-primary"
            defaultChecked={post?.featured}
            id={ids.featured}
            name="featured"
            type="checkbox"
          />
          <span>{blog.featuredLabel}</span>
        </label>
      </fieldset>

      <fieldset className="grid gap-5 rounded-2xl border border-border bg-background/45 p-4 sm:p-5">
        <legend className="px-2 font-heading text-lg font-bold tracking-tight text-foreground">
          {blog.contentTitle}
        </legend>

        <Field
          help={blog.bodyHelp}
          helpId={ids.bodyHelp}
          htmlFor={ids.body}
          label={blog.bodyLabel}
        >
          <textarea
            aria-describedby={ids.bodyHelp}
            className={`${studioInputClass} min-h-80 resize-y py-3 font-mono text-sm leading-7`}
            defaultValue={post?.contentMarkdown}
            id={ids.body}
            maxLength={200000}
            name="contentMarkdown"
            placeholder={blog.bodyPlaceholder}
            spellCheck
          />
        </Field>
      </fieldset>
      <SeoReview post={post} assets={assets} />
    </div>
  );
}

type FieldProps = {
  children: React.ReactNode;
  help?: string;
  helpId?: string;
  htmlFor: string;
  label: string;
};

function Field({ children, help, helpId, htmlFor, label }: FieldProps) {
  return (
    <div className="grid gap-2.5">
      <label className={studioLabelClass} htmlFor={htmlFor}>
        {label}
      </label>
      {children}
      {help ? (
        <p className="text-xs leading-5 text-muted-foreground" id={helpId}>
          {help}
        </p>
      ) : null}
    </div>
  );
}
