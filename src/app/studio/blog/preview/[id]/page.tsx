import axios from "axios";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { BlogArticle } from "@/components/features/blog/BlogArticle";
import { studioAdminCopy } from "@/features/studio/admin-copy";
import { requireStudioSession } from "@/features/studio/auth/session";
import { StudioService } from "@/services/studio.service";

export const metadata: Metadata = {
  title: "Vista previa privada",
  robots: { index: false, follow: false },
};

export default async function DraftPreview({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireStudioSession();
  const { id } = await params;
  const post = await StudioService.getPost(id).catch((error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status === 404) notFound();
    throw error;
  });
  const t = await getTranslations({
    locale: post.locale,
    namespace: "blogPost",
  });
  return (
    <main className="py-10 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Link
          className="inline-flex min-h-11 items-center text-primary underline"
          href={`/studio/blog#post-${post.id}`}
        >
          {studioAdminCopy.backToEditor}
        </Link>
        <p className="mt-4 rounded-xl border border-border p-4">
          {studioAdminCopy.savedPreviewNotice}{" "}
          {post.status === "draft"
            ? "Este borrador no está publicado."
            : "Esta publicación ya es pública."}
        </p>
      </div>
      <BlogArticle
        post={{ ...post, date: post.publishedAt }}
        locale={post.locale}
        labels={{
          writtenBy: t("writtenBy"),
          connect: t("connect"),
          cover: t("cover"),
          noCover: t("noCover"),
          draftDate: t("draftDate"),
        }}
      />
    </main>
  );
}
