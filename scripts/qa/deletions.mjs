import assert from "node:assert/strict";
import fs from "node:fs";

const key = fs
  .readFileSync(".env.local", "utf8")
  .split("\n")
  .find((l) => l.startsWith("STUDIO_ARGOS_API_KEY="))
  .split("=")
  .slice(1)
  .join("=")
  .replace(/^"|"$/g, "");
const root = "http://api:5000/api/blog";
async function call(path, method = "GET", body, expected = 200) {
  const r = await fetch(root + path, {
    method,
    headers: {
      Authorization: `Bearer ${key}`,
      ...(body instanceof FormData
        ? {}
        : { "Content-Type": "application/json" }),
    },
    body:
      body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
  });
  const result = await r.json();
  assert.equal(r.status, expected, JSON.stringify(result));
  return result.data;
}
const asset = (await call("/admin/assets"))[0];
const bytes = await (await fetch(`${root}/assets/${asset.id}`)).arrayBuffer();
const form = new FormData();
form.set("file", new Blob([bytes], { type: asset.mimeType }), "qa-delete.webp");
form.set("altText", "Imagen desechable de QA");
const image = await call("/admin/assets", "POST", form, 201);
const post = await call(
  "/admin/posts",
  "POST",
  {
    locale: "es",
    slug: `qa-delete-${Date.now()}`,
    title: "QA eliminación",
    excerpt: "QA",
    category: "General",
    contentMarkdown: `![QA](/api/blog/assets/${image.id.toUpperCase()})`,
  },
  201,
);
await call(`/admin/assets/${image.id}`, "DELETE", undefined, 409);
await call(`/admin/posts/${post.id}`, "PATCH", {
  contentMarkdown: "Contenido",
  coverAssetId: image.id,
});
await call(`/admin/posts/${post.id}/publish`, "POST", undefined, 201);
await call(`/posts/es/${post.slug}`);
await call(`/admin/assets/${image.id}`, "DELETE", undefined, 409);
await call(`/admin/posts/${post.id}`, "DELETE");
await call(`/posts/es/${post.slug}`, "GET", undefined, 404);
await call(`/admin/assets/${image.id}`, "DELETE");
await call(`/admin/assets/${image.id}`, "DELETE", undefined, 404);
console.log(
  "PASS deletions: inline uppercase reference, cover reference, publish, public removal, free asset, repeated deletion",
);
