import { z } from "zod";

const localPasswordHash =
  "scrypt:local-studio-salt:0vdEp3zFMNJRLiyYzDoq560rnhIEArNIKn9ZdKuWGMyaHwHUqnxdnSRhbdZeG4UoztiSF2LU9KTlIK7TEhM2VQ";
const passwordHash = z.string().regex(/^scrypt:[^:]+:[A-Za-z0-9_-]+$/);

export function studioServerEnvSchema(production: boolean) {
  return z.object({
    // TODO: Require the HTTPS Argos URL and Studio credentials in production
    // once the backend is deployed. Production currently serves only the
    // portfolio, so the unpublished integration keeps its local fallbacks.
    ARGOS_API_URL: z.url().default("http://localhost:5000/api"),
    NODE_ENV: production
      ? z.literal("production")
      : z.enum(["development", "test"]).default("development"),
    STUDIO_ARGOS_API_KEY: z.string().min(16).optional(),
    STUDIO_USERNAME: z.string().min(3).default("studio"),
    STUDIO_PASSWORD_HASH: passwordHash.default(localPasswordHash),
    STUDIO_SESSION_SECRET: z
      .string()
      .min(24)
      .default("local-studio-session-secret"),
  });
}

export function studioClientEnvSchema(_production: boolean) {
  return z.object({
    // The site URL is resolved from Vercel (or the provisional production URL)
    // before validation. Keep this local default for development consumers.
    NEXT_PUBLIC_SITE_URL: z.url().default("http://localhost:3000"),
    // TODO: Require the public Argos URL when the backend is deployed.
    NEXT_PUBLIC_ARGOS_API_URL: z.url().default("http://localhost:5000/api"),
  });
}
