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
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await r.json();
  assert.equal(r.status, expected, JSON.stringify(data));
  return data.data;
}
const name = `QA Categoría ${Date.now()}`;
await call("/admin/categories", "POST", { name, position: 7 }, 201);
await call(
  "/admin/categories",
  "POST",
  { name: `  ${name.toUpperCase()}  `, position: 0 },
  409,
);
await call("/admin/categories", "POST", { name: "!!!", position: 0 }, 400);
const p = await call(
  "/admin/posts",
  "POST",
  {
    locale: "es",
    slug: `qa-category-${Date.now()}`,
    title: "QA",
    excerpt: "QA",
    category: name,
  },
  201,
);
await call(
  `/admin/categories/${encodeURIComponent(name)}`,
  "DELETE",
  undefined,
  409,
);
const renamed = `${name} nueva`;
await call(`/admin/categories/${encodeURIComponent(name)}`, "PATCH", {
  name: renamed,
  position: 4,
});
assert.equal((await call(`/admin/posts/${p.id}`)).category, renamed);
await call(`/admin/posts/${p.id}`, "PATCH", { category: "no existe" }, 400);
await call(`/admin/posts/${p.id}`, "DELETE");
await call(`/admin/categories/${encodeURIComponent(renamed)}`, "DELETE");
const denied = await fetch(`${root}/admin/categories`);
assert.equal(denied.status, 401);
console.log(
  "PASS categories: create, normalization, invalid input, rename cascade, referenced deletion, unknown category, auth, cleanup",
);
