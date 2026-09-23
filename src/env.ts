import { createEnv } from "@t3-oss/env-nextjs";
import { resolveSiteUrl } from "@/features/seo/site-url";
import {
  studioClientEnvSchema,
  studioServerEnvSchema,
} from "@/features/studio/env-policy";
import { isStudioEnabled } from "@/features/studio/public-policy";

const production = process.env.NODE_ENV === "production";
const studioEnabled = isStudioEnabled(process.env.NODE_ENV);
const server = studioServerEnvSchema(production);
const client = studioClientEnvSchema(production);
const siteUrl = resolveSiteUrl({
  configuredUrl: process.env.NEXT_PUBLIC_SITE_URL,
  nodeEnv: process.env.NODE_ENV,
  vercelProductionUrl: process.env.VERCEL_PROJECT_PRODUCTION_URL,
});

export const env = createEnv({
  server: server.shape,
  client: client.shape,
  runtimeEnv: {
    ARGOS_API_URL: process.env.ARGOS_API_URL,
    SHOW_DEMO_BLOG_POSTS: process.env.SHOW_DEMO_BLOG_POSTS,
    NEXT_PUBLIC_SITE_URL: siteUrl,
    NEXT_PUBLIC_ARGOS_API_URL: process.env.NEXT_PUBLIC_ARGOS_API_URL,
    NODE_ENV: process.env.NODE_ENV,
    STUDIO_ARGOS_API_KEY: studioEnabled
      ? process.env.STUDIO_ARGOS_API_KEY
      : undefined,
    STUDIO_USERNAME: studioEnabled ? process.env.STUDIO_USERNAME : undefined,
    STUDIO_PASSWORD_HASH: studioEnabled
      ? process.env.STUDIO_PASSWORD_HASH
      : undefined,
    STUDIO_SESSION_SECRET: studioEnabled
      ? process.env.STUDIO_SESSION_SECRET
      : undefined,
  },
});
