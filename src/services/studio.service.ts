import "server-only";
import axios from "axios";
import { z } from "zod";
import {
  type StudioAsset,
  type StudioPost,
  type StudioPostInput,
  type StudioPostStatus,
  type StudioResource,
  studioAssetSchema,
  studioPostSchema,
} from "@/contracts";
import { env } from "@/env";
import { type Locale, locales } from "@/i18n/routing";
import api from "./api";

export class StudioService {
  static async getDashboardData() {
    return { posts: await asResource(getPosts(), []) };
  }

  static async getBlogData() {
    const [posts, assets, ...tags] = await Promise.all([
      asResource(getPosts(), []),
      asResource(getAssets(), []),
      ...locales.map((locale) => asResource(getTags(locale), [])),
    ]);

    return {
      assets,
      posts,
      tags: mergeTags(tags),
    };
  }

  static async createDraft(input: StudioPostInput) {
    if (!input.title || !input.slug || !input.excerpt || !input.category) {
      throw new Error(
        "El título, el slug, el extracto y la categoría son obligatorios.",
      );
    }

    const { data } = await api.post("/blog/admin/posts", input, studioConfig());
    return studioPostSchema.parse(data.data);
  }

  static async updatePost(id: string, input: StudioPostInput) {
    if (!id)
      throw new Error("El identificador de la publicación es obligatorio.");

    const { data } = await api.patch(
      `/blog/admin/posts/${encodeURIComponent(id)}`,
      input,
      studioConfig(),
    );
    return studioPostSchema.parse(data.data);
  }

  static async setPostPublication(id: string, action: "publish" | "unpublish") {
    if (!id)
      throw new Error("El identificador de la publicación es obligatorio.");

    const { data } = await api.post(
      `/blog/admin/posts/${encodeURIComponent(id)}/${action}`,
      undefined,
      studioConfig(),
    );
    return studioPostSchema.parse(data.data);
  }

  static async uploadAsset(input: FormData) {
    const file = input.get("file");
    const altText = String(input.get("altText") ?? "").trim();

    if (file === null || typeof file === "string" || file.size === 0) {
      throw new Error("Debes seleccionar un archivo de imagen.");
    }
    if (!altText) throw new Error("El texto alternativo es obligatorio.");

    const body = new FormData();
    body.set("file", file, file.name);
    body.set("altText", altText);

    const { data } = await api.post("/blog/admin/assets", body, studioConfig());
    return studioAssetSchema.parse(data.data);
  }
}

function studioConfig() {
  if (!env.STUDIO_ARGOS_API_KEY) {
    throw new Error(
      "La clave de API del backend del Studio no está configurada.",
    );
  }

  return {
    headers: { Authorization: `Bearer ${env.STUDIO_ARGOS_API_KEY}` },
  };
}

async function getPosts(status?: StudioPostStatus): Promise<StudioPost[]> {
  const query = status ? `?status=${status}` : "";
  const { data } = await api.get(`/blog/admin/posts${query}`, studioConfig());
  return studioPostSchema.array().parse(data.data);
}

async function getAssets(): Promise<StudioAsset[]> {
  const { data } = await api.get("/blog/admin/assets", studioConfig());
  return studioAssetSchema.array().parse(data.data);
}

async function getTags(locale: Locale): Promise<string[]> {
  const { data } = await api.get(
    `/blog/admin/tags?locale=${locale}`,
    studioConfig(),
  );
  return z.string().array().parse(data.data);
}

async function asResource<T>(
  request: Promise<T>,
  empty: T,
): Promise<StudioResource<T>> {
  try {
    return { data: await request, status: "available" };
  } catch (error) {
    const status = axios.isAxiosError(error)
      ? error.response?.status
      : undefined;
    const unauthorized = status === 401 || status === 403;
    return {
      data: empty,
      status: unauthorized ? "unauthorized" : "unavailable",
    };
  }
}

function mergeTags(
  resources: StudioResource<string[]>[],
): StudioResource<string[]> {
  const unavailable = resources.find(
    (resource) => resource.status !== "available",
  );
  if (unavailable) return { data: [], status: unavailable.status };

  const tags = resources.flatMap((resource) => resource.data);
  return { data: [...new Set(tags)].sort(), status: "available" };
}
