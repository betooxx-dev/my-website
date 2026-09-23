import assert from "node:assert/strict";
import { createHmac, randomUUID } from "node:crypto";
import fs from "node:fs";
import { parseEnv } from "node:util";

const env = {
  ...parseEnv(fs.readFileSync(".env.local", "utf8")),
  ...process.env,
};
const headers = {
  Authorization: `Bearer ${env.STUDIO_ARGOS_API_KEY}`,
  "Content-Type": "application/json",
};
const root = "http://api:5000/api/blog";
const r = await fetch(`${root}/admin/posts`, {
  method: "POST",
  headers,
  body: JSON.stringify({
    locale: "es",
    slug: `qa-preview-${Date.now()}`,
    title: "QA vista privada",
    excerpt: "Vista privada",
    category: "General",
    contentMarkdown: "Contenido privado de QA",
  }),
});
assert.equal(r.status, 201);
const { data: post } = await r.json();
try {
  const url = `http://localhost:3000/studio/blog/preview/${post.id}`;
  const anonymous = await fetch(url, { redirect: "manual" });
  assert.equal(anonymous.status, 307);
  const payload = Buffer.from(
    JSON.stringify({
      issuedAt: Date.now(),
      expiresAt: Date.now() + 60000,
      nonce: randomUUID(),
      subject: env.STUDIO_USERNAME ?? "studio",
    }),
  ).toString("base64url");
  const signature = createHmac(
    "sha256",
    env.STUDIO_SESSION_SECRET ?? "local-studio-session-secret",
  )
    .update(payload)
    .digest("base64url");
  const signed = await fetch(url, {
    headers: { Cookie: `studio_session=v1.${payload}.${signature}` },
  });
  assert.equal(signed.status, 200);
  const html = await signed.text();
  assert.match(html, /Contenido privado de QA/);
  assert.match(html, /noindex, nofollow/);
  assert.match(html, /Volver al editor/);
  assert.equal((await fetch(`${root}/posts/es/${post.slug}`)).status, 404);
  assert.ok(
    !(await (await fetch("http://localhost:3000/sitemap.xml")).text()).includes(
      post.slug,
    ),
  );
  console.log(
    "PASS private preview: auth, admin content, noindex/nofollow, editor link, no public post or sitemap entry",
  );
} finally {
  await fetch(`${root}/admin/posts/${post.id}`, { method: "DELETE", headers });
}
