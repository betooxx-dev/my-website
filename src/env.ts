import { createEnv } from "@t3-oss/env-nextjs";
import { resolveSiteUrl } from "@/lib/site-url";
import {
  studioClientEnvSchema,
  studioServerEnvSchema,
} from "@/lib/studio-env-policy";

const production = process.env.NODE_ENV === "production";
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
    NEXT_PUBLIC_SITE_URL: siteUrl,
    NEXT_PUBLIC_ARGOS_API_URL: process.env.NEXT_PUBLIC_ARGOS_API_URL,
    NODE_ENV: process.env.NODE_ENV,
    STUDIO_ARGOS_API_KEY: process.env.STUDIO_ARGOS_API_KEY,
    STUDIO_USERNAME: process.env.STUDIO_USERNAME,
    STUDIO_PASSWORD_HASH: process.env.STUDIO_PASSWORD_HASH,
    STUDIO_SESSION_SECRET: process.env.STUDIO_SESSION_SECRET,
  },
});
