import Image from "next/image";
import { StudioSubmitButton } from "@/components/features/studio/StudioSubmitButton";
import {
  StudioEmptyState,
  StudioPanel,
  studioInputClass,
  studioLabelClass,
} from "@/components/features/studio/StudioUi";
import type { StudioAsset } from "@/contracts";
import { shouldBypassImageOptimization } from "@/features/blog/image-policy";
import { studioCopy } from "@/features/studio/content";
import { uploadAssetAction } from "../actions";
import { formatBytes } from "./studio-blog-utils";

type AssetLibraryProps = {
  assets: StudioAsset[];
  available: boolean;
};

export function AssetLibrary({ assets, available }: AssetLibraryProps) {
  const { blog } = studioCopy;

  return (
    <StudioPanel
      description={blog.assetsDescription}
      icon="image"
      title={blog.assetsTitle}
    >
      <div className="grid gap-6 p-4 sm:p-6 lg:grid-cols-[19rem_minmax(0,1fr)]">
        <form
          action={uploadAssetAction}
          className="h-fit rounded-2xl border border-border bg-background/55 p-4 sm:p-5"
        >
          <FieldLabel htmlFor="asset-file" label={blog.assetFileLabel} />
          <input
            accept="image/avif,image/jpeg,image/png,image/webp"
            className="mt-2.5 block min-h-12 w-full cursor-pointer rounded-xl border border-input bg-background text-sm text-muted-foreground file:mr-3 file:min-h-12 file:cursor-pointer file:border-0 file:border-border file:border-r file:bg-muted file:px-3 file:text-sm file:font-semibold file:text-foreground hover:border-foreground/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            id="asset-file"
            name="file"
            required
            type="file"
          />

          <div className="mt-5">
            <FieldLabel htmlFor="asset-alt" label={blog.assetAltLabel} />
            <input
              aria-describedby="asset-alt-help"
              className={`${studioInputClass} mt-2.5`}
              id="asset-alt"
              maxLength={300}
              name="altText"
              placeholder={blog.assetAltPlaceholder}
              required
              type="text"
            />
            <p
              className="mt-2 text-xs leading-5 text-muted-foreground"
              id="asset-alt-help"
            >
              {blog.assetAltHelp}
            </p>
          </div>

          <StudioSubmitButton
            className="mt-5 w-full"
            icon="image"
            intent="upload-asset"
            pendingLabel={blog.uploadingAsset}
          >
            {blog.uploadAsset}
          </StudioSubmitButton>
        </form>

        <div className="grid content-start gap-4 md:grid-cols-2">
          {assets.length > 0 ? (
            assets.map((asset) => (
              <article
                className="overflow-hidden rounded-2xl border border-border bg-background/55 p-3 transition-colors hover:border-primary/35 motion-reduce:transition-none"
                key={asset.id}
              >
                <div className="grid gap-4 sm:grid-cols-[7rem_minmax(0,1fr)]">
                  <Image
                    alt={asset.altText}
                    className="aspect-square h-28 w-full rounded-xl object-cover sm:w-28"
                    height={asset.height}
                    sizes="(max-width: 640px) 100vw, 112px"
                    src={asset.url}
                    unoptimized={shouldBypassImageOptimization(asset.url)}
                    width={asset.width}
                  />
                  <div className="min-w-0 py-1">
                    <h3 className="truncate text-sm font-semibold text-foreground">
                      {asset.altText}
                    </h3>
                    <p className="mt-1 truncate text-xs text-muted-foreground">
                      {asset.originalName}
                    </p>
                    <p className="mt-2 font-mono text-[0.63rem] font-medium uppercase tracking-[0.1em] text-muted-foreground">
                      {asset.width}×{asset.height} ·{" "}
                      {formatBytes(asset.sizeBytes)}
                    </p>
                    <label
                      className={`${studioLabelClass} mt-4 block`}
                      htmlFor={`asset-markdown-${asset.id}`}
                    >
                      {blog.markdownSnippet}
                    </label>
                    <input
                      className="mt-2 min-h-11 w-full rounded-lg border border-input bg-background px-2.5 font-mono text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      id={`asset-markdown-${asset.id}`}
                      readOnly
                      value={asset.markdown}
                    />
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="md:col-span-2">
              <StudioEmptyState
                body={available ? blog.noAssetsBody : blog.backendUnavailable}
                icon="image"
                title={available ? blog.noAssets : blog.assetsUnavailableTitle}
              />
            </div>
          )}
        </div>
      </div>
    </StudioPanel>
  );
}

function FieldLabel({ htmlFor, label }: { htmlFor: string; label: string }) {
  return (
    <label className={studioLabelClass} htmlFor={htmlFor}>
      {label}
    </label>
  );
}
