import type { StudioPostInput } from "@/lib/studio-schema";

export function draftStudioPostInput(formData: FormData): StudioPostInput {
  return {
    category: String(formData.get("category") ?? "").trim(),
    contentMarkdown: String(formData.get("contentMarkdown") ?? ""),
    coverAssetId: normalizeCoverAssetId(formData.get("coverAssetId")),
    excerpt: String(formData.get("excerpt") ?? "").trim(),
    featured: formData.get("featured") === "on",
    locale: normalizeLocale(formData.get("locale")),
    slug: String(formData.get("slug") ?? "").trim(),
    tags: String(formData.get("tags") ?? "")
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean),
    title: String(formData.get("title") ?? "").trim(),
  };
}

function normalizeLocale(value: FormDataEntryValue | null): "es" | "en" {
  return value === "en" || value === "EN" ? "en" : "es";
}

function normalizeCoverAssetId(value: FormDataEntryValue | null) {
  const normalized = String(value ?? "").trim();
  return normalized || null;
}
