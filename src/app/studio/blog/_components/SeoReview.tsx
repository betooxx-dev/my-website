"use client";

import { useEffect, useRef, useState } from "react";
import type { StudioAsset, StudioPost } from "@/contracts";
import { env } from "@/env";
import { blogSeoFields } from "@/features/blog/seo";
import { studioAdminCopy } from "@/features/studio/admin-copy";
import type { Locale } from "@/i18n/routing";

export function SeoReview({
  post,
  assets,
}: {
  post?: StudioPost;
  assets: StudioAsset[];
}) {
  const ref = useRef<HTMLElement>(null);
  const [fields, setFields] = useState({
    title: post?.title ?? "",
    excerpt: post?.excerpt ?? "",
    slug: post?.slug ?? "",
    locale: post?.locale ?? ("es" as Locale),
    coverAssetId: post?.coverAssetId ?? "",
  });
  useEffect(() => {
    const form = ref.current?.closest("form");
    if (!form) return;
    const read = () => {
      const data = new FormData(form);
      setFields({
        title: String(data.get("title") ?? ""),
        excerpt: String(data.get("excerpt") ?? ""),
        slug: String(data.get("slug") ?? ""),
        locale: data.get("locale") === "en" ? "en" : "es",
        coverAssetId: String(data.get("coverAssetId") ?? ""),
      });
    };
    read();
    form.addEventListener("input", read);
    form.addEventListener("change", read);
    return () => {
      form.removeEventListener("input", read);
      form.removeEventListener("change", read);
    };
  }, []);
  const cover = assets.find((asset) => {
    return asset.id === fields.coverAssetId;
  });
  const seo = blogSeoFields(fields, env.NEXT_PUBLIC_SITE_URL);
  return (
    <section
      ref={ref}
      className="rounded-2xl border border-border p-4 sm:p-5"
      aria-label={studioAdminCopy.seoTitle}
    >
      <h3 className="font-semibold">{studioAdminCopy.seoTitle}</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        {studioAdminCopy.seoHelp}
      </p>
      <div className="my-4 min-w-0 rounded-xl bg-background p-4">
        <p className="break-all text-xs">{seo.url}</p>
        <p className="mt-2 break-words text-lg text-primary">
          {fields.title ? seo.searchTitle : "Falta el título"}
        </p>
        <p className="mt-2 break-words text-sm">
          {seo.description ||
            "Falta el extracto que se usará como descripción."}
        </p>
      </div>
      <ul className="grid gap-2 text-sm">
        <li>
          {studioAdminCopy.searchTitleLabel} {seo.searchTitle.length}{" "}
          caracteres.{" "}
          {fields.title.trim()
            ? seo.searchTitle.length > 60
              ? "Puede recortarse; revisa que lo esencial aparezca primero."
              : "Título presente. Referencia habitual: 30–60 caracteres."
            : "Falta el título."}
        </li>
        <li>
          Descripción: {fields.excerpt.length} caracteres.{" "}
          {fields.excerpt.trim()
            ? fields.excerpt.length > 160
              ? "Puede recortarse. Referencia habitual: 120–160 caracteres."
              : "Extracto presente. Referencia habitual: 120–160 caracteres."
            : "Falta el extracto."}
        </li>
        <li>URL: {fields.slug ? "Slug presente." : "Falta el slug."}</li>
        <li>
          Portada: {cover ? "Seleccionada." : "Falta una portada disponible."}
        </li>
        <li>
          {studioAdminCopy.altLabel}{" "}
          {cover?.altText.trim()
            ? cover.altText
            : "Falta una descripción real de la portada."}
        </li>
      </ul>
    </section>
  );
}
