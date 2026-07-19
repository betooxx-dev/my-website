import "server-only";
import { env } from "@/env";
import { studioApiErrorMessage } from "@/lib/studio-api-error";
import type {
  StudioAsset,
  StudioPost,
  StudioPostInput,
  StudioPostStatus,
  StudioResource,
} from "@/lib/studio-schema";

type ApiEnvelope<T> = {
  data: T;
  success?: boolean;
};

type StudioApiResult<T> =
  | { data: T; ok: true }
  | { ok: false; status: "unauthorized" | "unavailable" };

export type StudioApiMutationResult<T> =
  | { data: T; ok: true }
  | { message: string; ok: false };

export async function getStudioDashboardData() {
  const posts = await getStudioPosts();
  return {
    posts: toResource(posts, []),
  };
}

export async function getStudioBlogData() {
  const [posts, assets, esTags, enTags] = await Promise.all([
    getStudioPosts(),
    getStudioAssets(),
    getStudioTags("es"),
    getStudioTags("en"),
  ]);

  return {
    assets: toResource(assets, []),
    posts: toResource(posts, []),
    tags: toResource(mergeStringResults(esTags, enTags), []),
  };
}

export async function createStudioDraft(
  input: StudioPostInput,
): Promise<StudioApiMutationResult<StudioPost>> {
  if (!input.title || !input.slug || !input.excerpt || !input.category) {
    return {
      message:
        "El título, el slug, el extracto y la categoría son obligatorios.",
      ok: false,
    };
  }

  return writeStudioJson<StudioPost>("/blog/admin/posts", {
    body: input,
    method: "POST",
  });
}

export async function updateStudioPost(
  id: string,
  input: StudioPostInput,
): Promise<StudioApiMutationResult<StudioPost>> {
  if (!id)
    return {
      message: "El identificador de la publicación es obligatorio.",
      ok: false,
    };

  return writeStudioJson<StudioPost>(`/blog/admin/posts/${id}`, {
    body: input,
    method: "PATCH",
  });
}

export async function setStudioPostPublication(
  id: string,
  action: "publish" | "unpublish",
): Promise<StudioApiMutationResult<StudioPost>> {
  if (!id)
    return {
      message: "El identificador de la publicación es obligatorio.",
      ok: false,
    };

  return writeStudioJson<StudioPost>(`/blog/admin/posts/${id}/${action}`, {
    method: "POST",
  });
}

export async function uploadStudioAsset(
  input: FormData,
): Promise<StudioApiMutationResult<StudioAsset>> {
  const file = input.get("file");
  const altText = String(input.get("altText") ?? "").trim();

  if (file === null || typeof file === "string" || file.size === 0) {
    return { message: "Debes seleccionar un archivo de imagen.", ok: false };
  }
  if (!altText) {
    return { message: "El texto alternativo es obligatorio.", ok: false };
  }

  const body = new FormData();
  body.set("file", file, file.name);
  body.set("altText", altText);

  return writeStudioForm<StudioAsset>("/blog/admin/assets", body);
}

async function getStudioPosts(
  status?: StudioPostStatus,
): Promise<StudioApiResult<StudioPost[]>> {
  const search = status ? `?status=${status}` : "";
  return readStudioApi<StudioPost[]>(`/blog/admin/posts${search}`);
}

async function getStudioTags(
  locale: "es" | "en",
): Promise<StudioApiResult<string[]>> {
  return readStudioApi<string[]>(`/blog/admin/tags?locale=${locale}`);
}

async function getStudioAssets(): Promise<StudioApiResult<StudioAsset[]>> {
  return readStudioApi<StudioAsset[]>("/blog/admin/assets");
}

async function readStudioApi<T>(path: string): Promise<StudioApiResult<T>> {
  if (!env.STUDIO_ARGOS_API_KEY) {
    return { ok: false, status: "unavailable" };
  }

  try {
    const response = await fetch(studioApiUrl(path), {
      cache: "no-store",
      headers: studioHeaders(),
    });

    if (response.status === 401 || response.status === 403) {
      return { ok: false, status: "unauthorized" };
    }

    if (!response.ok) {
      return { ok: false, status: "unavailable" };
    }

    return { data: await readJsonData<T>(response), ok: true };
  } catch {
    return { ok: false, status: "unavailable" };
  }
}

async function writeStudioJson<T>(
  path: string,
  init: { body?: unknown; method: "PATCH" | "POST" },
): Promise<StudioApiMutationResult<T>> {
  return writeStudioApi<T>(path, {
    body: init.body ? JSON.stringify(init.body) : undefined,
    headers: { "Content-Type": "application/json" },
    method: init.method,
  });
}

async function writeStudioForm<T>(
  path: string,
  body: FormData,
): Promise<StudioApiMutationResult<T>> {
  return writeStudioApi<T>(path, { body, method: "POST" });
}

async function writeStudioApi<T>(
  path: string,
  init: {
    body?: BodyInit;
    headers?: Record<string, string>;
    method: "PATCH" | "POST";
  },
): Promise<StudioApiMutationResult<T>> {
  if (!env.STUDIO_ARGOS_API_KEY) {
    return {
      message: "La clave de API del backend del Studio no está configurada.",
      ok: false,
    };
  }

  try {
    const response = await fetch(studioApiUrl(path), {
      cache: "no-store",
      method: init.method,
      headers: {
        ...studioHeaders(),
        ...init.headers,
      },
      body: init.body,
    });

    if (!response.ok) {
      return {
        message: await readErrorMessage(response),
        ok: false,
      };
    }

    return { data: await readJsonData<T>(response), ok: true };
  } catch {
    return {
      message: "El backend del Studio no está disponible.",
      ok: false,
    };
  }
}

function studioApiUrl(path: string): string {
  return `${env.ARGOS_API_URL}${path}`;
}

function studioHeaders(): Record<string, string> {
  return {
    Authorization: `Bearer ${env.STUDIO_ARGOS_API_KEY ?? ""}`,
  };
}

async function readJsonData<T>(response: Response): Promise<T> {
  const payload = (await response.json()) as ApiEnvelope<T> | T;

  if (payload && typeof payload === "object" && "data" in payload) {
    return (payload as ApiEnvelope<T>).data;
  }

  return payload as T;
}

async function readErrorMessage(response: Response): Promise<string> {
  try {
    return studioApiErrorMessage(await response.json(), response.status);
  } catch {
    // The status fallback below is still actionable when a proxy returns HTML.
  }

  return studioApiErrorMessage({}, response.status);
}

function mergeStringResults(
  left: StudioApiResult<string[]>,
  right: StudioApiResult<string[]>,
): StudioApiResult<string[]> {
  if (!left.ok) return left;
  if (!right.ok) return right;

  return { data: [...new Set([...left.data, ...right.data])].sort(), ok: true };
}

function toResource<T>(
  result: StudioApiResult<T>,
  empty: T,
): StudioResource<T> {
  if (result.ok) {
    return { data: result.data, status: "available" };
  }

  return { data: empty, status: result.status };
}
